import { storage } from "../server/storage";
import { db } from "../server/db";
import { patients } from "@shared/schema";

async function seed() {
  const existingPatients = await storage.getPatients();
  if (existingPatients.length === 0) {
    await storage.createPatient({
      name: "John Doe",
      age: 45,
      gender: "Male",
      bloodType: "O+",
      medicalHistory: "Hypertension, Type 2 Diabetes"
    });
    
    await storage.createPatient({
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      bloodType: "A-",
      medicalHistory: "Asthma, no recent surgeries"
    });
    
    console.log("Seeded initial patients");
  } else {
    console.log("Database already seeded");
  }
}

seed().catch(console.error).finally(() => process.exit(0));
