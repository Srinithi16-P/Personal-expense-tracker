import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout title="Dashboard" />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route element={<DashboardLayout title="Income" />}>
                  <Route path="/income" element={<Income />} />
                </Route>
                <Route element={<DashboardLayout title="Expenses" />}>
                  <Route path="/expenses" element={<Expenses />} />
                </Route>
                <Route element={<DashboardLayout title="Budgets" />}>
                  <Route path="/budgets" element={<Budgets />} />
                </Route>
                <Route element={<DashboardLayout title="Goals" />}>
                  <Route path="/goals" element={<Goals />} />
                </Route>
                <Route element={<DashboardLayout title="Analytics" />}>
                  <Route path="/analytics" element={<Analytics />} />
                </Route>
                <Route element={<DashboardLayout title="Reports" />}>
                  <Route path="/reports" element={<Reports />} />
                </Route>
                <Route element={<DashboardLayout title="Notifications" />}>
                  <Route path="/notifications" element={<Notifications />} />
                </Route>
                <Route element={<DashboardLayout title="Settings" />}>
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
