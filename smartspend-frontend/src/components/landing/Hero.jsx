import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { FinanceIllustration } from "./FinanceIllustration";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(31,214,122,0.10),transparent_45%)]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-base-600 bg-base-800 px-3 py-1 text-xs text-ink-300">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
            Your money, finally organized
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.08] tracking-tight text-ink-100 lg:text-6xl">
            Take control of every dollar with{" "}
            <span className="text-accent-500">SmartSpend</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-ink-400">
            The all-in-one personal finance dashboard for tracking income, expenses, budgets, and
            goals — with realtime alerts the moment something needs your attention.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button onClick={() => navigate("/register")} className="px-6 py-3">
              Get started free <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" onClick={() => navigate("/login")} className="px-6 py-3">
              Sign in
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-ink-500">
            <ShieldCheck size={16} className="text-accent-500" />
            Your data stays yours. No card required.
          </div>
        </div>

        <div className="relative flex items-center justify-center py-6">
          <FinanceIllustration />
        </div>
      </div>
    </section>
  );
};