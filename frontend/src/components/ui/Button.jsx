// src/components/ui/Button.jsx
import React from "react";
import clsx from "clsx";

const baseClasses =
  "inline-flex items-center justify-center rounded-lg border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary:
    "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  outline:
    "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:ring-slate-300",
  subtle:
    "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-300",
  ghost:
    "border-transparent bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const Button = ({
  children,
  as,
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  const Component = as || "button";
  const componentProps = {
    className: clsx(baseClasses, variants[variant], sizes[size], className),
    ...props,
  };

  // Default native button behavior for forms unless caller overrides it.
  if (Component === "button" && componentProps.type == null) {
    componentProps.type = "button";
  }

  return <Component {...componentProps}>{children}</Component>;
};

export default Button;
