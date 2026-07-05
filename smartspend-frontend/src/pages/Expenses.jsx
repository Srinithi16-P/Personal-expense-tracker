import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Trash2, Wallet, Search } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { PageLoader } from "../components/ui/Spinner";
import { CategoryIcon } from "../utils/categoryIcons";
import { getExpenses, addExpense, deleteExpense } from "../api/expense";
import { getErrorMessage } from "../utils/errorMessage";
import { getCategories } from "../api/category";

const Expenses = () => {
  const [searchParams] = useSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [form, setForm] = useState({ category: "", amount: "", paymentMethod: "upi", merchant: "", notes: "" });
  const [error, setError] = useState("");

  const load = async () => {
    const [e, c] = await Promise.all([getExpenses(), getCategories("expense")]);
    setExpenses(e.data.expenses);
    setCategories(c.data.categories);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addExpense({ ...form, amount: Number(form.amount) });
      setForm({ category: "", amount: "", paymentMethod: "upi", merchant: "", notes: "" });
      setOpen(false);
      load();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to add expense."));
    }
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    load();
  };

  const filtered = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesCategory = categoryFilter === "all" || exp.category === categoryFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        exp.category.toLowerCase().includes(q) ||
        exp.merchant?.toLowerCase().includes(q) ||
        exp.notes?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [expenses, search, categoryFilter]);

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const thisMonth = expenses
    .filter((e) => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((s, e) => s + e.amount, 0);
  const avgEntry = expenses.length ? Math.round(totalSpent / expenses.length) : 0;

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink-100">Expenses</h2>
          <p className="text-sm text-ink-500">Adding one here checks your budget instantly.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> Add expense</Button>
      </div>

      {expenses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <p className="text-xs text-ink-500">Total spent</p>
            <p className="mt-1 text-2xl font-semibold text-ink-100">₹{totalSpent.toLocaleString()}</p>
          </Card>
          <Card>
            <p className="text-xs text-ink-500">This month</p>
            <p className="mt-1 text-2xl font-semibold text-ink-100">₹{thisMonth.toLocaleString()}</p>
          </Card>
          <Card>
            <p className="text-xs text-ink-500">Average / entry</p>
            <p className="mt-1 text-2xl font-semibold text-ink-100">₹{avgEntry.toLocaleString()}</p>
          </Card>
        </div>
      )}

      <Card>
        {expenses.length > 0 && (
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by category, merchant, or notes..."
                className="w-full rounded-lg border border-base-600 bg-base-800 py-2.5 pl-9 pr-3 text-sm text-ink-100 placeholder:text-ink-500 outline-none focus:border-accent-500"
              />
            </div>
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="sm:w-48">
              <option value="all">All categories</option>
              {[...new Set(expenses.map((e) => e.category))].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
        )}

        {expenses.length === 0 ? (
          <EmptyState icon={Wallet} title="No expenses yet" subtitle="Log your first expense to see it here and on your dashboard." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Search} title="No matches" subtitle="Try a different search term or category." />
        ) : (
          <div className="divide-y divide-base-700">
            {filtered.map((exp) => (
              <div key={exp._id} className="flex items-center gap-3 py-3">
                <CategoryIcon category={exp.category} />
                <div className="flex-1">
                  <p className="text-ink-200">{exp.merchant || exp.category}</p>
                  <p className="text-xs text-ink-500">
                    {exp.category} · {exp.paymentMethod.toUpperCase()} · {new Date(exp.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium text-ink-100">-₹{exp.amount.toLocaleString()}</p>
                  <button onClick={() => handleDelete(exp._id)} className="text-ink-500 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add expense">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Category"
            required
            list="category-options"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Food, Travel, Shopping..."
          />
          <datalist id="category-options">
            {categories.map((c) => <option key={c._id} value={c.name} />)}
          </datalist>
          <Input label="Amount" type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="500" />
          <Select label="Payment method" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="other">Other</option>
          </Select>
          <Input label="Merchant (optional)" value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} placeholder="BigBasket" />
          <Input label="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Groceries" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full">Save expense</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
