import { useEffect, useState } from "react";
import { Plus, PiggyBank, Trash2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { EmptyState } from "../components/ui/EmptyState";
import { PageLoader } from "../components/ui/Spinner";
import { CategoryIcon } from "../utils/categoryIcons";
import { getBudgets, createBudget, deleteBudget } from "../api/budget";
import { getErrorMessage } from "../utils/errorMessage";

const now = new Date();
const toneFor = (status) => (status === "Exceeded" ? "red" : status === "Warning" ? "amber" : "green");

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: "", limit: "", month: now.getMonth() + 1, year: now.getFullYear() });
  const [error, setError] = useState("");

  const load = async () => {
    const res = await getBudgets({ month: form.month, year: form.year });
    setBudgets(res.data.budgets);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createBudget({ ...form, limit: Number(form.limit), month: Number(form.month), year: Number(form.year) });
      setForm({ ...form, category: "", limit: "" });
      setOpen(false);
      load();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create budget."));
    }
  };

  const handleDelete = async (id) => {
    await deleteBudget(id);
    load();
  };

  if (loading) return <PageLoader />;

  const totalBudgeted = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = Math.max(totalBudgeted - totalSpent, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink-100">Budgets</h2>
          <p className="text-sm text-ink-500">Set a limit per category — SmartSpend watches it for you.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> Create budget</Button>
      </div>

      {budgets.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <p className="text-xs text-ink-500">Total budgeted</p>
            <p className="mt-1 text-2xl font-semibold text-ink-100">₹{totalBudgeted.toLocaleString()}</p>
          </Card>
          <Card>
            <p className="text-xs text-ink-500">Spent so far</p>
            <p className="mt-1 text-2xl font-semibold text-ink-100">₹{totalSpent.toLocaleString()}</p>
          </Card>
          <Card>
            <p className="text-xs text-ink-500">Remaining</p>
            <p className="mt-1 text-2xl font-semibold text-accent-400">₹{totalRemaining.toLocaleString()}</p>
          </Card>
        </div>
      )}

      {budgets.length === 0 ? (
        <Card>
          <EmptyState icon={PiggyBank} title="No budgets this month" subtitle="Create one to unlock the budget health meter and alerts." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {budgets.map((b) => (
            <Card key={b._id}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-medium text-ink-100">
                  <CategoryIcon category={b.category} size={16} />
                  {b.category}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge tone={toneFor(b.status)}>{b.status}</Badge>
                  <button
                    onClick={() => handleDelete(b._id)}
                    aria-label={`Delete ${b.category} budget`}
                    className="text-ink-500 hover:text-red-400"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-ink-500">₹{b.spent.toLocaleString()} of ₹{b.limit.toLocaleString()} spent</p>
              <div className="mt-3">
                <ProgressBar percent={b.percentUsed} tone={toneFor(b.status)} />
              </div>
              <p className="mt-2 text-xs text-ink-500">₹{b.remaining.toLocaleString()} remaining · {b.percentUsed}% used</p>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create budget">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Category"
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Food"
          />
          <p className="-mt-2 text-xs text-ink-500">Category names are matched without case sensitivity — "Food" and "food" are treated as the same category.</p>
          <Input label="Monthly limit" type="number" required value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} placeholder="6000" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Month" type="number" min="1" max="12" required value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
            <Input label="Year" type="number" required value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full">Save budget</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Budgets;
