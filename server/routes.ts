import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Setup OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // PATIENTS
  app.get(api.patients.list.path, async (req, res) => {
    const list = await storage.getPatients();
    res.json(list);
  });

  app.get(api.patients.get.path, async (req, res) => {
    const patient = await storage.getPatient(Number(req.params.id));
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  });

  app.post(api.patients.create.path, async (req, res) => {
    try {
      const input = api.patients.create.input.parse(req.body);
      const patient = await storage.createPatient(input);
      res.status(201).json(patient);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // MEDICAL RECORDS
  app.get(api.medicalRecords.listByPatient.path, async (req, res) => {
    const records = await storage.getMedicalRecords(Number(req.params.patientId));
    res.json(records);
  });

  app.post(api.medicalRecords.create.path, async (req, res) => {
    try {
      const input = api.medicalRecords.create.input.parse(req.body);
      
      // AI Narrative Miner (Extract entities)
      const extractionResponse = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are a Narrative Miner AI. Extract clinical entities from the text. Return a JSON object with keys: symptoms (array of strings), diseases (array of strings), medications (array of strings)." },
          { role: "user", content: `Extract from this note: ${input.content}` }
        ],
        response_format: { type: "json_object" }
      });
      
      let extractedEntities = {};
      try {
        if (extractionResponse.choices[0]?.message?.content) {
          extractedEntities = JSON.parse(extractionResponse.choices[0].message.content);
        }
      } catch (e) {
        console.error("Failed to parse extracted entities", e);
      }

      const record = await storage.createMedicalRecord({
        patientId: input.patientId,
        type: input.type,
        content: input.content,
        extractedEntities
      });
      
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // TRIAGE
  app.get(api.triage.listAll.path, async (req, res) => {
    const assessments = await storage.getAllTriageAssessments();
    res.json(assessments);
  });

  app.get(api.triage.listByPatient.path, async (req, res) => {
    const assessments = await storage.getTriageAssessments(Number(req.params.patientId));
    res.json(assessments);
  });

  app.post(api.triage.analyze.path, async (req, res) => {
    try {
      const input = api.triage.analyze.input.parse(req.body);
      
      const patient = await storage.getPatient(input.patientId);
      if (!patient) return res.status(404).json({ message: "Patient not found" });

      const records = await storage.getMedicalRecords(input.patientId);
      const historySummary = records.map(r => r.content).join(" ");
      
      // Admission Orchestrator & Evidence Generator (Combined LLM call for speed)
      const prompt = `
        Evaluate this patient for triage.
        Patient: ${patient.age}yo, ${patient.gender}. History: ${patient.medicalHistory}
        Past records: ${historySummary}
        Current Vitals: HR ${input.heartRate}, SpO2 ${input.oxygenLevel}%
        Symptoms/Notes: ${input.symptoms} | ${input.clinicalNotes || 'None'}
        
        Determine the severity (CRITICAL, HIGH, MEDIUM, LOW), a risk score (0-100), and recommended department.
        Generate evidence cards explaining the reasoning.
        
        Return JSON object:
        {
          "severity": "CRITICAL",
          "riskScore": 85.5,
          "recommendedDepartment": "Cardiology",
          "evidenceCards": [
            { "title": "Vital Anomaly", "description": "Heart rate is elevated" },
            { "title": "History Match", "description": "Prior hypertension notes match current presentation" }
          ]
        }
      `;

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are an Admission Orchestrator AI. Provide a rigorous clinical triage assessment." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });
      
      let triageResult;
      try {
        triageResult = JSON.parse(aiResponse.choices[0]?.message?.content || '{}');
      } catch (e) {
        throw new Error("Failed to parse AI response");
      }

      const assessment = await storage.createTriageAssessment({
        patientId: input.patientId,
        heartRate: input.heartRate,
        oxygenLevel: input.oxygenLevel,
        symptoms: input.symptoms,
        clinicalNotes: input.clinicalNotes || null,
        severity: triageResult.severity || "MEDIUM",
        riskScore: triageResult.riskScore || 50,
        recommendedDepartment: triageResult.recommendedDepartment || "General",
        evidenceCards: triageResult.evidenceCards || []
      });

      res.status(201).json(assessment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // PRESCRIPTIONS
  app.get(api.prescriptions.listByPatient.path, async (req, res) => {
    const list = await storage.getPrescriptions(Number(req.params.patientId));
    res.json(list);
  });

  app.post(api.prescriptions.create.path, async (req, res) => {
    try {
      const input = api.prescriptions.create.input.parse(req.body);
      const prescription = await storage.createPrescription(input);
      res.status(201).json(prescription);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // DATASETS
  app.get(api.datasets.list.path, async (req, res) => {
    const list = await storage.getDatasets();
    res.json(list);
  });

  app.post(api.datasets.create.path, async (req, res) => {
    try {
      const input = api.datasets.create.input.parse(req.body);
      
      // Simulate dataset generation logic
      const records = await storage.getRecordsByIds(input.sourceRecordIds);
      const datasetContent = records.map(r => r.content).join("\n---\n");
      
      const dataset = await storage.createDataset({
        name: input.name,
        description: input.description || null,
        sourceRecordIds: input.sourceRecordIds,
        status: "completed"
      });
      
      res.status(201).json(dataset);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  return httpServer;
}
