import { createServerFn } from "@tanstack/react-start";

// Public server function: stores a waitlist signup in the Lovable Cloud database.
export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) => {
    const email = input.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }
    return { email };
  })
  .handler(async ({ data }) => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) throw new Error("Cloud is not connected.");

    // sb_ keys are opaque (not JWTs): use apikey header, no Authorization bearer.
    const headers = {
      apikey: key,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    };

    const insertRes = await fetch(`${url}/rest/v1/waitlist`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email: data.email }),
    });
    if (!insertRes.ok) {
      const body = await insertRes.text();
      if (insertRes.status === 409 || body.includes("23505")) {
        return { status: "duplicate" as const };
      }
      console.error(`Waitlist insert failed [${insertRes.status}]: ${body}`);
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
