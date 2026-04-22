// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Questions from "./pages/Questions";
import QuestionDetail from "./pages/QuestionDetail";
import AskQuestion from "./pages/AskQuestion";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import useAuth from "./hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route
            path="/ask"
            element={
              <PrivateRoute>
                <AskQuestion />
              </PrivateRoute>
            }
          />
          <Route path="/resources" element={<Resources />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;
