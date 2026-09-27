import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Facebook, Instagram, LoaderCircle, Menu, Sparkles, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import logo from "@/assets/internet-girls-thailand-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Internet Girls Thailand — Helping women get ahead with AI" },
      { name: "description", content: "A community for women in Thailand to learn, explore, and grow with AI." },
      { property: "og:title", content: "Internet Girls Thailand" },
      { property: "og:description", content: "Helping more women get ahead with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!validEmail) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      setStatus("success");
      setMessage("You're on the list! 💜");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-border/70 bg-background/85 px-4 py-2.5 shadow-soft backdrop-blur-xl sm:px-5">
          <a href="#top" className="flex items-center gap-3" aria-label="Internet Girls Thailand home">
            <img src={logo} alt="" className="size-10 rounded-full object-cover" />
            <span className="hidden text-sm font-bold sm:inline">Internet Girls Thailand</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Main navigation">
            <a href="#about" className="transition-colors hover:text-primary">About</a>
            <a href="#community" className="transition-colors hover:text-primary">Community</a>
            <Button asChild variant="brand" size="pill"><a href="#waitlist">Join the Waitlist</a></Button>
          </nav>
          <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <nav className="mx-auto mt-2 grid max-w-6xl gap-2 rounded-lg border border-border bg-background p-4 shadow-soft md:hidden" aria-label="Mobile navigation">
            <a href="#about" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-3 font-semibold hover:bg-accent">About</a>
            <a href="#community" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-3 font-semibold hover:bg-accent">Community</a>
            <Button asChild variant="brand" size="pill"><a href="#waitlist" onClick={() => setMenuOpen(false)}>Join the Waitlist</a></Button>
          </nav>
        )}
      </header>

      <section id="top" className="bg-page-gradient relative flex min-h-[92svh] items-center overflow-hidden px-5 pb-16 pt-32 sm:px-8 sm:pt-36">
        <div className="absolute left-[8%] top-[22%] size-3 rotate-12 bg-brand-lime" aria-hidden="true" />
        <div className="absolute bottom-[18%] right-[8%] size-5 rounded-full border-4 border-primary/40" aria-hidden="true" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-4 py-2 text-sm font-semibold text-primary backdrop-blur">
              <Sparkles className="size-4" /> A community for curious women
            </div>
            <h1 className="font-display text-5xl leading-[0.98] sm:text-7xl lg:text-8xl">Helping more women get ahead with <span className="text-primary">AI.</span></h1>
            <p id="about" className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Internet Girls Thailand is a community for women to learn, explore, and grow with AI.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button asChild variant="brandLight" size="pill"><a href="#waitlist">Join the Waitlist <ArrowRight /></a></Button>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="icon" className="rounded-full bg-background/60" aria-label="Instagram"><a href="https://www.instagram.com/internetgirls.th/" target="_blank" rel="noreferrer"><Instagram /></a></Button>
                <Button asChild variant="outline" size="icon" className="rounded-full bg-background/60" aria-label="Facebook"><a href="https://www.facebook.com/internetgirlsthailand/" target="_blank" rel="noreferrer"><Facebook /></a></Button>
              </div>
            </div>
          </div>
          <div id="community" className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="float-slow relative mx-auto aspect-square w-[min(78vw,430px)] rounded-full bg-brand-gradient p-3 shadow-brand">
              <img src={logo} alt="Internet Girls Thailand" className="size-full rounded-full object-cover" />
            </div>
            <div className="absolute -bottom-4 left-0 -rotate-3 rounded-md bg-brand-lime px-5 py-3 text-sm font-bold text-brand-ink shadow-soft sm:left-4">Learn · Explore · Grow</div>
          </div>
        </div>
      </section>

      <section id="waitlist" className="bg-primary px-5 py-20 text-primary-foreground sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="mb-3 text-sm font-bold uppercase text-brand-lime">Stay in the loop</p>
            <h2 className="font-display text-4xl leading-tight sm:text-6xl">Be the first to know. 💜</h2>
            <p className="mt-5 max-w-lg leading-7 text-primary-foreground/80">Join the Internet Girls Thailand waitlist to hear about upcoming events, workshops, and community updates.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="rounded-lg bg-background p-5 text-foreground shadow-soft sm:p-7">
            <label htmlFor="email" className="text-sm font-bold">Your email</label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Input id="email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); if (status === "error") setStatus("idle"); }} placeholder="you@example.com" autoComplete="email" maxLength={254} disabled={status === "loading"} aria-describedby="form-message" className="h-12 rounded-full bg-background px-5" />
              <Button type="submit" variant="brandLight" size="pill" disabled={status === "loading"} className="shrink-0">
                {status === "loading" ? <><LoaderCircle className="animate-spin" /> Joining…</> : "Join the Waitlist"}
              </Button>
            </div>
            <p id="form-message" aria-live="polite" className={`mt-3 min-h-5 text-sm font-semibold ${status === "error" ? "text-destructive" : status === "success" ? "text-primary" : "text-muted-foreground"}`}>
              {message || "No spam, just useful updates and community news."}
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
