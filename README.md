[AI4Devread.pdf](https://github.com/user-attachments/files/25821062/AI4Devread.pdf)

Read the above document first

# TrAIge – Clinical Triage Intelligence Platform

TrAIge is a clinical triage and patient management platform designed to assist healthcare providers in prioritizing patient care using structured patient data, symptoms, and vital signs.

The platform enables faster clinical assessment, organized patient record management, and clear triage recommendations to support healthcare decision‑making workflows.

---

# Features

- Patient symptom and vital sign analysis
- Clinical triage severity classification
- Department recommendation for patient routing
- Secure patient record management
- Administrative analytics dashboard
- Modern web‑based user interface
- Scalable backend API architecture

---

# Tech Stack

## Frontend
- React
- Vite
- TailwindCSS
- TypeScript

## Backend
- FastAPI
- Python

## Database
- PostgreSQL
- Drizzle ORM

## Infrastructure
- Node.js
- REST API Architecture
- Replit Development Environment

---

# Project Structure

```
PSG-AI4DEV-project/

├── attached_assets/
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── styles/
│
├── server/
│   ├── main.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── triage.py
│   │   ├── patients.py
│   │   ├── records.py
│   │   └── admin.py
│   │
│   ├── models/
│   │   ├── user_model.py
│   │   ├── patient_model.py
│   │   ├── record_model.py
│   │   └── triage_model.py
│   │
│   ├── services/
│   │   ├── admission_orchestrator.py
│   │   ├── narrative_miner.py
│   │   ├── evidence_generator.py
│   │   └── pii_redaction.py
│   │
│   ├── database/
│   │   └── db.py
│   │
│   └── utils/
│       ├── security.py
│       └── logger.py
│
├── shared/
│
├── script/
│
├── .gitignore
├── README.md
├── components.json
├── drizzle.config.ts
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

# Installation

## Clone the Repository

git clone https://github.com/KiranS-create/PSG-AI4DEV-project.git  
cd PSG-AI4DEV-project

---

# Backend Setup

Install dependencies

pip install -r requirements.txt

Run the backend server

uvicorn main:app --reload

API documentation will be available at:

http://127.0.0.1:8000/docs

---

# Frontend Setup

Install dependencies

npm install

Start the development server

npm run dev

---

# API Endpoints

## Authentication

POST /auth/register  
POST /auth/login

---

## Patient Management

GET /patients/me  
PUT /patients/update

---

## Triage Analysis

POST /triage/analyze

Example Request

{
  "symptoms": ["chest pain"],
  "age": 65,
  "heart_rate": 110,
  "oxygen_level": 92
}

Example Response

{
  "severity": "HIGH",
  "risk_score": 9,
  "recommended_department": "Cardiology"
}

---

## Medical Records

POST /records/upload  
GET /records/{patient_id}

---

## Administrative Dashboard

GET /admin/analytics  
GET /admin/triage-logs

---

# Security

The platform incorporates several safeguards to protect sensitive medical information:

- Role‑based authentication
- Encrypted password storage
- Secure API endpoints
- Sensitive data protection
- System activity logging

---

# Deployment

Run the backend server:

uvicorn main:app --host 0.0.0.0 --port 8000

The project can be deployed in environments such as **Replit or containerized cloud environments**.

---

# Future Improvements

- Integration with hospital information systems
- Expanded clinical analytics
- Real‑time monitoring dashboards
- Enhanced administrative reporting tools

---

# License

This project was developed for research and prototyping purposes.
