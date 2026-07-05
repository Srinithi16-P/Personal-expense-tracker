import { ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../ui/ThemeToggle";

export const Topbar = () => {
  const { admin, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-base-700/60 bg-base-900/60 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-base-800 border border-base-600 text-accent-400">
          <ShieldCheck size={17} />
        </span>
        <span className="text-lg font-semibold text-ink-100">SmartSpend Admin</span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <span className="text-sm text-ink-300">{admin?.name}</span>
        <button onClick={logout} className="flex items-center gap-1 text-sm text-red-400 hover:underline">
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </header>
  );
};
