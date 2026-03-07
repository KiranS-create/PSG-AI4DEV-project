import { db } from "./db";
import { patients, medicalRecords, triageAssessments, type InsertPatient, type InsertMedicalRecord, type Patient, type MedicalRecord, type TriageAssessment, type InsertTriageAssessment } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Patients
  getPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, updates: Partial<InsertPatient>): Promise<Patient>;
  
  // Medical Records
  getMedicalRecords(patientId: number): Promise<MedicalRecord[]>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  
  // Triage Assessments
  getTriageAssessments(patientId: number): Promise<TriageAssessment[]>;
  getAllTriageAssessments(): Promise<TriageAssessment[]>;
  createTriageAssessment(assessment: InsertTriageAssessment): Promise<TriageAssessment>;
}

export class DatabaseStorage implements IStorage {
  async getPatients(): Promise<Patient[]> {
    return await db.select().from(patients).orderBy(desc(patients.createdAt));
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [created] = await db.insert(patients).values(patient).returning();
    return created;
  }

  async updatePatient(id: number, updates: Partial<InsertPatient>): Promise<Patient> {
    const [updated] = await db.update(patients)
      .set(updates)
      .where(eq(patients.id, id))
      .returning();
    return updated;
  }

  async getMedicalRecords(patientId: number): Promise<MedicalRecord[]> {
    return await db.select().from(medicalRecords).where(eq(medicalRecords.patientId, patientId)).orderBy(desc(medicalRecords.createdAt));
  }

  async createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord> {
    const [created] = await db.insert(medicalRecords).values(record).returning();
    return created;
  }

  async getTriageAssessments(patientId: number): Promise<TriageAssessment[]> {
    return await db.select().from(triageAssessments).where(eq(triageAssessments.patientId, patientId)).orderBy(desc(triageAssessments.createdAt));
  }

  async getAllTriageAssessments(): Promise<TriageAssessment[]> {
    return await db.select().from(triageAssessments).orderBy(desc(triageAssessments.createdAt));
  }

  async createTriageAssessment(assessment: InsertTriageAssessment): Promise<TriageAssessment> {
    const [created] = await db.insert(triageAssessments).values(assessment).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
