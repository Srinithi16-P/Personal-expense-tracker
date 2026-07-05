import { TrendingUp, PiggyBank, Target, RefreshCw, BarChart3, Bell } from "lucide-react";
import { SectionBackdrop } from "./SectionBackdrop";

const features = [
  { icon: TrendingUp, title: "Income & expense tracking", desc: "Log every rupee in and out, categorized and searchable in seconds.", color: "#1FD67A" },
  { icon: PiggyBank, title: "Smart budgets", desc: "Set category limits and watch a live health meter keep you on track.", color: "#3B82F6" },
  { icon: Target, title: "Savings goals", desc: "Turn plans into targets with deadlines, progress bars, and payoff alerts.", color: "#EC4899" },
  { icon: RefreshCw, title: "Realtime sync", desc: "Add an expense on one device, see it update everywhere instantly.", color: "#F5A524" },
  { icon: BarChart3, title: "Rich analytics", desc: "Category breakdowns, monthly trends, and a savings prediction.", color: "#A855F7" },
  { icon: Bell, title: "Smart alerts", desc: "Get notified the moment you cross 90% of any budget — in-app and by email.", color: "#EF4444" },
];

export const Features = () => (
  <section id="features" className="relative border-t border-base-700/60 py-24">
    <SectionBackdrop />
    <div className="mx-auto max-w-7xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-ink-100">Everything you need to master your money</h2>
        <p className="mt-4 text-ink-400">
          One dashboard replaces the spreadsheets, sticky notes, and half a dozen apps you use today.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {features.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="rounded-xl2 border border-base-700 bg-base-850 p-6 transition-colors hover:border-accent-500/40">
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: `${color}1A`, color }}
            >
              <Icon size={20} />
            </div>
            <h3 className="font-semibold text-ink-100">{title}</h3>
            <p className="mt-2 text-sm text-ink-400">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);