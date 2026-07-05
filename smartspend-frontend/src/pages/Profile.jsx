import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../api/auth";
import { submitFeedback, getMyFeedback } from "../api/feedback";

const statusTone = { open: "amber", reviewed: "gray", resolved: "green" };

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ monthlyIncome: user?.monthlyIncome || 0, currency: user?.currency || "INR" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [feedback, setFeedback] = useState("");
  const [myFeedback, setMyFeedback] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadFeedback = async () => {
    const res = await getMyFeedback();
    setMyFeedback(res.data.feedback);
  };

  useEffect(() => {
    loadFeedback();
    const onStatusUpdate = () => loadFeedback();
    window.addEventListener("smartspend:feedback_status_updated", onStatusUpdate);
    return () => window.removeEventListener("smartspend:feedback_status_updated", onStatusUpdate);
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(profileForm);
      setUser(res.data.user);
      setMessage({ type: "success", text: "Profile updated." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update." });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await changePassword(passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setMessage({ type: "success", text: "Password changed." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    try {
      await submitFeedback({ message: feedback });
      setFeedback("");
      setMessage({ type: "success", text: "Thanks for the feedback!" });
      loadFeedback();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to submit." });
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink-100">Settings</h2>
        <p className="text-sm text-ink-500">{user?.name} · {user?.email}</p>
      </div>

      {message.text && (
        <p className={`text-sm ${message.type === "success" ? "text-accent-400" : "text-red-400"}`}>{message.text}</p>
      )}

      <Card>
        <h3 className="mb-4 font-medium text-ink-100">Profile</h3>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <Input label="Monthly income" type="number" value={profileForm.monthlyIncome} onChange={(e) => setProfileForm({ ...profileForm, monthlyIncome: e.target.value })} />
          <Input label="Currency" value={profileForm.currency} onChange={(e) => setProfileForm({ ...profileForm, currency: e.target.value })} />
          <Button type="submit">Save changes</Button>
        </form>
      </Card>

      <Card>
        <h3 className="mb-4 font-medium text-ink-100">Change password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input label="Current password" type="password" required value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
          <Input label="New password" type="password" required value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
          <Button type="submit">Update password</Button>
        </form>
      </Card>

      <Card>
        <h3 className="mb-4 font-medium text-ink-100">Send feedback</h3>
        <form onSubmit={handleFeedback} className="space-y-4">
          <Input label="Message" required value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="What would make SmartSpend better?" />
          <Button type="submit" variant="secondary">Submit feedback</Button>
        </form>

        {myFeedback.length > 0 && (
          <div className="mt-6 border-t border-base-700 pt-4">
            <p className="mb-3 text-sm font-medium text-ink-300">Your feedback history</p>
            <div className="space-y-3">
              {myFeedback.map((f) => (
                <div key={f._id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-ink-200">{f.message}</p>
                    <p className="text-xs text-ink-500">{new Date(f.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge tone={statusTone[f.status]}>{f.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
