import { useEffect, useState } from "react";
import { Users, Send, MessageSquare, ShieldCheck } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { PageLoader } from "../components/ui/Spinner";
import {
  getSystemStats,
  getAllUsers,
  toggleUserStatus,
  sendAnnouncement,
  getAllFeedback,
  updateFeedbackStatus,
} from "../api/admin";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState({ title: "", message: "" });
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  const load = async () => {
    const [s, u, f] = await Promise.all([getSystemStats(), getAllUsers(), getAllFeedback()]);
    setStats(s.data.stats);
    setUsers(u.data.users);
    setFeedback(f.data.feedback);
    setLoading(false);
  };

  useEffect(() => {
    load();
    
    const onNewFeedback = () => load();
    window.addEventListener("smartspend-admin:new_feedback", onNewFeedback);
    return () => window.removeEventListener("smartspend-admin:new_feedback", onNewFeedback);
  }, []);

  const handleToggle = async (id) => {
    await toggleUserStatus(id);
    load();
  };

  const handleAnnounce = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await sendAnnouncement(announcement);
      setNotice(res.data.message);
      setAnnouncement({ title: "", message: "" });
    } catch (err) {
      setNotice(err.response?.data?.message || "Failed to send.");
    } finally {
      setSending(false);
    }
  };

  const handleFeedbackStatus = async (id, status) => {
    await updateFeedbackStatus(id, status);
    load();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div className="flex items-center gap-2">
        <ShieldCheck size={22} className="text-accent-400" />
        <div>
          <h2 className="text-2xl font-semibold text-ink-100">Admin dashboard</h2>
          <p className="text-sm text-ink-500">Platform stats only — individual expenses are never exposed here.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <p className="text-xs text-ink-500">Total users</p>
          <p className="mt-1 text-2xl font-semibold text-ink-100">{stats?.totalUsers}</p>
        </Card>
        <Card>
          <p className="text-xs text-ink-500">Active users</p>
          <p className="mt-1 text-2xl font-semibold text-accent-400">{stats?.activeUsers}</p>
        </Card>
        <Card>
          <p className="text-xs text-ink-500">New today</p>
          <p className="mt-1 text-2xl font-semibold text-ink-100">{stats?.newUsersToday}</p>
        </Card>
        <Card>
          <p className="text-xs text-ink-500">Most used category</p>
          <p className="mt-1 text-2xl font-semibold text-ink-100">{stats?.mostUsedCategory}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 flex items-center gap-2 font-medium text-ink-100"><Users size={16} /> Users</h3>
          {users.length === 0 ? (
            <p className="text-sm text-ink-500">No customer accounts yet.</p>
          ) : (
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {users.map((u) => (
                <div key={u._id} className="flex items-center justify-between border-b border-base-700 pb-3">
                  <div>
                    <p className="text-sm text-ink-200">{u.name}</p>
                    <p className="text-xs text-ink-500">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={u.isActive ? "green" : "red"}>{u.isActive ? "Active" : "Deactivated"}</Badge>
                    <Button variant="secondary" onClick={() => handleToggle(u._id)} className="!px-3 !py-1 text-xs">
                      {u.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 flex items-center gap-2 font-medium text-ink-100"><Send size={16} /> Send announcement</h3>
          <form onSubmit={handleAnnounce} className="space-y-4">
            <Input label="Title" required value={announcement.title} onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })} placeholder="Scheduled maintenance" />
            <Input label="Message" required value={announcement.message} onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })} placeholder="SmartSpend will be down Sunday 2-4 AM." />
            {notice && <p className="text-sm text-accent-400">{notice}</p>}
            <Button type="submit" disabled={sending} className="w-full">
              {sending ? "Sending..." : "Broadcast to all users"}
            </Button>
          </form>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 flex items-center gap-2 font-medium text-ink-100"><MessageSquare size={16} /> Feedback</h3>
        {feedback.length === 0 ? (
          <p className="text-sm text-ink-500">No feedback submitted yet.</p>
        ) : (
          <div className="divide-y divide-base-700">
            {feedback.map((f) => (
              <div key={f._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-ink-200">{f.message}</p>
                  <p className="text-xs text-ink-500">{f.user?.name} · {f.user?.email}</p>
                </div>
                <select
                  value={f.status}
                  onChange={(e) => handleFeedbackStatus(f._id, e.target.value)}
                  className="rounded-lg border border-base-600 bg-base-800 px-2 py-1 text-xs text-ink-200"
                >
                  <option value="open">Open</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
