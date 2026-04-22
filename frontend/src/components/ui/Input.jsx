// src/components/ui/Input.jsx
import React from "react";

const Input = ({
  label,
  error,
  className = "",
  textarea = false,
  ...props
}) => {
  const base =
    "w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const border = error ? "border-red-400" : "border-slate-300";

  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea rows={4} className={`${base} ${border}`} {...props} />
      ) : (
        <input className={`${base} ${border}`} {...props} />
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
