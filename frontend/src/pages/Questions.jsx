// frontend/src/pages/Questions.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { useNavigate } from "react-router-dom";
import InitialAvatar from "../components/common/InitialAvatar";

const Questions = () => {
  const { isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    subject: "",
    status: "",
    sort: "newest",
    mine: false,
  });

  const navigate = useNavigate();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/questions", {
        params: {
          search: filters.search || undefined,
          subject: filters.subject || undefined,
          status: filters.status || undefined,
          sort: filters.sort || undefined,
          mine: filters.mine ? "true" : undefined,
        },
      });
      setQuestions(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Questions</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ask and explore doubts from your campus community.
          </p>
        </div>

        {isAuthenticated && (
          <Button onClick={() => navigate("/ask")}>Ask a question</Button>
        )}
      </header>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          onSubmit={handleFilter}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr,1fr,1fr,auto]"
        >
          <Input
            label="Search"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by title or description"
          />
          <Input
            label="Subject"
            name="subject"
            value={filters.subject}
            onChange={handleChange}
            placeholder="e.g. DBMS"
          />
          <div className="flex flex-col gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="h-[38px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All</option>
                <option value="unsolved">Unsolved</option>
                <option value="solved">Solved</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">
                Sort
              </label>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleChange}
                className="h-[38px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="answers">Most answers</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-2">
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                name="mine"
                checked={filters.mine}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Show only my questions
            </label>
            <Button type="submit" className="w-full sm:w-auto mt-auto">
              Apply filters
            </Button>
          </div>
        </form>
      </section>

      {/* List */}
      {loading ? (
        <Loader fullPage />
      ) : questions.length === 0 ? (
        <EmptyState
          title="No questions found"
          description="Try different filters, or ask your first question."
        />
      ) : (
        <section className="space-y-3">
          {questions.map((q) => {
            const name = q.askedBy?.name || "Student";
            const email = q.askedBy?.email;

            return (
              <article
                key={q._id}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm ring-1 ring-transparent transition hover:-translate-y-[1px] hover:border-indigo-200 hover:shadow-md hover:ring-indigo-100"
                onClick={() => navigate(`/questions/${q._id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {q.title}
                    </h3>
                    {q.subject && (
                      <p className="text-xs text-slate-500">{q.subject}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <InitialAvatar name={name} email={email} size={24} />
                    <div className="flex flex-col text-right">
                      <span className="font-medium text-slate-700">
                        {name}
                      </span>
                      <span>
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {q.isSolved && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Solved
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{q.answersCount} answers</span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default Questions;
