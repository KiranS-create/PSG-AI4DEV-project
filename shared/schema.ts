import { pgTable, text, serial, integer, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  bloodType: text("blood_type"),
  medicalHistory: text("medical_history"), // summary of past conditions
  createdAt: timestamp("created_at").defaultNow(),
});

export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  extractedEntities: jsonb("extracted_entities"), // { symptoms: [], diseases: [], medications: [] }
  createdAt: timestamp("created_at").defaultNow(),
});

export const triageAssessments = pgTable("triage_assessments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  heartRate: integer("heart_rate").notNull(),
  oxygenLevel: integer("oxygen_level").notNull(),
  symptoms: text("symptoms").notNull(),
  clinicalNotes: text("clinical_notes"),
  severity: text("severity").notNull(),
  riskScore: real("risk_score").notNull(),
  recommendedDepartment: text("recommended_department").notNull(),
  evidenceCards: jsonb("evidence_cards").notNull(), // Array of objects
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({ id: true, createdAt: true });
export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({ id: true, createdAt: true, extractedEntities: true });
export const insertTriageAssessmentSchema = createInsertSchema(triageAssessments).omit({ id: true, createdAt: true, severity: true, riskScore: true, recommendedDepartment: true, evidenceCards: true });

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type TriageAssessment = typeof triageAssessments.$inferSelect;
export type InsertTriageAssessment = z.infer<typeof insertTriageAssessmentSchema>;
