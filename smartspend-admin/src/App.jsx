import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Topbar } from "./components/layout/Topbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const Shell = ({ children }) => (
  <div className="min-h-screen bg-base-950">
    <Topbar />
    {children}
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/"
                  element={
                    <Shell>
                      <Dashboard />
                    </Shell>
                  }
                />
              </Route>
              <Route path="*" element={<Login />} />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
