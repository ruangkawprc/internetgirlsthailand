import { createServerFn } from "@tanstack/react-start";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";
const SHEET_ID = "15AvOPdVi_aO526_TJ82a-dsNlCjE9ZQ1zO0sVq4KwpY";

// Public server function: appends a waitlist signup to the Google Sheet.
export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) => {
    const email = input.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }
    return { email };
  })
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const sheetsKey = process.env["GOOGLE_SHEETS_API_KEY"];
    if (!lovableKey || !sheetsKey) throw new Error("Google Sheets is not connected.");
    const headers = {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": sheetsKey,
      "Content-Type": "application/json",
    };

    const readRes = await fetch(`${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/Sheet1!A:A`, { headers });
    if (!readRes.ok) {
      const body = await readRes.text();
      console.error(`Sheets read failed [${readRes.status}]: ${body}`);
      throw new Error("Could not save your signup. Please try again.");
    }
    const rows: string[][] = (await readRes.json()).values ?? [];
    if (rows.some((r) => (r[0] ?? "").trim().toLowerCase() === data.email)) {
      return { status: "duplicate" as const };
    }

    const newRows: string[][] = [];
    if (rows.length === 0) newRows.push(["Email", "Joined at"]);
    newRows.push([data.email, new Date().toISOString()]);

    const appendRes = await fetch(
      `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/Sheet1!A:B:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      { method: "POST", headers, body: JSON.stringify({ values: newRows }) },
    );
    if (!appendRes.ok) {
      const body = await appendRes.text();
      console.error(`Sheets append failed [${appendRes.status}]: ${body}`);
      throw new Error("Could not save your signup. Please try again.");
    }

    // Welcome email — failures never block the signup itself.
    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      await sendTemplateEmail("welcome", data.email, {
        templateData: {},
        idempotencyKey: `welcome-${data.email}`,
      });
    } catch (e) {
      console.error("welcome email failed", e);
    }

    return { status: "joined" as const };
  });
