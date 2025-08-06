const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up dynamic destination folders based on route
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads"; // default

    if (req.baseUrl.includes("team")) {
      folder = "uploads/teams";
    } else if (req.baseUrl.includes("testimonial")) {
      folder = "uploads/testimonials";
    } else if (req.originalUrl.includes("service")) {
      folder = "uploads/services";
    } else if (req.originalUrl.includes("applyJobDetails")) {
      folder = "uploads/resumes";
    } else if (req.baseUrl.includes("project")) {
      folder = "uploads/projects";
    } else if (req.originalUrl.includes("blog")) {
      folder = "uploads/blogs";
    }else if (req.originalUrl.includes("industry")) {
      folder = "uploads/industries";
    }

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const resumeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  ];

  // Route-specific validation
  if (req.originalUrl.includes("applyJobDetails")) {
    if (resumeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, or DOCX files are allowed for resumes!"), false);
    }
  } else {
    if (imageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, .png files are allowed!"), false);
    }
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 }, // 500 KB
});

/**
 *  General-purpose upload handler
 * Supports any custom field config: single or multiple
 * Example usage:
 *    uploadHandler([{ name: "image", maxCount: 1 }, { name: "gallery", maxCount: 5 }])
 */
const uploadHandler = (fields) => {
  return (req, res, next) => {
    const multiUpload = upload.fields(fields);
    multiUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File size should not exceed 500 KB",
          });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

module.exports = { uploadHandler };
