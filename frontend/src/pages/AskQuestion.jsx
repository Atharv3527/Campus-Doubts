// src/pages/AskQuestion.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../services/api";

const AskQuestion = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    tags: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim())
          : [],
      };
      const res = await api.post("/questions", payload);
      navigate(`/questions/${res.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not post question. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">
          Ask a new question
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Be specific and add subject / tags so others can understand and help
          quickly.
        </p>
      </header>

      <form className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
        <Input
          label="Title *"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Eg: Difference between paging and segmentation with example?"
          required
        />
        <Input
          label="Description"
          name="description"
          textarea
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your doubt, what you tried, and where you got stuck."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="OS, CN, DBMS..."
          />
          <Input
            label="Tags"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="comma, separated, tags"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post question"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestion;
