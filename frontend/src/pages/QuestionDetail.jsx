// src/pages/QuestionDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnswerCard from "../components/questions/AnswerCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import Tag from "../components/ui/Tag";
import InitialAvatar from "../components/common/InitialAvatar";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // AI suggestion state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiError, setAiError] = useState("");

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/questions/${id}`);
      setQuestion(res.data.question);
      setAnswers(res.data.answers || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddAnswer = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/questions/${id}` } });
      return;
    }
    if (!answerText.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/questions/${id}/answers`, {
        content: answerText.trim(),
      });
      setAnswers((prev) => [res.data, ...prev]);
      setAnswerText("");
      setAiSuggestion("");
    } catch (err) {
      console.error("Add answer error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "Could not post answer. Check console for details."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (answerId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/questions/${id}` } });
      return;
    }
    try {
      const res = await api.post(`/answers/${answerId}/upvote`);
      setAnswers((prev) =>
        prev.map((a) => (a._id === answerId ? res.data : a))
      );
    } catch {}
  };

  const handleAccept = async (answerId) => {
    if (!isAuthenticated) return;
    try {
      const res = await api.post(`/answers/${answerId}/accept`);
      const accepted = res.data.answer;
      setAnswers((prev) =>
        prev.map((a) =>
          a._id === accepted._id ? accepted : { ...a, isAccepted: false }
        )
      );
    } catch {}
  };

  const handleGetAiSuggestion = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/questions/${id}` } });
      return;
    }

    setAiError("");
    setAiLoading(true);
    try {
      const { data } = await api.post(`/questions/${id}/ai-suggest`, {
        draft: answerText,
      });
      setAiSuggestion(data.suggestion || "");
    } catch (err) {
      console.error("AI suggestion error:", err.response?.data || err.message);
      setAiError(
        err.response?.data?.message ||
          "Could not generate AI suggestion. Try again."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseSuggestion = () => {
    if (!aiSuggestion) return;
    setAnswerText(aiSuggestion);
  };

  if (loading) return <Loader fullPage />;

  if (!question) {
    return (
      <EmptyState
        title="Question not found"
        description="The question you are looking for does not exist or was removed."
      />
    );
  }

  const ownerId =
    question.askedBy?._id ||
    question.askedBy ||
    question.createdBy?._id ||
    question.createdBy;

  const isOwner = user && ownerId && ownerId === user._id;

  const handleDelete = async () => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/questions/${question._id}`);
      navigate("/questions");
    } catch (err) {
      console.error(
        "Delete question error:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Could not delete question.");
    }
  };

  const askerName = question.askedBy?.name || "Student";
  const askerEmail = question.askedBy?.email;

  return (
    <div className="space-y-6">
      <button
        className="text-xs text-slate-500 hover:text-slate-700"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* Question Card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900">
                {question.title}
              </h1>
              {question.isSolved && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                  Solved
                </span>
              )}
            </div>

            {question.description && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {question.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {question.subject && (
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700">
                  {question.subject}
                </span>
              )}
              {(question.tags || []).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>

          {/* Asker info + avatar */}
          <div className="flex flex-col items-end gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <InitialAvatar name={askerName} email={askerEmail} size={32} />
              <div className="flex flex-col text-right">
                <span className="font-medium text-slate-800">
                  {askerName}
                </span>
                <span>
                  asked on {new Date(question.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {isOwner && (
              <Button variant="outline" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Answers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Answers ({answers.length})
          </h2>
        </div>

        {answers.length === 0 ? (
          <EmptyState
            title="No answers yet"
            description="Be the first one to help. Write a clear and helpful answer for future students."
          />
        ) : (
          <div className="space-y-3">
            {answers.map((ans) => (
              <AnswerCard
                key={ans._id}
                answer={ans}
                onUpvote={() => handleUpvote(ans._id)}
                onAccept={() => handleAccept(ans._id)}
                isQuestionOwner={isOwner}
              />
            ))}
          </div>
        )}
      </section>

      {/* Answer form + AI suggestion */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-800">Your answer</h2>
          {isAuthenticated && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleGetAiSuggestion}
              disabled={aiLoading}
            >
              {aiLoading ? "Thinking…" : "Get AI suggestion"}
            </Button>
          )}
        </div>

        {!isAuthenticated && (
          <p className="text-xs text-slate-500">
            Please{" "}
            <button
              onClick={() =>
                navigate("/login", {
                  state: { from: `/questions/${id}` },
                })
              }
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              log in
            </button>{" "}
            to post an answer or use AI suggestions.
          </p>
        )}

        {aiSuggestion && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-xs text-slate-800 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-[11px] uppercase tracking-wide text-indigo-700">
                AI suggestion
              </span>
              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={handleUseSuggestion}
              >
                Use this answer
              </Button>
            </div>
            <p className="whitespace-pre-line leading-relaxed">
              {aiSuggestion}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Review and edit the suggestion before posting. Do not copy blindly
              in exams.
            </p>
          </div>
        )}

        {aiError && <p className="text-xs text-red-500">{aiError}</p>}

        <form className="space-y-3" onSubmit={handleAddAnswer}>
          <Input
            textarea
            placeholder="Write a clear explanation that would help your junior understand this later..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={!isAuthenticated}
          />
          <Button type="submit" disabled={!isAuthenticated || submitting}>
            {submitting ? "Posting…" : "Post answer"}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default QuestionDetail;
