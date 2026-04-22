// src/components/questions/AnswerCard.jsx
import React from "react";
import Button from "../ui/Button";
import InitialAvatar from "../common/InitialAvatar";

const AnswerCard = ({ answer, onUpvote, onAccept, isQuestionOwner }) => {
  const isAccepted = answer.isAccepted;
  const upvotes = answer.upvotes || 0;

  const name = answer.answeredBy?.name || "Student";
  const email = answer.answeredBy?.email;

  return (
    <div
      className={`rounded-2xl border p-4 bg-white ${
        isAccepted ? "border-emerald-400 bg-emerald-50/40" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="whitespace-pre-line text-sm text-slate-800">
            {answer.content}
          </p>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <InitialAvatar name={name} email={email} size={24} />
              <span>{name}</span>
            </div>
            <span>·</span>
            <span>{new Date(answer.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={onUpvote}
            className={`flex flex-col items-center text-xs ${
              answer.isUpvoted ? "text-indigo-600" : "text-slate-500"
            }`}
          >
            <span className="text-lg leading-none">▲</span>
            <span>{upvotes}</span>
          </button>

          {isAccepted && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Accepted
            </span>
          )}

          {isQuestionOwner && !isAccepted && (
            <Button size="xs" variant="outline" onClick={onAccept}>
              Accept
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
