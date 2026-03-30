const express = require("express");
const router = express.Router();

// Extract plain text from simple HTML to summarize it properly
const stripHtml = (html) => {
  return html.replace(/<[^>]*>?/gm, ' ');
};

router.post("/summarize", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required to summarize." });
  }

  // Real world implementation would take 'text', send it to OpenAI completion
  const cleanText = stripHtml(text).trim();

  // MOCK LOGIC: We will just grab some sentences or heavily truncate to show the 'summary'.
  try {
    const sentences = cleanText.split(". ");
    let mockSummary = "";
    
    // Attempt logic: Take first sentence + random last sentence if available
    if (sentences.length <= 2) {
      mockSummary = `This document is quite short! Here's a brief recap:\n\n${cleanText}`;
    } else {
      mockSummary = `(Mock Summary): ${sentences[0]}. \n\nKey takeaway includes: ${sentences[Math.floor(sentences.length / 2)]}.`;
    }

    // Pretend a slight network latency for realism
    setTimeout(() => {
      res.json({
        summary: mockSummary,
        sourceLength: cleanText.length,
        summaryLength: mockSummary.length
      });
    }, 1200);
    
  } catch (error) {
    res.status(500).json({ error: "Failed to generate AI summary" });
  }
});

module.exports = router;
