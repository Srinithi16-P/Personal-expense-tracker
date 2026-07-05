import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { resetPassword } from "../api/auth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(token, form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-base-950">
            <Wallet size={19} strokeWidth={2.5} />
          </span>
          <span className="text-xl font-semibold text-ink-100">SmartSpend</span>
        </Link>

        <div className="rounded-xl2 border border-base-700 bg-base-850 p-8">
          {success ? (
            <div className="text-center">
              <h1 className="text-lg font-semibold text-accent-400">Password reset!</h1>
              <p className="mt-2 text-sm text-ink-500">Redirecting you to sign in...</p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-ink-100">Set a new password</h1>
              <p className="mt-1 text-sm text-ink-500">This link is valid for 10 minutes from when it was sent.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input
                  label="New password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="8+ chars, mixed case, number, symbol"
                />
                <Input
                  label="Confirm password"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Resetting..." : "Reset password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
