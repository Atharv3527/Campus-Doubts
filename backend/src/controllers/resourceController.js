// backend/src/controllers/resourceController.js
import Resource from "../models/Resource.js";

// GET /api/resources
// query: subject, semester, type, search, mine=true
export const getResources = async (req, res, next) => {
  try {
    const { subject, semester, type, search, mine } = req.query;

    const filter = {};
    if (subject) filter.subject = { $regex: subject, $options: "i" };
    if (semester) filter.semester = { $regex: semester, $options: "i" };
    if (type) filter.type = type;
    if (search) filter.title = { $regex: search, $options: "i" };
    if (mine === "true" && req.user) filter.addedBy = req.user._id;

    const resources = await Resource.find(filter)
      .populate("addedBy", "name avatar")
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (err) {
    next(err);
  }
};

// POST /api/resources
export const createResource = async (req, res, next) => {
  try {
    const { title, url, subject, semester, type } = req.body;

    const resource = await Resource.create({
      title,
      url,
      subject,
      semester,
      type,
      addedBy: req.user._id,
    });

    const populated = await resource.populate("addedBy", "name");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/resources/:id
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const owner = resource.addedBy;

    if (!owner) {
      return res
        .status(400)
        .json({ message: "Resource has no owner field set" });
    }

    if (owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this resource" });
    }

    await Resource.deleteOne({ _id: resource._id });

    return res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error("deleteResource error:", err);
    return res
      .status(500)
      .json({
        message: "Server error while deleting resource",
        error: err.message,
      });
  }
};
