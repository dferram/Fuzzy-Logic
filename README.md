<div align="center">
  
# FuzzyDx — Respiratory Disease Diagnostic System

### Based on Fuzzy Logic

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Azure](https://img.shields.io/badge/Azure_App_Service-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![License](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)](./LICENSE)

---

An orientative medical diagnostic web system that evaluates the degree of match between symptoms reported by a patient and clinical patterns of **respiratory diseases**, using **fuzzy set intersection** as the inference engine.

**Disclaimer:** This system is an academic project and **does not substitute** the opinion of a healthcare professional.

</div>

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation and Execution](#installation-and-execution)
- [Database Structure](#database-structure)
- [Authors](#authors)

---

## System Architecture

The system is structured into **three main modules** that work sequentially to generate a diagnosis based on fuzzy logic:

```text
┌─────────────────────────────────────────────────────────────────────┐
│                       FRONTEND (React + TS)                         │
│     Symptom capture · Results visualization · Dashboard             │
└────────────────────────────────┬────────────────────────────────────┘
                                 │  REST API
┌────────────────────────────────▼────────────────────────────────────┐
│                      BACKEND (FastAPI / Python)                     │
│  ┌──────────────┐  ┌─────────────────────┐  ┌───────────────────┐   │
│  │  Pre-loaded  │  │  General            │  │  Specific         │   │
│  │  Module      │──▶  Diagnosis          │──▶  Diagnosis        │   │
│  │              │  │  Module             │  │  Module           │   │
│  └──────────────┘  └─────────────────────┘  └───────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                       DATABASE (MongoDB)                            │
│               Fuzzy matrix · Diseases · Symptoms                    │
└─────────────────────────────────────────────────────────────────────┘

```

### Pre-loaded Module

Contains the system's **knowledge base**: a fuzzy matrix relating respiratory diseases to their characteristic symptoms. Each relationship is quantified with a membership value in the range `[0.0, 1.0]`, where `1.0` indicates maximum correlation and `0.0` indicates no relationship.

### General Diagnosis Module

Receives the symptoms captured from the user and performs a **fuzzification** of the inputs. It applies the **fuzzy set intersection** operation (min operator) between the patient's symptom vector and each row of the disease matrix, generating a preliminary ranking of possible diagnoses.

### Specific Diagnosis Module

Takes the results from the general module and applies refinement rules to present the user with a **detailed diagnosis**: percentage match degree, key symptoms that contributed to the result, and general recommendations associated with each identified disease.

---

## Technologies Used

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | React 18 + TypeScript | Interactive user interface and safe typing |
| **Backend** | Python 3.11+ with FastAPI | High-performance REST API with automatic documentation |
| **Database** | MongoDB | Document storage for the fuzzy matrix and catalogs |
| **Deployment** | Azure App Service | Cloud hosting with integrated CI/CD |
| **Containers** | Docker + Docker Compose | Reproducible development environment |

---

## Prerequisites

Make sure you have the following components installed before starting:

* **Node.js** `>= 18.x` — [Download](https://nodejs.org/)
* **Python** `>= 3.11` — [Download](https://www.python.org/downloads/)
* **MongoDB** — [Download](https://www.mongodb.com/try/download/community)
* **Git** `>= 2.x` — [Download](https://git-scm.com/)
* **pip** (included with Python)
* **npm** (included with Node.js)

> **Optional:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) if you prefer to set up the whole environment with containers.

---

## Installation and Execution

### 1. Clone the repository

```bash
git clone [https://github.com/dferram/Fuzzy-Logic.git](https://github.com/dferram/Fuzzy-Logic.git)
cd Fuzzy-Logic

```

### 2. Configure the database

```bash
# Make sure you have MongoDB running locally or configure your Atlas URI
# The 'fuzzydx_db' database will be created automatically when inserting data.

```

### 3. Configure environment variables

Create a `.env` file in the root of the backend project (see [Environment Variables](https://www.google.com/search?q=%23environment-variables) section).

### 4. Backend — Install and run

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --port 8000

```

The server will be available at `http://localhost:8000`.
The interactive API documentation (Swagger UI) will be at `http://localhost:8000/docs`.

### 5. Frontend — Install and run

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

```

The application will be available at `http://localhost:5173`.

---

## Database Structure

The core of the system is a **fuzzy matrix** that relates **10 respiratory diseases** to **15 clinical symptoms**. Each cell in the matrix contains a fuzzy membership value in the range **`[0.0 — 1.0]`**.

```text
              S₁    S₂    S₃    S₄   ...   S₁₅
         ┌────────────────────────────────────────┐
  E₁     │ 0.9   0.3   0.7   0.1   ...   0.5    │
  E₂     │ 0.2   0.8   0.4   0.6   ...   0.3    │
  E₃     │ 0.7   0.5   0.9   0.2   ...   0.8    │
  ...    │ ...   ...   ...   ...   ...   ...    │
  E₁₀    │ 0.4   0.6   0.3   0.8   ...   0.7    │
         └────────────────────────────────────────┘

  Eₙ = Disease n     Sₙ = Symptom n
  Value = Fuzzy membership degree [0.0, 1.0]

```

**Main tables:**

| Table | Description |
| --- | --- |
| `enfermedades` | Catalog of 10 respiratory diseases (name, description, recommendations) |
| `sintomas` | Catalog of 15 evaluable clinical symptoms |
| `matriz_difusa` | Disease-symptom relationship with membership value (0.0 to 1.0) |
| `diagnosticos` | History of queries made by users |

---

## Authors

| Name | GitHub | Role |
| --- | --- | --- |
| Fernando Ramírez | [@dferram](https://github.com/dferram) | Full-Stack Developer |

> **Autonomous University of Queretaro** — Faculty of Informatics UAQ
> Subject: Artificial Intelligence
> 2026
> [FuzzyLogic](https://fuzzy-logic-zeta.vercel.app/)

---
