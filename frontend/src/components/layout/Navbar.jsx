// src/components/layout/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import useAuth from "../../hooks/useAuth";
import logoIcon from "../../assets/campus-logo-icon1.png";

const navLinkClasses = ({ isActive }) =>
  [
    "text-sm font-medium transition hover:text-slate-900",
    isActive ? "text-slate-900" : "text-slate-600",
  ].join(" ");

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const initial =
    user?.name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderInitialAvatar = (size = "h-7 w-7") => (
    <div
      className={`flex ${size} items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white`}
    >
      {initial}
    </div>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100"
          >
            <img
              src={logoIcon}
              alt="Campus Doubts"
              className="h-8 w-8 rounded-lg object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-900">
                Campus Doubts
              </span>
              <span className="text-[11px] text-slate-500">
                Ask. Learn. Share.
              </span>
            </div>
          </Link>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/questions" className={navLinkClasses}>
            Questions
          </NavLink>
          <NavLink to="/resources" className={navLinkClasses}>
            Resources
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/ask" className={navLinkClasses}>
              Ask a Question
            </NavLink>
          )}
        </div>

        {/* RIGHT SIDE (USER) */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs"
              >
                {renderInitialAvatar("h-7 w-7")}
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-xs font-medium text-slate-900">
                    {user?.name}
                  </span>
                  {user?.branch && (
                    <span className="text-[10px] text-slate-500">
                      {user.branch}
                    </span>
                  )}
                </div>
              </button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="inline-flex items-center justify-center rounded-md border border-slate-300 p-1.5 text-slate-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          {open ? <span className="h-4 w-4">✕</span> : <span className="h-4 w-4">☰</span>}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-sm">
            <NavLink
              to="/questions"
              className={navLinkClasses}
              onClick={() => setOpen(false)}
            >
              Questions
            </NavLink>
            <NavLink
              to="/resources"
              className={navLinkClasses}
              onClick={() => setOpen(false)}
            >
              Resources
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/ask"
                className={navLinkClasses}
                onClick={() => setOpen(false)}
              >
                Ask a Question
              </NavLink>
            )}

            <div className="mt-2 border-t border-slate-200 pt-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/profile");
                    }}
                    className="mb-2 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2"
                  >
                    {renderInitialAvatar("h-8 w-8")}
                    <div className="flex flex-col text-left text-xs">
                      <span className="font-medium text-slate-900">
                        {user?.name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {user?.email}
                      </span>
                    </div>
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                  >
                    Log in
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setOpen(false);
                      navigate("/register");
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
