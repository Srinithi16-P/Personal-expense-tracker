import { ShieldOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
const AdminBlocked = () => {
  const { logout } = useAuth();
  const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-950 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-base-800 border border-base-600 text-ink-400">
        <ShieldOff size={26} />
      </div>
      <h1 className="mt-5 text-xl font-semibold text-ink-100">This account is an admin account</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        Admin accounts don't have a personal expense tracker. Head to the admin portal to manage
        the platform instead.
      </p>
      <div className="mt-6 flex gap-3">
        <a href={adminUrl}>
          <Button>Go to admin portal</Button>
        </a>
        <Button variant="secondary" onClick={logout}>Sign out</Button>
      </div>
    </div>
  );
};

export default AdminBlocked;
