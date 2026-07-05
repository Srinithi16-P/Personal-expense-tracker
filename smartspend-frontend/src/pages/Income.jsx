import { useEffect, useState } from "react";
import { Plus, Trash2, TrendingUp } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { PageLoader } from "../components/ui/Spinner";
import { getIncomes, addIncome, deleteIncome } from "../api/income";
import { getErrorMessage } from "../utils/errorMessage";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ source: "", amount: "", notes: "" });
  const [error, setError] = useState("");

  const load = async () => {
    const res = await getIncomes();
    setIncomes(res.data.incomes);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addIncome({ ...form, amount: Number(form.amount) });
      setForm({ source: "", amount: "", notes: "" });
      setOpen(false);
      load();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to add income."));
    }
  };

  const handleDelete = async (id) => {
    await deleteIncome(id);
    load();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink-100">Income</h2>
          <p className="text-sm text-ink-500">Every rupee coming in, in one place.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> Add income</Button>
      </div>

      <Card>
        {incomes.length === 0 ? (
          <EmptyState icon={TrendingUp} title="No income logged yet" subtitle="Add your salary, freelance, or other income sources." />
        ) : (
          <div className="divide-y divide-base-700">
            {incomes.map((i) => (
              <div key={i._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-ink-200">{i.source}</p>
                  <p className="text-xs text-ink-500">{new Date(i.date).toLocaleDateString()} {i.notes && `· ${i.notes}`}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium text-accent-400">+₹{i.amount.toLocaleString()}</p>
                  <button onClick={() => handleDelete(i._id)} className="text-ink-500 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add income">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Source" required value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Freelance, Salary..." />
          <Input label="Amount" type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="15000" />
          <Input label="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="July project payment" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full">Save income</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Income;
