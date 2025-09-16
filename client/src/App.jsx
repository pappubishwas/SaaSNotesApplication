import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import { getMe } from "./services/api";
import Header from "./components/Header";
import AdminPanel from "./pages/AdminPanel";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getMe()
      .then((data) => setMe(data))
      .catch((err) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("getMe error:", err);
        }
      });
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    setMe(null);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header me={me} handleLogout={handleLogout} />

      <main className="max-w-4xl mx-auto flex-1 p-6">
        <Routes>
          <Route path="/login" element={<Login onLogin={(user) => setMe(user)} />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                {me && me.role === "admin" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Notes me={me} onUpdateMe={setMe} />
                )}
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPanel me={me} />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      <footer className="text-center text-xs text-slate-500 py-4">
        © {new Date().getFullYear()} SaaS Notes. All rights reserved.
      </footer>
    </div>
  );
}
