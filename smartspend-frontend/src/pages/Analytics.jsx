import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card } from "../components/ui/Card";
import { PageLoader } from "../components/ui/Spinner";
import { EmptyState } from "../components/ui/EmptyState";
import { getCategoryBreakdown, getMonthlyTrend, getSavingsPrediction, getSpendingPersonality } from "../api/analytics";

const COLORS = ["#1FD67A", "#34E29A", "#0F9856", "#9AA3B5", "#3A4358", "#727C90"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Analytics = () => {
  const [breakdown, setBreakdown] = useState([]);
  const [trend, setTrend] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [personality, setPersonality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCategoryBreakdown(), getMonthlyTrend(), getSavingsPrediction(), getSpendingPersonality()]).then(
      ([b, t, p, sp]) => {
        setBreakdown(b.data.breakdown);
        setTrend(t.data.trend.map((m) => ({ ...m, label: MONTH_NAMES[m.month - 1] })));
        setPrediction(p.data);
        setPersonality(sp.data);
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink-100">Analytics</h2>
        <p className="text-sm text-ink-500">Real patterns from your real data — nothing hardcoded.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs text-ink-500">Avg monthly income (3mo)</p>
          <p className="mt-1 text-2xl font-semibold text-ink-100">₹{prediction?.avgMonthlyIncome?.toLocaleString() || 0}</p>
        </Card>
        <Card>
          <p className="text-xs text-ink-500">Avg monthly expense (3mo)</p>
          <p className="mt-1 text-2xl font-semibold text-ink-100">₹{prediction?.avgMonthlyExpense?.toLocaleString() || 0}</p>
        </Card>
        <Card>
          <p className="text-xs text-ink-500">Predicted next month savings</p>
          <p className={`mt-1 text-2xl font-semibold ${prediction?.predictedNextMonthSavings >= 0 ? "text-accent-400" : "text-red-400"}`}>
            ₹{prediction?.predictedNextMonthSavings?.toLocaleString() || 0}
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="font-medium text-ink-100">Spending personality</h3>
        <p className="mt-2 text-sm text-ink-300">{personality?.personality}</p>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-medium text-ink-100">Category breakdown (this month)</h3>
          {breakdown.length === 0 ? (
            <EmptyState icon={BarChart3} title="Nothing to show yet" subtitle="Log a few expenses first." />
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdown} dataKey="total" nameKey="category" outerRadius={90} label={(d) => `${d.category} ${d.percent}%`}>
                    {breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#131924", border: "1px solid #242D3F", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-medium text-ink-100">Monthly expense trend</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid stroke="#1A2130" vertical={false} />
                <XAxis dataKey="label" stroke="#727C90" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#727C90" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#131924", border: "1px solid #242D3F", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="expense" fill="#1FD67A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
