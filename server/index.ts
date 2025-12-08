import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recruitersRouter from "./routes/recruiters";
import jobApplicationsRouter from "./routes/jobApplications";
import boardRouter from "./routes/board";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/recruiters", recruitersRouter);
app.use("/api/job-applications", jobApplicationsRouter);
app.use("/api/board", boardRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Jobs Tracker API is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
