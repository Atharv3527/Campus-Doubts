// src/components/common/InitialAvatar.jsx
import React from "react";
import { getColorClassForString } from "../../utils/avatarColor";

const InitialAvatar = ({
  name,
  email,
  size = 24, // px
  className = "",
}) => {
  const label = name || email || "User";
  const initial =
    label?.trim()?.[0]?.toUpperCase() ||
    "U";

  // use name > email as key for color
  const colorClass = getColorClassForString(name || email || "U");

  const sizeClass = `h-[${size}px] w-[${size}px]`; // optional, you can also pass fixed Tailwind classes

  return (
    <div
      className={`flex items-center justify-center rounded-full text-[10px] font-semibold text-white ${colorClass} ${className}`}
      style={{ width: size, height: size }}
    >
      {initial}
    </div>
  );
};

export default InitialAvatar;
