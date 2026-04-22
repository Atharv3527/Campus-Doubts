// src/components/common/Loader.jsx
import React from "react";

const Loader = ({ fullPage = false }) => {
  const content = (
    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
      <span className="h-4 w-4 animate-spin rounded-full border-[2px] border-slate-300 border-t-indigo-500" />
      Loading…
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
