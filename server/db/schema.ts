import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  smallint,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const columns = pgTable("columns", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const jobApplications = pgTable("job_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  jobTitle: varchar("job_title", { length: 255 }),
  currentColumn: uuid("current_column")
    .notNull()
    .references(() => columns.id),

  office: varchar("office", { length: 255 }),
  compensation: varchar("compensation", { length: 255 }),
  companySize: varchar("company_size", { length: 255 }),
  notes: text("notes"),
  status: varchar("status", { length: 255 }),
  nextInterviewDate: timestamp("next_interview_date"),
  nextInterviewType: varchar("next_interview_type", { length: 255 }),
  vibeCheck: smallint("vibe_check"),
  source: varchar("source", { length: 255 }),
  logo: varchar("logo", { length: 500 }),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cardChangeLog = pgTable("card_change_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobApplicationId: uuid("job_application_id")
    .notNull()
    .references(() => jobApplications.id, { onDelete: "cascade" }),
  changeType: varchar("change_type", { length: 50 }).notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  oldColumnId: uuid("old_column_id").references(() => columns.id, {
    onDelete: "set null",
  }),
  newColumnId: uuid("new_column_id").references(() => columns.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const columnsRelations = relations(columns, ({ many }) => ({
  jobApplications: many(jobApplications),
  cardChangeLogsAsOld: many(cardChangeLog, { relationName: "oldColumn" }),
  cardChangeLogsAsNew: many(cardChangeLog, { relationName: "newColumn" }),
}));

export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one, many }) => ({
    column: one(columns, {
      fields: [jobApplications.currentColumn],
      references: [columns.id],
    }),
    changeLogs: many(cardChangeLog),
  })
);

export const cardChangeLogRelations = relations(cardChangeLog, ({ one }) => ({
  jobApplication: one(jobApplications, {
    fields: [cardChangeLog.jobApplicationId],
    references: [jobApplications.id],
  }),
  oldColumn: one(columns, {
    fields: [cardChangeLog.oldColumnId],
    references: [columns.id],
    relationName: "oldColumn",
  }),
  newColumn: one(columns, {
    fields: [cardChangeLog.newColumnId],
    references: [columns.id],
    relationName: "newColumn",
  }),
}));

export type Column = typeof columns.$inferSelect;
export type NewColumn = typeof columns.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;
export type CardChangeLog = typeof cardChangeLog.$inferSelect;
export type NewCardChangeLog = typeof cardChangeLog.$inferInsert;
