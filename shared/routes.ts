import { z } from 'zod';
import { insertPatientSchema, insertMedicalRecordSchema, insertTriageAssessmentSchema, patients, medicalRecords, triageAssessments } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  patients: {
    list: {
      method: 'GET' as const,
      path: '/api/patients' as const,
      responses: {
        200: z.array(z.custom<typeof patients.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/patients/:id' as const,
      responses: {
        200: z.custom<typeof patients.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/patients' as const,
      input: insertPatientSchema,
      responses: {
        201: z.custom<typeof patients.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/patients/:id' as const,
      input: insertPatientSchema.partial(),
      responses: {
        200: z.custom<typeof patients.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    }
  },
  medicalRecords: {
    listByPatient: {
      method: 'GET' as const,
      path: '/api/patients/:patientId/records' as const,
      responses: {
        200: z.array(z.custom<typeof medicalRecords.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/records' as const,
      input: z.object({
        patientId: z.number(),
        type: z.string(),
        content: z.string()
      }),
      responses: {
        201: z.custom<typeof medicalRecords.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  },
  triage: {
    analyze: {
      method: 'POST' as const,
      path: '/api/triage/analyze' as const,
      input: z.object({
        patientId: z.number(),
        symptoms: z.string(),
        clinicalNotes: z.string().optional(),
        heartRate: z.number(),
        oxygenLevel: z.number()
      }),
      responses: {
        201: z.custom<typeof triageAssessments.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    listByPatient: {
      method: 'GET' as const,
      path: '/api/patients/:patientId/triage' as const,
      responses: {
        200: z.array(z.custom<typeof triageAssessments.$inferSelect>()),
      }
    },
    listAll: {
      method: 'GET' as const,
      path: '/api/triage/assessments' as const,
      responses: {
        200: z.array(z.custom<typeof triageAssessments.$inferSelect>()),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type TriageAnalyzeInput = z.infer<typeof api.triage.analyze.input>;
export type TriageAssessmentResponse = z.infer<typeof api.triage.analyze.responses[201]>;
