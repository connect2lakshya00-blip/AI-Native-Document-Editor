const express = require("express");
const multer = require("multer");
const router = express.Router();

// Configure multer to use RAM instead of disk since we just need text
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  const { originalname, buffer, mimetype } = req.file;

  // Basic check for text or markdown
  if (
    mimetype !== "text/plain" &&
    mimetype !== "text/markdown" &&
    !originalname.endsWith(".md") &&
    !originalname.endsWith(".txt")
  ) {
    return res.status(400).json({ error: "Only .txt and .md files are allowed" });
  }

  try {
    const textContent = buffer.toString("utf8");
    res.json({
      filename: originalname,
      content: textContent,
      message: "File successfully read"
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to read file contents" });
  }
});

module.exports = router;
