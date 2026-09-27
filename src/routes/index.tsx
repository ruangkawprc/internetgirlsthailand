import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Facebook, FileSpreadsheet, Instagram, LoaderCircle, Menu, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import * as XLSX from "xlsx";
import asiaMap from "@/assets/asia-dot-map.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const WAITLIST_KEY = "igt-waitlist";
const INSTAGRAM = "https://www.instagram.com/internetgirls.th/";
const FACEBOOK = "https://www.facebook.com/internetgirlsthailand/";
const PARTNER = "https://internet-girls-ai.vercel.app/";

type WaitlistEntry = { email: string; joinedAt: string };

function loadWaitlist(): WaitlistEntry[] {
  try {
    const raw = window.localStorage.getItem(WAITLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveWaitlist(entries: WaitlistEntry[]) {
  window.localStorage.setItem(WAITLIST_KEY, JSON.stringify(entries));
}

function downloadWaitlist() {
  const entries = loadWaitlist();
  const rows = entries.map((entry, index) => ({
    No: index + 1,
    Email: entry.email,
    "Joined At": new Date(entry.joinedAt).toLocaleString(),
  }));
  const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ No: "", Email: "", "Joined At": "" }]);
  worksheet["!cols"] = [{ wch: 6 }, { wch: 36 }, { wch: 24 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Waitlist");
  XLSX.writeFile(workbook, "internet-girls-thailand-waitlist.xlsx");
}

// Set to an event object to show it; null shows the "coming soon" state.
const UPCOMING_EVENT: null | { name: string; description: string; date: string; href: string } = null;

// Decorative country labels overlaid on the dotted Asia map (percent coordinates).
// Thailand is most prominent; Philippines and Vietnam are secondary; the rest of
// Southeast Asia is labeled smaller.
const MAP_LABELS: { name: string; x: number; y: number; tier: "hero" | "major" | "minor" }[] = [
  { name: "Thailand", x: 47, y: 55.5, tier: "hero" },
  { name: "Philippines", x: 68.5, y: 57.5, tier: "major" },
  { name: "Vietnam", x: 60.5, y: 64.5, tier: "major" },
  { name: "Myanmar", x: 38.5, y: 62, tier: "minor" },
  { name: "Laos", x: 57.5, y: 60, tier: "minor" },
  { name: "Cambodia", x: 55.5, y: 71.5, tier: "minor" },
  { name: "Malaysia", x: 45.5, y: 78, tier: "minor" },
  { name: "Singapore", x: 53.5, y: 82, tier: "minor" },
  { name: "Brunei", x: 71, y: 76.5, tier: "minor" },
  { name: "Indonesia", x: 72, y: 87.5, tier: "major" },
  { name: "Timor-Leste", x: 78.5, y: 91.5, tier: "minor" },
];

const MAP_LABEL_STYLES: Record<"hero" | "major" | "minor", string> = {
  hero: "text-lg font-bold tracking-wide sm:text-2xl text-brand-dark",
  major: "text-sm font-semibold sm:text-base text-primary",
  minor: "text-[10px] font-medium sm:text-xs text-primary-foreground/85",
};

const PILLARS = [
  { label: "Learn", title: "Free AI workshops", body: "Beginner friendly, hands on sessions that make AI easier to understand and use, with no technical background required." },
  { label: "Build", title: "Learn by doing", body: "Use AI to create something yourself, from AI agents and websites to creative projects and practical tools." },
  { label: "Connect", title: "Find your people", body: "Meet women who are curious about AI, share what you're learning, and build a community together." },
];

const FAQ: { q: string; a: string[] }[] = [
  { q: "Who can join?", a: ["Anyone can join. You don't need to be studying or working in tech, and you don't need any previous AI experience.", "Whether you're a student, professional, founder, creator, or simply curious about AI, you're welcome in the Internet Girls Thailand community."] },
  { q: "Do I need AI or coding experience?", a: ["No. Our events are designed to be accessible to people at different levels, including complete beginners. Specific events may have their own requirements, which we'll clearly state when applicable."] },
  { q: "Are the events free?", a: ["Yes. Internet Girls Thailand is committed to making AI learning accessible, so our community events and learning activities are free to participants."] },
  { q: "What kind of events do you host?", a: ["We host different types of events, including hands on AI workshops, speaker sessions, panel discussions, and community meetups.", "Topics can range from practical AI tools and AI agents to career journeys, emerging technology, creativity, and how AI is changing different industries."] },
  { q: "How often do you host events?", a: ["We aim to host events every 1–2 months, primarily in Bangkok.", "As the community grows, we hope to expand our activities and reach more women across Thailand."] },
  { q: "Where are events held?", a: ["Our current focus is Bangkok, where we host in person workshops, speaker sessions, panels, and community events."] },
  { q: "How can I stay updated?", a: ["Follow @internetgirlsthailand on Instagram and join our community to hear about upcoming events, workshops, speaker sessions, and other opportunities."] },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Internet Girls Thailand — Making AI accessible to more women" },
      { name: "description", content: "A community for women to learn, experiment, and build with AI for free. Free AI workshops and events, starting in Bangkok." },
      { property: "og:title", content: "Internet Girls Thailand" },
      { property: "og:description", content: "Making AI accessible to more women in Thailand." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="star-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.58 0.2 255)" />
          <stop offset="55%" stopColor="oklch(0.68 0.15 295)" />
          <stop offset="100%" stopColor="oklch(0.76 0.09 215)" />
        </linearGradient>
      </defs>
      <path fill="url(#star-g)" d="M12 1.5l3.1 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.3l-6.4 3.6 1.5-7.1L1.7 8.9l7.2-.8z" />
    </svg>
  );
}

const pillBtn = "h-13 rounded-full px-7 text-xs font-bold uppercase tracking-[0.14em]";

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      const entries = loadWaitlist();
      const normalized = email.trim().toLowerCase();
      if (!entries.some((entry) => entry.email === normalized)) {
        entries.push({ email: normalized, joinedAt: new Date().toISOString() });
        saveWaitlist(entries);
      }
      setStatus("success");
      setMessage("You're on the list!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const navLinks = [
    { href: "#what-we-do", label: "What we do" },
    { href: "#events", label: "Events" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-border/60 bg-background/85 px-4 py-2 shadow-soft backdrop-blur-md sm:px-5">
          <a href="#top" className="flex items-center gap-2.5" aria-label="Internet Girls Thailand home">
            <Star className="size-9" />
            <span className="font-display text-lg font-semibold italic">Internet Girls <em className="text-gradient not-italic">Thailand</em></span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex" aria-label="Main navigation">
            {navLinks.map((l) => <a key={l.href} href={l.href} className="transition-colors hover:text-primary">{l.label}</a>)}
            <Button asChild variant="brand" className={`${pillBtn} h-10 px-5`}><a href="#join">Join the community</a></Button>
          </nav>
          <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <nav className="mx-auto mt-2 grid max-w-6xl gap-1 rounded-3xl border border-border bg-background p-4 shadow-soft md:hidden" aria-label="Mobile navigation">
            {navLinks.map((l) => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="rounded-full px-4 py-3 font-medium hover:bg-muted">{l.label}</a>)}
            <Button asChild variant="brand" className={pillBtn}><a href="#join" onClick={() => setMenuOpen(false)}>Join the community</a></Button>
          </nav>
        )}
      </header>

      {/* HERO */}
      <section id="top" className="bg-page-gradient relative flex min-h-svh items-center overflow-hidden px-5 pb-20 pt-36 text-primary-foreground sm:px-8">
        <div className="mx-auto w-full max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-foreground/85 sm:text-sm">Internet Girls Thailand</p>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-medium leading-[1.02] sm:text-7xl lg:text-[5.5rem]">
            Making AI accessible to <em className="text-gradient-light pr-1">more women</em> in <em className="text-gradient-light">Thailand</em>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-semibold sm:text-xl">A community for women to learn, experiment, and build with AI for free.</p>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-primary-foreground/85">
            Proudly run in partnership with <a href={PARTNER} target="_blank" rel="noreferrer" className="underline underline-offset-4">Internet Girls</a>, we bring free AI workshops, events, and community opportunities to women across Thailand, starting in Bangkok.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand" className={`${pillBtn} h-13`}><a href="#join">Join the community <ArrowRight /></a></Button>
            <Button asChild variant="brandOutline" className={pillBtn}><a href="#events"><span className="text-gradient">See upcoming events</span></a></Button>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-4xl leading-tight sm:text-6xl">AI is changing the way we <em className="text-gradient">learn, work, and create.</em></h2>
          <p className="mt-8 text-xl font-bold sm:text-2xl">We believe women should have the opportunity to be part of that change.</p>
          <div className="mt-8 grid gap-6 text-lg leading-8 text-muted-foreground md:grid-cols-2">
            <p>Internet Girls Thailand creates free, accessible spaces for women to learn about AI, try new tools, build real things, and meet others who are learning alongside them.</p>
            <p>Starting with in person workshops in Bangkok, we're building a local community that can grow across Thailand.</p>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section id="what-we-do" className="scroll-mt-24 px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-brand-dark">What we do</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <article key={p.label} className={`flex flex-col rounded-[2rem] p-8 shadow-soft transition-transform hover:-translate-y-1 sm:p-10 ${i === 1 ? "bg-brand-gradient text-primary-foreground" : "border border-border bg-card"}`}>
                <span className={`w-fit rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] ${i === 1 ? "bg-primary-foreground/20" : "bg-secondary text-brand-dark"}`}>{p.label}</span>
                <h3 className="mt-8 font-display text-3xl italic">{p.title}</h3>
                <p className={`mt-4 leading-7 ${i === 1 ? "text-primary-foreground/90" : "text-muted-foreground"}`}>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* THAILAND */}
      <section className="bg-page-gradient overflow-hidden px-5 py-24 text-primary-foreground sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl leading-tight sm:text-6xl">Starting in Bangkok. <em className="text-gradient-light">Building across Thailand.</em></h2>
            <p className="mt-8 text-lg font-semibold">We're starting locally with free in person workshops and community events in Bangkok.</p>
            <p className="mt-4 leading-7 text-primary-foreground/85">Our goal is to create a space where women in Thailand can access AI education, gain practical skills, and build confidence with technology, regardless of their background or level of experience.</p>
            <p className="mt-4 leading-7 text-primary-foreground/85">As the community grows, we hope to bring more learning opportunities and connections to women across Thailand.</p>
            <p className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-full bg-primary-foreground/15 px-5 py-3 text-sm font-bold">Bangkok → Thailand → Southeast Asia 🌏</p>
          </div>
          <div className="relative">
            <img src={asiaMap} alt="Dotted map of Asia with Southeast Asia countries labeled and Thailand highlighted" width={1280} height={1024} loading="lazy" className="w-full opacity-90 brightness-0 invert" />
            <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
              {MAP_LABELS.map((label) => (
                <span
                  key={label.name}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap ${MAP_LABEL_STYLES[label.tier]}`}
                  style={{
                    left: `${label.x}%`,
                    top: `${label.y}%`,
                    textShadow:
                      label.tier === "hero"
                        ? "0 1px 3px rgba(255, 255, 255, 0.75), 0 0 16px rgba(255, 255, 255, 0.55)"
                        : label.tier === "major"
                          ? "0 1px 10px rgba(255, 255, 255, 0.65)"
                          : "0 1px 8px rgba(35, 25, 75, 0.5)",
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
            <div className="absolute" style={{ left: "48.8%", top: "67.5%" }} aria-hidden="true">
              <span className="radar-ping absolute left-0 top-0 size-40 rounded-full border-2 border-primary-foreground/80" />
              <span className="radar-ping absolute left-0 top-0 size-40 rounded-full border-2 border-primary-foreground/80 [animation-delay:0.8s]" />
              <span className="radar-ping absolute left-0 top-0 size-40 rounded-full bg-primary-foreground/20 [animation-delay:1.6s]" />
              <span className="absolute left-0 top-0 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-strong ring-4 ring-primary-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-dark">Upcoming event</p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl">What's happening in <em className="text-gradient">Thailand?</em></h2>
          <div className="mt-12 rounded-[2rem] border border-border bg-card p-8 text-left shadow-soft sm:p-12">
            {UPCOMING_EVENT ? (
              <>
                <h3 className="font-display text-3xl">{UPCOMING_EVENT.name}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{UPCOMING_EVENT.description}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                  <span>📍 Bangkok</span><span>📅 {UPCOMING_EVENT.date}</span><span className="text-primary">Free · Beginner friendly</span>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Button asChild variant="brand" className={pillBtn}><a href={UPCOMING_EVENT.href}>Register <ArrowRight /></a></Button>
                  <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">See all events →</a>
                </div>
              </>
            ) : (
              <div className="text-center">
                <h3 className="font-display text-3xl italic sm:text-4xl">We're just getting started.</h3>
                <p className="mx-auto mt-4 max-w-md leading-7 text-muted-foreground">Our first Internet Girls Thailand workshops and events are coming soon.</p>
                <Button asChild variant="brand" className={`${pillBtn} mt-8`}><a href={INSTAGRAM} target="_blank" rel="noreferrer">Follow us for updates <ArrowRight /></a></Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-4xl text-brand-dark sm:text-6xl">FAQ</h2>
          <Accordion type="single" collapsible className="mt-12 space-y-3">
            {FAQ.map((item, i) => (
              <AccordionItem key={item.q} value={`q${i}`} className="rounded-3xl border border-border bg-card px-6 shadow-soft last:border-b">
                <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline sm:text-lg [&>svg]:text-brand-dark">{item.q}</AccordionTrigger>
                <AccordionContent className="space-y-3 pb-6 text-base leading-7 text-muted-foreground">
                  {item.a.map((para) => <p key={para}>{para}</p>)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* JOIN */}
      <section id="join" className="bg-page-gradient scroll-mt-20 px-5 py-24 text-primary-foreground sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
          <div>
            <Star className="size-14" />
            <h2 className="mt-6 font-display text-4xl leading-tight sm:text-6xl">Join the <em className="text-gradient-light">community.</em></h2>
          </div>
          <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] bg-background p-6 text-foreground shadow-soft sm:p-8">
            <label htmlFor="email" className="text-sm font-bold">Your email</label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Input id="email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); if (status === "error") setStatus("idle"); }} placeholder="you@example.com" autoComplete="email" maxLength={254} disabled={status === "loading"} aria-describedby="form-message" className="h-12 rounded-full bg-background px-5" />
              <Button type="submit" variant="brand" disabled={status === "loading"} className={`${pillBtn} h-12 shrink-0`}>
                {status === "loading" ? <><LoaderCircle className="animate-spin" /> Joining…</> : "Join"}
              </Button>
            </div>
            <p id="form-message" aria-live="polite" className={`mt-3 min-h-5 text-sm font-semibold ${status === "error" ? "text-destructive" : status === "success" ? "text-primary" : "text-muted-foreground"}`}>{message}</p>
            <Button type="button" variant="outline" size="sm" onClick={downloadWaitlist} className="mt-2 rounded-full">
              <FileSpreadsheet /> Download waitlist (.xlsx)
            </Button>
          </form>
        </div>
      </section>

      <footer className="px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>In partnership with <a href={PARTNER} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">Internet Girls</a></p>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="icon" className="rounded-full" aria-label="Instagram"><a href={INSTAGRAM} target="_blank" rel="noreferrer"><Instagram /></a></Button>
            <Button asChild variant="outline" size="icon" className="rounded-full" aria-label="Facebook"><a href={FACEBOOK} target="_blank" rel="noreferrer"><Facebook /></a></Button>
          </div>
        </div>
      </footer>
    </main>
  );
}
