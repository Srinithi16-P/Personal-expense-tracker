import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", monthlyIncome: "", currency: "INR" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register({ ...form, monthlyIncome: Number(form.monthlyIncome) || 0 });
      navigate("/dashboard");
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors) setErrors(res.errors);
      else setErrors({ general: res?.message || "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 px-6 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-base-950">
            <Wallet size={19} strokeWidth={2.5} />
          </span>
          <span className="text-xl font-semibold text-ink-100">SmartSpend</span>
        </Link>

        <div className="rounded-xl2 border border-base-700 bg-base-850 p-8">
          <h1 className="text-xl font-semibold text-ink-100">Create your account</h1>
          <p className="mt-1 text-sm text-ink-500">Start tracking in under a minute.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Full name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              placeholder="Srinithi"
            />
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              placeholder="8+ chars, mixed case, number, symbol"
            />
            <Input
              label="Monthly income (optional)"
              type="number"
              value={form.monthlyIncome}
              onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })}
              error={errors.monthlyIncome}
              placeholder="25000"
            />

            {errors.general && <p className="text-sm text-red-400">{errors.general}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link to="/login" className="text-accent-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
