const LinkedInPost = require("../models/LinkedInPost");

// ---------------- GET all LinkedIn posts ----------------
const getAllLinkedInPosts = async (req, res) => {
  try {
    const posts = await LinkedInPost.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- CREATE new post ----------------
const addLinkedInPost = async (req, res) => {
  try {
    const { postUrl, altText } = req.body;

    // Get the uploaded image from req.files
    const imageFile = req.files?.image?.[0];
    if (!postUrl || !altText || !imageFile) {
      return res.status(400).json({ message: "Post URL, Alt Text and Image are required" });
    }

    const newPost = new LinkedInPost({
      postUrl,
      altText,
      imageUrl: `/uploads/linkedin/${imageFile.filename}`, // ✅ use correct field
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE post ----------------
const updateLinkedInPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { postUrl, altText } = req.body;

    const updateData = { postUrl, altText };

    const imageFile = req.files?.image?.[0]; // get new uploaded file
    if (imageFile) {
      updateData.imageUrl = `/uploads/linkedin/${imageFile.filename}`; // ✅ correct field
    }

    const updatedPost = await LinkedInPost.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE single post ----------------
const deleteLinkedInPost = async (req, res) => {
  try {
    const { id } = req.params;
    await LinkedInPost.findByIdAndDelete(id);
    res.status(200).json({ message: "LinkedIn post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE multiple posts ----------------
const deleteMultipleLinkedInPosts = async (req, res) => {
  try {
    const { ids } = req.body; // array of LinkedIn post _id
    await LinkedInPost.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Selected LinkedIn posts deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllLinkedInPosts,
  addLinkedInPost,
  updateLinkedInPost,
  deleteLinkedInPost,
  deleteMultipleLinkedInPosts,
};
