// src/pages/Resources.jsx
import React, { useEffect, useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import InitialAvatar from "../components/common/InitialAvatar";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({
    subject: "",
    semester: "",
    type: "",
    search: "",
  });

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newRes, setNewRes] = useState({
    title: "",
    url: "",
    subject: "",
    semester: "",
    type: "notes",
  });

  const [error, setError] = useState("");
  const { isAuthenticated, user } = useAuth();
  const [showMine, setShowMine] = useState(false);
  const [viewing, setViewing] = useState(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await api.get("/resources", {
        params: {
          subject: filters.subject || undefined,
          semester: filters.semester || undefined,
          type: filters.type || undefined,
          search: filters.search || undefined,
          mine: showMine ? "true" : undefined,
        },
      });
      setResources(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleNewChange = (e) => {
    setNewRes((r) => ({ ...r, [e.target.name]: e.target.value }));
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    setError("");
    setAdding(true);
    try {
      await api.post("/resources", newRes);
      setNewRes({
        title: "",
        url: "",
        subject: "",
        semester: "",
        type: "notes",
      });
      fetchResources();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add resource.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await api.delete(`/resources/${id}`);
      setResources((prev) => prev.filter((r) => r._id !== id));
      if (viewing && viewing._id === id) setViewing(null);
    } catch (err) {
      alert("Could not delete resource.");
    }
  };

  const getTypeBadgeClasses = (type) => {
    switch (type) {
      case "notes":
        return "bg-indigo-50 text-indigo-700";
      case "pyq":
        return "bg-emerald-50 text-emerald-700";
      case "assignment":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Resources</h1>
          <p className="text-sm text-slate-500">
            Notes, PYQs, assignments and useful materials shared by students.
          </p>
        </div>

        {isAuthenticated && (
          <p className="text-xs text-slate-600">
            Signed in as{" "}
            <span className="font-medium">{user?.name || user?.email}</span>
          </p>
        )}
      </header>

      {/* Filters */}
      <form
        onSubmit={handleFilter}
        className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        <Input
          label="Search"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="By title"
        />
        <Input
          label="Subject"
          name="subject"
          value={filters.subject}
          onChange={handleFilterChange}
          placeholder="e.g. DBMS"
        />
        <Input
          label="Semester"
          name="semester"
          value={filters.semester}
          onChange={handleFilterChange}
          placeholder="SEM-4"
        />

        <div className="flex flex-col">
          <label className="text-xs mb-1 text-slate-600">Type</label>
          <select
            name="type"
            className="h-[38px] rounded-md border border-slate-300 px-2 text-sm"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="notes">Notes</option>
            <option value="pyq">PYQ</option>
            <option value="assignment">Assignment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-600 mt-1 sm:col-span-2 lg:col-span-1">
          <input
            type="checkbox"
            checked={showMine}
            onChange={(e) => setShowMine(e.target.checked)}
            className="h-4 w-4 text-indigo-600"
          />
          Show only my resources
        </label>

        <Button type="submit" className="sm:col-span-2 lg:col-span-1">
          Apply filters
        </Button>
      </form>

      {/* List */}
      {loading ? (
        <Loader fullPage />
      ) : resources.length === 0 ? (
        <EmptyState
          title="No resources found"
          description="Try changing the filters or add a new resource."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((r) => {
            const isOwner =
              user && (r.addedBy?._id === user._id || r.addedBy === user._id);
            const uploaderName = r.addedBy?.name || "Student";
            const uploaderEmail = r.addedBy?.email;

            return (
              <article
                key={r._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900">
                      {r.title}
                    </h3>
                    {(r.subject || r.semester) && (
                      <p className="text-xs text-slate-500">
                        {r.subject} {r.semester ? `· ${r.semester}` : ""}
                      </p>
                    )}
                  </div>

                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getTypeBadgeClasses(
                      r.type
                    )}`}
                  >
                    {r.type}
                  </span>
                </div>

                {/* user info with avatar */}
                <div className="mt-3 flex justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <InitialAvatar
                      name={uploaderName}
                      email={uploaderEmail}
                      size={24}
                    />
                    <span>{uploaderName}</span>
                  </div>
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setViewing(r)}
                  >
                    View
                  </Button>

                  {isOwner && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteResource(r._id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Add resource */}
      {isAuthenticated && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            Add a resource
          </h2>
          <form
            className="mt-3 grid gap-3 md:grid-cols-2"
            onSubmit={handleAddResource}
          >
            <Input
              label="Title *"
              name="title"
              value={newRes.title}
              onChange={handleNewChange}
              required
            />
            <Input
              label="URL *"
              name="url"
              value={newRes.url}
              onChange={handleNewChange}
              required
            />
            <Input
              label="Subject"
              name="subject"
              value={newRes.subject}
              onChange={handleNewChange}
            />
            <Input
              label="Semester"
              name="semester"
              value={newRes.semester}
              onChange={handleNewChange}
            />
            <div>
              <label className="text-xs text-slate-600">Type</label>
              <select
                name="type"
                className="h-[38px] rounded-md border border-slate-300 px-2 text-sm w-full"
                value={newRes.type}
                onChange={handleNewChange}
              >
                <option value="notes">Notes</option>
                <option value="pyq">PYQ</option>
                <option value="assignment">Assignment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end items-center">
              {error && <p className="text-xs text-red-500 mr-3">{error}</p>}
              <Button type="submit" disabled={adding}>
                {adding ? "Adding..." : "Add resource"}
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* PDF/URL viewer modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-xl overflow-hidden shadow-2xl">
            <header className="flex justify-between p-3 border-b">
              <div>
                <h2 className="text-sm font-semibold">{viewing.title}</h2>
                <p className="text-xs text-slate-500">
                  {viewing.subject}{" "}
                  {viewing.semester ? `· ${viewing.semester}` : ""}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewing(null)}
              >
                Close
              </Button>
            </header>

            <iframe
              src={viewing.url}
              className="w-full h-full bg-slate-50"
              title="Resource Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
