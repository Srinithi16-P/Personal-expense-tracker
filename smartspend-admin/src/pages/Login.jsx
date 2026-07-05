import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ThemeToggle } from "../components/ui/ThemeToggle";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 px-6">
      <div className="absolute right-6 top-6"><ThemeToggle /></div>
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-base-800 border border-base-600 text-accent-400">
            <ShieldCheck size={19} />
          </span>
          <span className="text-xl font-semibold text-ink-100">SmartSpend Admin</span>
        </div>

        <div className="rounded-xl2 border border-base-700 bg-base-850 p-8">
          <h1 className="text-xl font-semibold text-ink-100">Admin sign in</h1>
          <p className="mt-1 text-sm text-ink-500">Restricted to platform administrators.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Admin email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@smartspend.com"
            />
            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink-500">
          This portal is separate from the SmartSpend customer app and only accepts admin accounts.
        </p>
      </div>
    </div>
  );
};

export default Login;
