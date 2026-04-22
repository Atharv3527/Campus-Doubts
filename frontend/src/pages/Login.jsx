// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loader from "../components/common/Loader";
import useAuth from "../hooks/useAuth";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || "/questions";

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // 🔥 FIXED LOGIN FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form.email, form.password);   // <-- FIXED HERE
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      setError("Google login failed");
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed");
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">
          Login to ask questions and access campus resources.
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@college.edu"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader /> : "Log in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Sign up
          </Link>
        </p>

        <div className="mt-4 flex items-center justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
