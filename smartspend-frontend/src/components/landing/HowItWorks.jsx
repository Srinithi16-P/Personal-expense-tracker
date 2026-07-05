import { SectionBackdrop } from "./SectionBackdrop";

const steps = [
  { n: 1, title: "Create your account", desc: "Register in seconds and set your monthly income and currency." },
  { n: 2, title: "Set budgets & goals", desc: "Define category spending limits and savings targets tailored to your life." },
  { n: 3, title: "Track & get alerted", desc: "Log expenses as they happen and get realtime alerts before you overspend." },
];

export const HowItWorks = () => (
  <section id="how-it-works" className="relative border-t border-base-700/60 py-24">
    <SectionBackdrop variant="reverse" />
    <div className="mx-auto max-w-5xl px-6 text-center">
      <h2 className="text-4xl font-bold text-ink-100">Get set up in minutes</h2>
      <p className="mt-4 text-ink-400">Three simple steps to financial clarity.</p>

      <div className="relative mt-14 grid grid-cols-1 gap-10 text-left md:grid-cols-3">
        <div className="absolute left-0 right-0 top-5 hidden h-px bg-base-700 md:block" style={{ marginInline: "16.5%" }} />

        {steps.map((s) => (
          <div key={s.n} className="relative">
            <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 font-semibold text-base-950">
              {s.n}
            </div>
            <h3 className="mt-4 font-semibold text-ink-100">{s.title}</h3>
            <p className="mt-2 text-sm text-ink-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);