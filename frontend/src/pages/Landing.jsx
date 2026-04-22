// src/pages/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import useAuth from "../hooks/useAuth";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <section className="space-y-6">
        <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
          A small place for big doubts
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Clear your college doubts
          <span className="block text-indigo-600">
            with help from your own campus.
          </span>
        </h1>

        <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Ask questions about subjects, labs, and placements. Share notes and
          previous year papers. Learn faster together instead of scrolling
          random forums.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button as={Link} to="/questions">
            Browse questions
          </Button>
          <Button
            variant="outline"
            as={Link}
            to={isAuthenticated ? "/ask" : "/register"}
          >
            {isAuthenticated ? "Ask a question" : "Get started"}
          </Button>
        </div>

        <div className="mt-4 grid max-w-md grid-cols-3 gap-4 text-xs text-slate-500">
          <div>
            <p className="text-lg font-semibold text-slate-900">Subject-wise</p>
            <p>Filter doubts by subject & semester.</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">Resources</p>
            <p>Notes, PYQs, and assignment help.</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">For campus</p>
            <p>Focused on your college context.</p>
          </div>
        </div>
      </section>

      <section className="hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:block">
        <h2 className="text-sm font-semibold text-slate-800">
          What students are asking
        </h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="font-medium text-slate-900">
              How to remember paging vs segmentation for OS viva?
            </p>
            <p className="mt-1 text-xs text-slate-600">
              4 answers · last updated 2 hrs ago
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="font-medium text-slate-900">
              Any notes for CN Unit 2: Network Layer & IP Addressing?
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Linked in resources · 1st year CS
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="font-medium text-slate-900">
              Tips for first campus placement coding round?
            </p>
            <p className="mt-1 text-xs text-slate-600">
              7 answers · marked as helpful
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
