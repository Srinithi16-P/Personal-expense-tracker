import { useEffect, useState } from "react";
import { Bell, Trash2, CheckCheck } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { PageLoader } from "../components/ui/Spinner";
import { getNotifications, markRead, markAllRead, deleteNotification } from "../api/notification";

const typeTone = { budget_warning: "amber", budget_exceeded: "red", goal_completed: "green", announcement: "gray", general: "gray" };

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await getNotifications();
    setItems(res.data.notifications);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRead = async (id) => { await markRead(id); load(); };
  const handleReadAll = async () => { await markAllRead(); load(); };
  const handleDelete = async (id) => { await deleteNotification(id); load(); };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink-100">Notifications</h2>
          <p className="text-sm text-ink-500">Budget alerts, goal milestones, and announcements.</p>
        </div>
        {items.some((i) => !i.isRead) && (
          <Button variant="secondary" onClick={handleReadAll}><CheckCheck size={16} /> Mark all read</Button>
        )}
      </div>

      <Card>
        {items.length === 0 ? (
          <EmptyState icon={Bell} title="You're all caught up" subtitle="New alerts will show up here in real time." />
        ) : (
          <div className="divide-y divide-base-700">
            {items.map((n) => (
              <div key={n._id} className={`flex items-center justify-between py-3 ${!n.isRead ? "opacity-100" : "opacity-60"}`}>
                <div className="flex items-start gap-3">
                  <Badge tone={typeTone[n.type] || "gray"}>{n.type.replace("_", " ")}</Badge>
                  <div>
                    <p className="text-sm text-ink-200">{n.title}</p>
                    <p className="text-xs text-ink-500">{n.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!n.isRead && (
                    <button onClick={() => handleRead(n._id)} className="text-xs text-accent-400 hover:underline">Mark read</button>
                  )}
                  <button onClick={() => handleDelete(n._id)} className="text-ink-500 hover:text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
