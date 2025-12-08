import { Router } from "express";
import { db } from "../db";
import { recruiters, jobApplications } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// GET all recruiters
router.get("/", async (req, res) => {
  try {
    const allRecruiters = await db.select().from(recruiters);
    res.json(allRecruiters);
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    res.status(500).json({ error: "Failed to fetch recruiters" });
  }
});

// GET recruiter by ID
router.get("/:id", async (req, res) => {
  try {
    const recruiter = await db
      .select()
      .from(recruiters)
      .where(eq(recruiters.id, req.params.id))
      .limit(1);

    if (recruiter.length === 0) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    res.json(recruiter[0]);
  } catch (error) {
    console.error("Error fetching recruiter:", error);
    res.status(500).json({ error: "Failed to fetch recruiter" });
  }
});

// POST create new recruiter
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const [newRecruiter] = await db
      .insert(recruiters)
      .values({ name })
      .returning();

    res.status(201).json(newRecruiter);
  } catch (error) {
    console.error("Error creating recruiter:", error);
    res.status(500).json({ error: "Failed to create recruiter" });
  }
});

// PUT update recruiter
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const [updatedRecruiter] = await db
      .update(recruiters)
      .set({ name, updatedAt: new Date() })
      .where(eq(recruiters.id, req.params.id))
      .returning();

    if (!updatedRecruiter) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    res.json(updatedRecruiter);
  } catch (error) {
    console.error("Error updating recruiter:", error);
    res.status(500).json({ error: "Failed to update recruiter" });
  }
});

// DELETE recruiter
router.delete("/:id", async (req, res) => {
  try {
    const [deletedRecruiter] = await db
      .delete(recruiters)
      .where(eq(recruiters.id, req.params.id))
      .returning();

    if (!deletedRecruiter) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    res.json({ message: "Recruiter deleted successfully" });
  } catch (error) {
    console.error("Error deleting recruiter:", error);
    res.status(500).json({ error: "Failed to delete recruiter" });
  }
});

export default router;
