const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Routes
const documentRoutes = require("./routes/documents");
const uploadRoutes = require("./routes/upload");
const aiRoutes = require("./routes/ai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/documents", documentRoutes);
app.use("/upload", uploadRoutes);
app.use("/ai", aiRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running beautifully on port ${PORT}`);
  console.log(`✅ In-Memory Database completely booted and active.`);
  console.log(`🔥 Your frontend is totally hooked up and ready!`);
});
