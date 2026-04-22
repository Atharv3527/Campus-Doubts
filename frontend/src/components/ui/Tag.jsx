// src/components/ui/Tag.jsx
import React from "react";

const Tag = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 ${className}`}
  >
    #{children}
  </span>
);

export default Tag;
