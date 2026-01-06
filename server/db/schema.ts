import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  text,
  smallint,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["inMotion", "sentApps"]);

export const recruiters = pgTable("recruiters", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const jobApplications = pgTable("job_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  jobTitle: varchar("job_title", { length: 255 }),
  currentColumn: statusEnum("current_column").notNull(),
  recruiterId: uuid("recruiter_id").references(() => recruiters.id, {
    onDelete: "set null",
  }),
  office: varchar("office", { length: 255 }),
  compensation: varchar("compensation", { length: 255 }),
  companySize: varchar("company_size", { length: 255 }),
  questions: text("questions"),
  pros: text("pros"),
  cons: text("cons"),
  vibeCheck: smallint("vibe_check"),
  stage: varchar("stage", { length: 255 }),
  source: varchar("source", { length: 255 }),
  logo: varchar("logo", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Recruiter = typeof recruiters.$inferSelect;
export type NewRecruiter = typeof recruiters.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;
