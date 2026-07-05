import { useEffect, useState } from "react";
import { Plus, Target, Trash2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { EmptyState } from "../components/ui/EmptyState";
import { PageLoader } from "../components/ui/Spinner";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../api/goal";
import { getErrorMessage } from "../utils/errorMessage";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [contributeId, setContributeId] = useState(null);
  const [contributeAmount, setContributeAmount] = useState("");
  const [form, setForm] = useState({ title: "", targetAmount: "", deadline: "" });
  const [error, setError] = useState("");

  const load = async () => {
    const res = await getGoals();
    setGoals(res.data.goals);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createGoal({ ...form, targetAmount: Number(form.targetAmount) });
      setForm({ title: "", targetAmount: "", deadline: "" });
      setOpen(false);
      load();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create goal."));
    }
  };

  const handleContribute = async (goal) => {
    const newAmount = goal.savedAmount + Number(contributeAmount || 0);
    await updateGoal(goal._id, { savedAmount: newAmount });
    setContributeId(null);
    setContributeAmount("");
    load();
  };

  const handleDelete = async (id) => {
    await deleteGoal(id);
    load();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink-100">Goals</h2>
          <p className="text-sm text-ink-500">Turn plans into targets you can actually hit.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> New goal</Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <EmptyState icon={Target} title="No goals yet" subtitle="Create a savings goal — like an emergency fund or a trip." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {goals.map((g) => (
            <Card key={g._id}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-ink-100">{g.title}</h3>
                <div className="flex items-center gap-2">
                  {g.isCompleted && <Badge tone="green">Completed</Badge>}
                  <button onClick={() => handleDelete(g._id)} className="text-ink-500 hover:text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-ink-500">₹{g.savedAmount.toLocaleString()} of ₹{g.targetAmount.toLocaleString()}</p>
              <div className="mt-3"><ProgressBar percent={g.progressPercent} tone={g.isCompleted ? "green" : "green"} /></div>
              <p className="mt-2 text-xs text-ink-500">
                {g.progressPercent}% funded{g.deadline && ` · due ${new Date(g.deadline).toLocaleDateString()}`}
              </p>

              {!g.isCompleted && (
                contributeId === g._id ? (
                  <div className="mt-3 flex gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={contributeAmount}
                      onChange={(e) => setContributeAmount(e.target.value)}
                      className="!py-1.5"
                    />
                    <Button onClick={() => handleContribute(g)} className="shrink-0 !px-3 !py-1.5 text-xs">Add</Button>
                  </div>
                ) : (
                  <button onClick={() => setContributeId(g._id)} className="mt-3 text-sm text-accent-400 hover:underline">
                    + Add contribution
                  </button>
                )
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create goal">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Goal title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Emergency fund" />
          <Input label="Target amount" type="number" required value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} placeholder="50000" />
          <Input label="Deadline (optional)" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full">Save goal</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Goals;
