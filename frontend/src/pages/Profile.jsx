// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../services/api";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [stats, setStats] = useState({ questions: 0, answers: 0, resources: 0 });

  const [form, setForm] = useState({
    name: user?.name || "",
    branch: user?.branch || "",
    year: user?.year || "",
    bio: user?.bio || "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-slate-500">
        Please log in to view your profile.
      </div>
    );
  }

  const initial =
    user.name?.[0]?.toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      // we only send text data, no avatar
      const payload = {
        name: form.name,
        branch: form.branch,
        year: form.year,
        bio: form.bio,
      };

      await updateProfile(payload); // your context should send PUT /auth/me
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.log("Profile update error:", err.response?.data || err.message);
      setMessage(
        err.response?.data?.message || "Could not update profile. Try again."
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/auth/stats");
        setStats(data);
      } catch (err) {
        console.error("stats error:", err.response?.data || err.message);
      }
    };
    if (user) fetchStats();
  }, [user]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Your profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your name and basic details appear on your questions and answers.
        </p>
      </header>

      {/* Small stats */}
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-500">Questions</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {stats.questions}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-500">Answers</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {stats.answers}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-500">Resources</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {stats.resources}
          </p>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        {/* Avatar (initial only) */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-semibold text-white">
            {initial}
          </div>
          <div className="text-xs text-slate-600">
            <p className="font-medium text-slate-800">Profile avatar</p>
            <p className="mt-1">
              Your avatar is generated from the first letter of your name.
            </p>
          </div>
        </div>

        {/* Text fields */}
        <Input
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Branch"
            name="branch"
            value={form.branch}
            onChange={handleChange}
            placeholder="CSE / IT / ENTC"
          />
          <Input
            label="Year"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="FE / SE / TE / BE"
          />
        </div>
        <Input
          label="Bio"
          name="bio"
          textarea
          value={form.bio}
          onChange={handleChange}
          placeholder="Short intro about you, optional."
        />

        {message && <p className="text-xs text-slate-600">{message}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
