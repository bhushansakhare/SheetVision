import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboards from "./pages/Dashboards";
import Dashboard from "./pages/Dashboard";
import Shared from "./pages/Shared";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { refreshSession } from "./api";

function App() {
  // On boot, re-fetch /me so a stale cached role in localStorage gets replaced
  // by the server's current view. This is what promotes an existing logged-in
  // user to superadmin without forcing a logout after SUPER_ADMIN_EMAIL changes.
  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/share/:shareId" element={<Shared />} />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboards"
        element={
          <ProtectedRoute>
            <Dashboards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:id"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
