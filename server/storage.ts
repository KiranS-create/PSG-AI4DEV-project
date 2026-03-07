import { db } from "./db";
import { patients, medicalRecords, triageAssessments, prescriptions, datasets, type InsertPatient, type InsertMedicalRecord, type Patient, type MedicalRecord, type TriageAssessment, type InsertTriageAssessment, type Prescription, type InsertPrescription, type Dataset, type InsertDataset } from "@shared/schema";
import { eq, desc, inArray } from "drizzle-orm";

export interface IStorage {
  // Patients
  getPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, updates: Partial<InsertPatient>): Promise<Patient>;
  
  // Medical Records
  getMedicalRecords(patientId: number): Promise<MedicalRecord[]>;
  getRecordsByIds(ids: number[]): Promise<MedicalRecord[]>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  
  // Triage Assessments
  getTriageAssessments(patientId: number): Promise<TriageAssessment[]>;
  getAllTriageAssessments(): Promise<TriageAssessment[]>;
  createTriageAssessment(assessment: InsertTriageAssessment): Promise<TriageAssessment>;

  // Prescriptions
  getPrescriptions(patientId: number): Promise<Prescription[]>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;

  // Datasets
  getDatasets(): Promise<Dataset[]>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
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

  async getRecordsByIds(ids: number[]): Promise<MedicalRecord[]> {
    return await db.select().from(medicalRecords).where(inArray(medicalRecords.id, ids));
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

  async getPrescriptions(patientId: number): Promise<Prescription[]> {
    return await db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId)).orderBy(desc(prescriptions.createdAt));
  }

  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const [created] = await db.insert(prescriptions).values(prescription).returning();
    return created;
  }

  async getDatasets(): Promise<Dataset[]> {
    return await db.select().from(datasets).orderBy(desc(datasets.createdAt));
  }

  async createDataset(dataset: InsertDataset): Promise<Dataset> {
    const [created] = await db.insert(datasets).values(dataset).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
