import { useState } from "react";
import { Bell, LogOut, ChevronDown, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useNavigate, Link } from "react-router-dom";
import { ThemeToggle } from "../ui/ThemeToggle";

export const Topbar = ({ title }) => {
  const { user, logout } = useAuth();
  const { liveNotifications } = useSocket();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/expenses?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-base-700/60 bg-base-900/60 px-6 py-4 backdrop-blur">
      <h1 className="hidden text-lg font-medium text-ink-100 lg:block">{title}</h1>

      <form onSubmit={handleSearch} className="relative w-full max-w-xs">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transactions..."
          className="w-full rounded-full border border-base-600 bg-base-800 py-2 pl-9 pr-3 text-sm text-ink-100 placeholder:text-ink-500 outline-none focus:border-accent-500"
        />
      </form>

      <div className="flex items-center gap-5">
        <ThemeToggle />

        <Link to="/notifications" className="relative text-ink-400 hover:text-ink-100">
          <Bell size={19} />
          {liveNotifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-semibold text-base-950">
              {liveNotifications.length}
            </span>
          )}
        </Link>

        <div className="relative">
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-base-700 text-sm font-medium text-ink-100">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
            <span className="hidden text-sm text-ink-300 sm:block">{user?.name}</span>
            <ChevronDown size={14} className="text-ink-500" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 rounded-lg border border-base-700 bg-base-850 py-1 shadow-lg z-50">
              <button
                onClick={() => navigate("/profile")}
                className="block w-full px-4 py-2 text-left text-sm text-ink-300 hover:bg-base-800"
              >
                Settings
              </button>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-400 hover:bg-base-800"
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
