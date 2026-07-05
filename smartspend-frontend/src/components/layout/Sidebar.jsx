import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard, Wallet, TrendingUp, PiggyBank, Target,
  BarChart3, FileText, Bell, Settings, Wallet as Logo,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/income", label: "Income", icon: TrendingUp },
  { to: "/expenses", label: "Expenses", icon: Wallet },
  { to: "/budgets", label: "Budgets", icon: PiggyBank },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-base-700/60 bg-base-900 px-4 py-6 md:flex">
      <Link to="/" className="mb-8 flex items-center gap-2 px-2" title="Back to home">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-base-950">
          <Logo size={18} strokeWidth={2.5} />
        </span>
        <span className="text-lg font-semibold text-ink-100">SmartSpend</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive ? "bg-accent-500/10 text-accent-400" : "text-ink-400 hover:bg-base-800 hover:text-ink-100"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
