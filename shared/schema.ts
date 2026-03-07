import { pgTable, text, serial, integer, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  bloodType: text("blood_type"),
  medicalHistory: text("medical_history"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  type: text("type").notNull(), // 'Consultation', 'Surgery', 'Lab', 'Imaging', 'Prescription'
  content: text("content").notNull(),
  extractedEntities: jsonb("extracted_entities"),
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
  evidenceCards: jsonb("evidence_cards").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  medication: text("medication").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  duration: text("duration").notNull(),
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sourceRecordIds: integer("source_record_ids").array().notNull(),
  status: text("status").notNull(), // 'processing', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({ id: true, createdAt: true });
export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({ id: true, createdAt: true, extractedEntities: true });
export const insertTriageAssessmentSchema = createInsertSchema(triageAssessments).omit({ id: true, createdAt: true, severity: true, riskScore: true, recommendedDepartment: true, evidenceCards: true });
export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({ id: true, createdAt: true });
export const insertDatasetSchema = createInsertSchema(datasets).omit({ id: true, createdAt: true });

export type Patient = typeof patients.$inferSelect;
export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type TriageAssessment = typeof triageAssessments.$inferSelect;
export type Prescription = typeof prescriptions.$inferSelect;
export type Dataset = typeof datasets.$inferSelect;
