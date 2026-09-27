import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// Public server function: saves a waitlist signup to the Lovable Cloud database.
// No session required — visitors join with just an email. RLS allows inserts only.
export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) => {
    const email = input.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }
    return { email };
  })
  .handler(async ({ data }) => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
    const supabasePublic = createClient(process.env['SUPABASE_URL']!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      // Opaque sb_ keys aren't JWTs; send only apikey, not the default Authorization bearer.
      global: { fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      } },
    });

    const { error } = await supabasePublic.from("waitlist").insert({ email: data.email });
    if (error) {
      if (error.code === "23505") return { status: "duplicate" as const };
      throw new Error(error.message);
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
