// frontend/src/utils/avatar.js
import { API_BASE } from "../services/api";

export const getAvatar = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;          // Google photo
  if (avatar.startsWith("/")) return `${API_BASE}${avatar}`; // /uploads/.. from backend
  return `${API_BASE}/${avatar}`;
};
