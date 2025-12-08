import { Router } from "express";
import { db } from "../db";
import { jobApplications } from "../db/schema";
import { eq, inArray } from "drizzle-orm";

const router = Router();

// GET all job applications
router.get("/", async (req, res) => {
  try {
    const allApplications = await db.select().from(jobApplications);
    res.json(allApplications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ error: "Failed to fetch job applications" });
  }
});

// GET job applications by status
router.get("/status/:status", async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ["recruiters", "inMotion", "sentApps"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const applications = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.currentColumn, status as any));

    res.json(applications);
  } catch (error) {
    console.error("Error fetching job applications by status:", error);
    res.status(500).json({ error: "Failed to fetch job applications" });
  }
});

// GET job application by ID
router.get("/:id", async (req, res) => {
  try {
    const application = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.id, req.params.id))
      .limit(1);

    if (application.length === 0) {
      return res.status(404).json({ error: "Job application not found" });
    }

    res.json(application[0]);
  } catch (error) {
    console.error("Error fetching job application:", error);
    res.status(500).json({ error: "Failed to fetch job application" });
  }
});

// POST create new job application
router.post("/", async (req, res) => {
  try {
    const { companyName, jobTitle, currentColumn, status, recruiterId } = req.body;
    // Support both 'status' (legacy) and 'currentColumn' for backward compatibility
    const column = currentColumn || status;

    if (!companyName || !column) {
      return res
        .status(400)
        .json({ error: "Company name and currentColumn are required" });
    }

    const validColumns = ["recruiters", "inMotion", "sentApps"];
    if (!validColumns.includes(column)) {
      return res.status(400).json({ error: "Invalid currentColumn" });
    }

    const [newApplication] = await db
      .insert(jobApplications)
      .values({
        companyName,
        jobTitle,
        currentColumn: column as any,
        recruiterId: recruiterId || null,
      })
      .returning();

    res.status(201).json(newApplication);
  } catch (error) {
    console.error("Error creating job application:", error);
    res.status(500).json({ error: "Failed to create job application" });
  }
});

// PUT update job application
router.put("/:id", async (req, res) => {
  try {
    const { companyName, jobTitle, currentColumn, status, recruiterId } = req.body;
    // Support both 'status' (legacy) and 'currentColumn' for backward compatibility
    const column = currentColumn !== undefined ? currentColumn : status;

    const updateData: any = { updatedAt: new Date() };

    if (companyName !== undefined) updateData.companyName = companyName;
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (column !== undefined) {
      const validColumns = ["recruiters", "inMotion", "sentApps"];
      if (!validColumns.includes(column)) {
        return res.status(400).json({ error: "Invalid currentColumn" });
      }
      updateData.currentColumn = column;
    }
    if (recruiterId !== undefined) updateData.recruiterId = recruiterId;

    const [updatedApplication] = await db
      .update(jobApplications)
      .set(updateData)
      .where(eq(jobApplications.id, req.params.id))
      .returning();

    if (!updatedApplication) {
      return res.status(404).json({ error: "Job application not found" });
    }

    res.json(updatedApplication);
  } catch (error) {
    console.error("Error updating job application:", error);
    res.status(500).json({ error: "Failed to update job application" });
  }
});

// DELETE job application
router.delete("/:id", async (req, res) => {
  try {
    const [deletedApplication] = await db
      .delete(jobApplications)
      .where(eq(jobApplications.id, req.params.id))
      .returning();

    if (!deletedApplication) {
      return res.status(404).json({ error: "Job application not found" });
    }

    res.json({ message: "Job application deleted successfully" });
  } catch (error) {
    console.error("Error deleting job application:", error);
    res.status(500).json({ error: "Failed to delete job application" });
  }
});

export default router;
