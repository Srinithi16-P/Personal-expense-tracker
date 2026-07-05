import { FinanceIllustration } from "./FinanceIllustration";

export const ValueProp = () => (
  <section className="border-t border-base-700/60 py-24">
    <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
      <div className="relative order-2 flex items-center justify-center lg:order-1">
        <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
        <FinanceIllustration />
      </div>

      <div className="order-1 lg:order-2">
        <h2 className="text-4xl font-bold leading-tight text-ink-100">
          Take Control of Your Money with SmartSpend
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-400">
          SmartSpend helps you organize your income, expenses, budgets, and savings in one place.
          Keep track of your daily spending, understand where your money goes, plan your monthly
          budget, and work toward your financial goals with confidence.
        </p>
      </div>
    </div>
  </section>
);