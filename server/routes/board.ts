import { Router } from "express";
import { db } from "../db";
import { recruiters, jobApplications } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// GET board data (all recruiters and job applications organized by status)
router.get("/", async (req, res) => {
  try {
    const allRecruiters = await db.select().from(recruiters);
    const allApplications = await db.select().from(jobApplications);

    // Organize applications by status
    const boardData = {
      recruiters: allRecruiters.map((recruiter) => ({
        id: recruiter.id,
        title: recruiter.name,
        icon: "recruiter",
      })),
      inMotion: allApplications
        .filter((app) => app.currentColumn === "inMotion")
        .map((app) => ({
          id: app.id,
          title: app.companyName,
          subtitle: app.jobTitle || undefined,
          icon: "company",
        })),
      sentApps: allApplications
        .filter((app) => app.currentColumn === "sentApps")
        .map((app) => ({
          id: app.id,
          title: app.companyName,
          subtitle: app.jobTitle || undefined,
          icon: "company",
        })),
    };

    res.json(boardData);
  } catch (error) {
    console.error("Error fetching board data:", error);
    res.status(500).json({ error: "Failed to fetch board data" });
  }
});

export default router;
