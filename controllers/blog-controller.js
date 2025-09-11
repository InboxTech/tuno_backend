// const { model } = require("mongoose"); // Already commented out, good.
const Blog = require("../models/blog-model");

//---------------------------------------------------------
// frontend side get blog logic
//---------------------------------------------------------
const blogs = async (req, res) => {
  try {
    const response = await Blog.find(
      { status: "Active" },
      { deleted: false }
    ).sort({ createdAt: -1 });
    if (!response || response.length === 0) {
      // handle the case where no document was found
      return res.status(404).json({ message: "No blog found" });
    }
    res.status(200).json({ msg: response });
  } catch (error) {
    console.log(`Error fetching blogs: ${error}`);
    // IMPORTANT: Send an error response back to the client
    res
      .status(500)
      .json({ message: "An error occurred while fetching blogs." });
  }
};

//---------------------------------------------------------
// get single blog by id logic
//---------------------------------------------------------
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Blog.findOne({ _id: id }, { deleted: false }).sort({
      createdAt: -1,
    });
    // Check if blog was found
    if (!data) {
      return res.status(404).json({ message: "Blog not found." });
    }
    return res.status(200).json(data);
  } catch (error) {
    // If the ID format is invalid (e.g., not a valid MongoDB ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid blog ID format." });
    }
    res
      .status(500)
      .json({ message: "Failed to retrieve Blog", error: error.message });
    console.log(error);
  }
};

//---------------------------------------------------------
// get releted blog logic
//---------------------------------------------------------
const getRelatedBlogs = async (req, res) => {
  try {
    const { id } = req.params;

    const currentBlog = await Blog.findById(id).sort({ createdAt: -1 });
    if (!currentBlog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    const relatedBlogs = await Blog.find({
      _id: { $ne: id },
      status: "Active",
      deleted: false,
      // category: currentBlog,
    }).limit(10);
    res.status(200).json({ relatedBlogs });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//---------------------------------------------------------
// admin creat blog logic
//---------------------------------------------------------

const createBlog = async (req, res) => {
  try {
    const { title, category, shortDescription, description, author, status } =
      req.body;

    // Correctly access the image file information from req.files.image
    // Multer's upload.fields() stores single file under req.files[fieldName][0]
    const image =
      req.files && req.files.image && req.files.image[0]
        ? `/uploads/blogs/${req.files.image[0].filename}`
        : null; // Ensure image is null if not provided


         const thumbnail_image =
      req.files && req.files.thumbnail_image && req.files.thumbnail_image[0]
        ? `/uploads/blogs/${req.files.thumbnail_image[0].filename}`
        : null; 


    // Although schema validation handles 'required', it's good to provide
    // a more specific message if the image is explicitly missing before DB call.
    if (!image) {
      return res
        .status(400)
        .json({ message: "Image file is required for creating a blog." });
    }

    const blog = new Blog({
      title,
      category,
      shortDescription,
      description,
      author,
      status,
      image, // Assign the determined image path
      thumbnail_image
    });

    await blog.save();
    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    // Mongoose validation errors will have a 'name' of 'ValidationError'
    // and 'errors' property. You can make this more specific.
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }
    res
      .status(500)
      .json({ message: "Failed to create blog", error: error.message });
  }
};

//---------------------------------------------------------
// admin get blog logic
//---------------------------------------------------------
const getblogs = async (req, res) => {
  try {
    const response = await Blog.find({ deleted: false }).sort({
      createdAt: -1,
    });
    if (!response || response.length === 0) {
      // handle the case where no document was found
      return res.status(404).json({ message: "No blog found" });
    }
    res.status(200).json({ msg: response });
  } catch (error) {
    console.log(`Error fetching blogs: ${error}`);
    // IMPORTANT: Send an error response back to the client
    res
      .status(500)
      .json({ message: "An error occurred while fetching blogs." });
  }
};

//---------------------------------------------------------
// admin update blog logic
//---------------------------------------------------------
const updateBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const updateFields = { ...req.body }; // Start with existing body data

    // Check if a new image was uploaded for update
    if (req.files && req.files.image && req.files.image[0]) {
      updateFields.image = `/uploads/blogs/${req.files.image[0].filename}`;
    }

      if (req.files && req.files.thumbnail_image && req.files.thumbnail_image[0]) {
      updateFields.thumbnail_image = `/uploads/blogs/${req.files.thumbnail_image[0].filename}`;
    }
    const updateData = await Blog.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true, // This will re-run validation, good.
    });

    if (!updateData) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog updated successfully", updateData });
  } catch (error) {
    // If the ID format is invalid (e.g., not a valid MongoDB ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid blog ID format." });
    }
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }
    res
      .status(500)
      .json({ message: "Failed to update Blog", error: error.message });
    console.log(error);
  }
};

//---------------------------------------------------------
// hard delete blog by id logic
//---------------------------------------------------------
const hardDeleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete blog", error: error.message });
  }
};

//---------------------------------------------------------
// soft delete blog by id logic
//---------------------------------------------------------
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Blog.findByIdAndUpdate(id, { deleted: true });
    // const deleted = await blog.findByIdAndUpdate(id, { deleted: true}, { new: true});
    if (!deleted) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete blog", error: error.message });
  }
};

const deleteMultipleBlogs = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No blog selected for deletion" });
    }
    await Blog.updateMany({ _id: { $in: ids } }, { $set: { deleted: true } });
    res.status(200).json({ message: "Selected blogs deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to mutiple blog delete", error: error.message });
  }
};

module.exports = {
  createBlog,
  getblogs,
  blogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  deleteMultipleBlogs,
  getRelatedBlogs,
};
