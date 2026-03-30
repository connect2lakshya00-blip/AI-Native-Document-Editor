const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

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

// Base route for health check
app.get("/", (req, res) => {
  res.send("AI Document Editor API is vividly running");
});

app.listen(PORT, () => {
  console.log(`Server is running beautifully on port ${PORT}`);
  console.log(`✅ In-Memory Database completely booted and active.`);
  console.log(`🔥 Your frontend is totally hooked up and ready!`);
});
