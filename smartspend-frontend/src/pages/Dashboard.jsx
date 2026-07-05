import { useEffect, useState, useCallback } from "react";
import { TrendingUp, TrendingDown, PiggyBank, ArrowUpRight } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { PageLoader } from "../components/ui/Spinner";
import { EmptyState } from "../components/ui/EmptyState";
import { CategoryIcon, getCategoryMeta } from "../utils/categoryIcons";
import { getDashboardSummary, getCategoryBreakdown, getMonthlyTrend, getSpendingPersonality } from "../api/analytics";
import { getBudgets } from "../api/budget";
import { useAuth } from "../context/AuthContext";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const toneFor = (status) => (status === "Exceeded" ? "red" : status === "Warning" ? "amber" : "green");

const StatCard = ({ label, value, icon: Icon, iconColor, valueColor = "text-ink-100" }) => (
  <Card>
    <div className="flex items-start justify-between">
      <p className="text-xs text-ink-500">{label}</p>
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: `${iconColor}1A`, color: iconColor }}
      >
        <Icon size={15} />
      </span>
    </div>
    <p className={`mt-2 text-2xl font-semibold ${valueColor}`}>{value}</p>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [trend, setTrend] = useState([]);
  const [personality, setPersonality] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    const [s, b, t, p, bg] = await Promise.all([
      getDashboardSummary(),
      getCategoryBreakdown(),
      getMonthlyTrend(),
      getSpendingPersonality(),
      getBudgets(),
    ]);
    setSummary(s.data.summary);
    setBreakdown(b.data.breakdown);
    setTrend(t.data.trend.map((m) => ({ ...m, label: MONTH_NAMES[m.month - 1] })));
    setPersonality(p.data);
    setBudgets(bg.data.budgets);
  }, []);

  useEffect(() => {
    loadAll().finally(() => setLoading(false));
    const onExpenseAdded = () => loadAll();
    window.addEventListener("smartspend:expense_added", onExpenseAdded);
    return () => window.removeEventListener("smartspend:expense_added", onExpenseAdded);
  }, [loadAll]);

  if (loading) return <PageLoader />;

  const savings = summary?.savings ?? 0;
  const grandTotal = breakdown.reduce((s, c) => s + c.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink-100">Welcome back, {user?.name?.split(" ")[0]}</h2>
        <p className="text-sm text-ink-500">Here's how this month is shaping up.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Income this month" value={`₹${summary?.monthlyIncome?.toLocaleString() || 0}`} icon={TrendingUp} iconColor="#1FD67A" valueColor="text-accent-400" />
        <StatCard label="Expenses this month" value={`₹${summary?.monthlyExpense?.toLocaleString() || 0}`} icon={TrendingDown} iconColor="#E24B4A" />
        <StatCard label="Net savings" value={`₹${savings.toLocaleString()}`} icon={PiggyBank} iconColor="#3B82F6" valueColor={savings >= 0 ? "text-accent-400" : "text-red-400"} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-medium text-ink-100">Cash flow — last 6 months</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1FD67A" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1FD67A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgb(var(--c-base-700))" vertical={false} />
                <XAxis dataKey="label" stroke="rgb(var(--c-ink-500))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgb(var(--c-ink-500))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgb(var(--c-base-800))", border: "1px solid rgb(var(--c-base-600))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="income" stroke="#1FD67A" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#3B82F6" strokeWidth={2} fill="url(#expenseGrad)" name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-2 font-medium text-ink-100">Spending breakdown</h3>
          {breakdown.length === 0 ? (
            <EmptyState title="No expenses yet" subtitle="Add an expense to see your category breakdown." />
          ) : (
            <>
              <div className="relative h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={breakdown} dataKey="total" nameKey="category" innerRadius={48} outerRadius={70} paddingAngle={2}>
                      {breakdown.map((c, i) => (
                        <Cell key={i} fill={getCategoryMeta(c.category).color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "rgb(var(--c-base-800))", border: "1px solid rgb(var(--c-base-600))", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-ink-500">Spent</p>
                  <p className="text-lg font-semibold text-ink-100">₹{grandTotal.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {breakdown.slice(0, 5).map((c) => (
                  <div key={c.category} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-ink-300">
                      <span className="h-2 w-2 rounded-full" style={{ background: getCategoryMeta(c.category).color }} />
                      {c.category}
                    </span>
                    <span className="text-ink-500">{c.percent}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-ink-100">Budget health this month</h3>
            <a href="/budgets" className="flex items-center gap-1 text-sm text-accent-400 hover:underline">
              Manage <ArrowUpRight size={14} />
            </a>
          </div>
          {budgets.length === 0 ? (
            <EmptyState title="No budgets set" subtitle="Create a budget to start tracking your spending limits." />
          ) : (
            <div className="space-y-4">
              {budgets.map((b) => (
                <div key={b._id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-ink-200">
                      <CategoryIcon category={b.category} size={14} />
                      {b.category}
                    </span>
                    <span className="flex items-center gap-2 text-ink-500">
                      ₹{b.spent.toLocaleString()} / ₹{b.limit.toLocaleString()}
                      <Badge tone={toneFor(b.status)}>{b.status}</Badge>
                    </span>
                  </div>
                  <ProgressBar percent={b.percentUsed} tone={toneFor(b.status)} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-medium text-ink-100">Spending personality</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">
            {personality?.personality || "Add a few expenses to see your spending personality."}
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 font-medium text-ink-100">Recent transactions</h3>
        {summary?.recentExpenses?.length ? (
          <div className="divide-y divide-base-700">
            {summary.recentExpenses.map((e) => (
              <div key={e._id} className="flex items-center gap-3 py-3 text-sm">
                <CategoryIcon category={e.category} />
                <div className="flex-1">
                  <p className="text-ink-200">{e.merchant || e.category}</p>
                  <p className="text-xs text-ink-500">{e.category} · {new Date(e.date).toLocaleDateString()}</p>
                </div>
                <p className="font-medium text-ink-100">-₹{e.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No transactions yet" subtitle="Your recent expenses will show up here." />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
