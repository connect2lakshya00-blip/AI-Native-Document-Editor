const express = require("express");
const Document = require("../models/Document");
const router = express.Router();

// GET all documents for a user (either owned or shared with them)
router.get("/", async (req, res) => {
  const { email } = req.query; // Pass the active user email as query parameter
  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required" });
  }

  try {
    const docs = await Document.find({
      $or: [
        { owner: email },
        { "sharedWith.email": email }
      ]
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// GET single document by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch document" });
  }
});

// POST to create a new document
router.post("/", async (req, res) => {
  const { title, content, owner } = req.body;
  
  if (!owner) {
    return res.status(400).json({ error: "Owner email is required" });
  }

  try {
    const newDoc = new Document({
      title: title || "Untitled Document",
      content: content || "",
      owner,
      sharedWith: [],
    });

    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (error) {
    res.status(500).json({ error: "Failed to create document" });
  }
});

// PUT to update document content/title
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, userEmail } = req.body; // userEmail to verify permissions

  try {
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    // Permission check
    const isOwner = doc.owner === userEmail;
    const isEditor = doc.sharedWith.some(
      (user) => user.email === userEmail && user.role === "editor"
    );

    if (!isOwner && !isEditor) {
      return res.status(403).json({ error: "No permission to edit this document" });
    }

    if (title !== undefined) doc.title = title;
    if (content !== undefined) doc.content = content;

    const updatedDoc = await doc.save();
    res.json(updatedDoc);
  } catch (error) {
    res.status(500).json({ error: "Failed to update document" });
  }
});

// POST to share a document
router.post("/:id/share", async (req, res) => {
  const { id } = req.params;
  const { ownerEmail, shareEmail, role } = req.body;

  if (!shareEmail || !role) {
    return res.status(400).json({ error: "Share email and role (viewer/editor) are required" });
  }

  try {
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    // Only owner can share
    if (doc.owner !== ownerEmail) {
      return res.status(403).json({ error: "Only the document owner can share it" });
    }

    // Check if already shared
    const existingShare = doc.sharedWith.find((u) => u.email === shareEmail);
    if (existingShare) {
      // Update role if already shared
      existingShare.role = role;
    } else {
      // Add new shared user
      doc.sharedWith.push({ email: shareEmail, role });
    }

    const updatedDoc = await doc.save();
    res.json(updatedDoc);
  } catch (error) {
    res.status(500).json({ error: "Failed to share document" });
  }
});

module.exports = router;
