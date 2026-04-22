// src/components/questions/QuestionCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import Tag from "../ui/Tag";
import { getAvatar } from "../../utils/avatar";

const QuestionCard = ({ question }) => {
  const {
    _id,
    title,
    description,
    subject,
    tags = [],
    askedBy,
    createdAt,
    answersCount,
  } = question;

  const dateLabel = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : "";

  const avatarSrc = getAvatar(askedBy?.avatar);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <Link
            to={`/questions/${_id}`}
            className="text-base font-semibold text-slate-900 hover:text-indigo-600"
          >
            {title}
          </Link>

          {description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
              {description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            {subject && (
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700">
                {subject}
              </span>
            )}
            {tags.slice(0, 3).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-end justify-between gap-3 sm:mt-0 sm:flex-col sm:items-end">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {askedBy && (
              <>
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={askedBy.name}
                    className="h-7 w-7 rounded-full object-cover border border-slate-200"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
                    {askedBy.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex flex-col text-right">
                  <span className="font-medium text-slate-700">
                    {askedBy.name}
                  </span>
                  {dateLabel && <span>asked on {dateLabel}</span>}
                </div>
              </>
            )}
          </div>
          <Link
            to={`/questions/${_id}#answer-form`}
            className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            {answersCount ?? 0} answers · Answer
          </Link>
        </div>
      </div>
    </article>
  );
};

export default QuestionCard;
