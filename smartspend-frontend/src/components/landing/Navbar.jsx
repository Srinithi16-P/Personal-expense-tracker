import { Link, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-base-700/60 bg-base-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-base-950">
            <Wallet size={18} strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold text-ink-100">SmartSpend</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-ink-400 md:flex">
          <a href="#features" className="hover:text-ink-100 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-ink-100 transition-colors">How it works</a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Button onClick={() => navigate("/dashboard")}>Go to dashboard</Button>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="text-sm text-ink-300 hover:text-ink-100 transition-colors">
                Sign in
              </button>
              <Button onClick={() => navigate("/register")}>Get started</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
