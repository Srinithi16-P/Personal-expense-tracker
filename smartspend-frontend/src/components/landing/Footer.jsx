import { Wallet } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-base-700/60 py-8">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-sm text-ink-500">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-500 text-base-950">
          <Wallet size={13} strokeWidth={2.5} />
        </span>
        <span className="text-ink-300">SmartSpend</span>
      </div>
      <p>© {new Date().getFullYear()} SmartSpend. Built for the modern budget.</p>
    </div>
  </footer>
);
