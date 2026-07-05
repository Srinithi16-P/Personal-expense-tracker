import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, MailCheck } from "lucide-react";
import { forgotPassword } from "../api/auth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true); // backend always returns the same generic response, by design
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
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
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10 text-accent-400">
                <MailCheck size={22} />
              </div>
              <h1 className="text-lg font-semibold text-ink-100">Check your inbox</h1>
              <p className="mt-2 text-sm text-ink-500">
                If <span className="text-ink-300">{email}</span> is registered, a reset link is on its way. It expires in 10 minutes.
              </p>
              <Link to="/login" className="mt-6 inline-block text-sm text-accent-400 hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-ink-100">Forgot your password?</h1>
              <p className="mt-1 text-sm text-ink-500">Enter your email and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-ink-500">
                Remembered it?{" "}
                <Link to="/login" className="text-accent-400 hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
