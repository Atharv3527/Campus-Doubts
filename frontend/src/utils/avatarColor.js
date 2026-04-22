// src/utils/avatarColor.js

const colorClasses = [
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-sky-600",
  "bg-purple-600",
  "bg-teal-600",
];

// simple hash from string → 0..(n-1)
export function getColorClassForString(str = "") {
  if (!str) return colorClasses[0];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i) * 17) % 9973; // random-ish
  }

  const index = hash % colorClasses.length;
  return colorClasses[index];
}
