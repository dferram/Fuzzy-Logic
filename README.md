<div align="center">

# FuzzyDx — Sistema de Diagnóstico de Enfermedades Respiratorias

### Basado en Lógica Difusa

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Azure](https://img.shields.io/badge/Azure_App_Service-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![License](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)](./LICENSE)

---

Sistema web de diagnóstico médico orientativo que evalúa el grado de coincidencia entre los síntomas reportados por un paciente y los patrones clínicos de **enfermedades respiratorias**, utilizando **intersección de conjuntos difusos** como motor de inferencia.

**Disclaimer:** Este sistema es un proyecto académico y **no sustituye** la opinión de un profesional de la salud.

</div>

---

## Tabla de Contenidos

- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Variables de Entorno](#-variables-de-entorno)
- [Estructura de la Base de Datos](#-estructura-de-la-base-de-datos)
- [Documentación](#-documentación)
- [Autores](#-autores)

---

## Arquitectura del Sistema

El sistema se estructura en **tres módulos principales** que trabajan de forma secuencial para generar un diagnóstico basado en lógica difusa:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + TS)                        │
│   Captura de síntomas · Visualización de resultados · Dashboard     │
└────────────────────────────────┬────────────────────────────────────┘
                                 │  REST API
┌────────────────────────────────▼────────────────────────────────────┐
│                      BACKEND (FastAPI / Python)                     │
│  ┌──────────────┐  ┌─────────────────────┐  ┌───────────────────┐  │
│  │  Módulo       │  │  Módulo de          │  │  Módulo de        │  │
│  │  Pre-cargado  │──▶  Diagnóstico       │──▶  Diagnóstico     │  │
│  │              │  │  General            │  │  Específico       │  │
│  └──────────────┘  └─────────────────────┘  └───────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                       BASE DE DATOS (PostgreSQL)                    │
│            Matriz difusa · Enfermedades · Síntomas                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Módulo Pre-cargado

Contiene la **base de conocimiento** del sistema: una matriz difusa que relaciona enfermedades respiratorias con sus síntomas característicos. Cada relación está cuantificada con un valor de pertenencia en el rango `[0.0, 1.0]`, donde `1.0` indica máxima correlación y `0.0` indica ausencia de relación.

### Módulo de Diagnóstico General

Recibe los síntomas capturados del usuario y realiza una **fuzzificación** de las entradas. Aplica la operación de **intersección de conjuntos difusos** (operador mín) entre el vector de síntomas del paciente y cada fila de la matriz de enfermedades, generando un ranking preliminar de posibles diagnósticos.

### Módulo de Diagnóstico Específico

Toma los resultados del módulo general y aplica reglas de refinamiento para presentar al usuario un **diagnóstico detallado**: grado de coincidencia porcentual, síntomas clave que contribuyeron al resultado, y recomendaciones generales asociadas a cada enfermedad identificada.

---

## Tecnologías Utilizadas

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| **Frontend** | React 18 + TypeScript | Interfaz de usuario interactiva y tipado seguro |
| **Backend** | Python 3.11+ con FastAPI | API REST de alto rendimiento con documentación automática |
| **Base de Datos** | PostgreSQL 15 | Almacenamiento relacional de la matriz difusa y catálogos |
| **Despliegue** | Azure App Service | Hosting en la nube con CI/CD integrado |
| **Contenedores** | Docker + Docker Compose | Entorno de desarrollo reproducible |

---

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de comenzar:

- **Node.js** `>= 18.x` — [Descargar](https://nodejs.org/)
- **Python** `>= 3.11` — [Descargar](https://www.python.org/downloads/)
- **PostgreSQL** `>= 15` — [Descargar](https://www.postgresql.org/download/)
- **Git** `>= 2.x` — [Descargar](https://git-scm.com/)
- **pip** (incluido con Python)
- **npm** (incluido con Node.js)

> **Opcional:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) si prefieres levantar todo el entorno con contenedores.

---

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/dferram/Fuzzy-Logic.git
cd Fuzzy-Logic
```

### 2. Configurar la base de datos

```bash
# Crear la base de datos en PostgreSQL
psql -U postgres
CREATE DATABASE fuzzydx_db;
\q
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto backend (ver sección [Variables de Entorno](#-variables-de-entorno)).

### 4. Backend — Instalar y ejecutar

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones de la base de datos
alembic upgrade head

# Iniciar el servidor de desarrollo
uvicorn app.main:app --reload --port 8000
```

El servidor estará disponible en `http://localhost:8000`.
La documentación interactiva de la API (Swagger UI) estará en `http://localhost:8000/docs`.

### 5. Frontend — Instalar y ejecutar

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Variables de Entorno

Crea un archivo `.env` en el directorio `backend/` con las siguientes variables:

```env
# Base de Datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/fuzzydx_db

# Servidor
APP_ENV=development
APP_PORT=8000
APP_HOST=0.0.0.0

# CORS
CORS_ORIGINS=http://localhost:5173

# Azure (solo para producción)
# AZURE_CONNECTION_STRING=<tu-connection-string>
```

> **Nota:** Nunca subas el archivo `.env` al repositorio. Asegúrate de que esté incluido en `.gitignore`.

---

## Estructura de la Base de Datos

El núcleo del sistema es una **matriz difusa** que relaciona **10 enfermedades respiratorias** con **15 síntomas clínicos**. Cada celda de la matriz contiene un valor de pertenencia difusa en el rango **`[0.0 — 1.0]`**.

```
              S₁    S₂    S₃    S₄   ...   S₁₅
         ┌────────────────────────────────────────┐
  E₁     │ 0.9   0.3   0.7   0.1   ...   0.5    │
  E₂     │ 0.2   0.8   0.4   0.6   ...   0.3    │
  E₃     │ 0.7   0.5   0.9   0.2   ...   0.8    │
  ...    │ ...   ...   ...   ...   ...   ...    │
  E₁₀    │ 0.4   0.6   0.3   0.8   ...   0.7    │
         └────────────────────────────────────────┘

  Eₙ = Enfermedad n    Sₙ = Síntoma n
  Valor = Grado de pertenencia difusa [0.0, 1.0]
```

**Tablas principales:**

| Tabla | Descripción |
|-------|-------------|
| `enfermedades` | Catálogo de 10 enfermedades respiratorias (nombre, descripción, recomendaciones) |
| `sintomas` | Catálogo de 15 síntomas clínicos evaluables |
| `matriz_difusa` | Relación enfermedad-síntoma con valor de pertenencia (0.0 a 1.0) |
| `diagnosticos` | Historial de consultas realizadas por los usuarios |

---

## Autores

| Nombre | GitHub | Rol |
|--------|--------|-----|
| Fernando Ramírez | [@dferram](https://github.com/dferram) | Full-Stack Developer |

> **Universidad Autónoma de Querétaro** — Facultad de Informática UAQ
> Materia: Inteligencia Artificial
> 2026
---
