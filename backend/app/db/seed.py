"""
seed.py — Carga inicial de la base de conocimiento desde CSV a MongoDB.

Lee el archivo CSV con la matriz de enfermedades respiratorias
y lo inserta en la colección `enfermedades` de MongoDB.
Solo ejecuta la carga si la colección está vacía (idempotente).
"""

import csv
import os
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.schemas import SYMPTOM_NAMES

# Ruta al CSV (relativa al directorio raíz del proyecto)
_CSV_PATH = Path(__file__).resolve().parents[3] / "data" / "matriz_enfermedades_respiratorias.csv"


def _parse_csv() -> list[dict]:
    """
    Lee el CSV y devuelve una lista de documentos listos
    para insertar en MongoDB.

    Cada documento tiene la estructura:
    {
        "nombre": "Influenza",
        "origen": "Viral (Influenzavirus A/B). …",
        "tratamiento": "Antivirales …",
        "sintomas": {
            "Fiebre": 0.9,
            "Tos_Seca": 0.8,
            ...
        }
    }
    """
    csv_path = _CSV_PATH
    if not csv_path.exists():
        # Fallback: buscar en backend/data/
        csv_path = (
            Path(__file__).resolve().parents[2]
            / "data"
            / "matriz_enfermedades_respiratorias.csv"
        )

    if not csv_path.exists():
        raise FileNotFoundError(
            f"No se encontró el archivo CSV en:\n"
            f"  - {_CSV_PATH}\n"
            f"  - {csv_path}\n"
            f"Asegúrate de colocar el archivo en la carpeta 'data/'."
        )

    documentos: list[dict] = []

    with open(csv_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)

        for row in reader:
            # Saltar filas vacías
            nombre = row.get("Nombre_Enfermedad", "").strip()
            if not nombre:
                continue

            # Construir el mapa de síntomas con valores float
            sintomas: dict[str, float] = {}
            for symptom_name in SYMPTOM_NAMES:
                raw_value = row.get(symptom_name, "0").strip()
                try:
                    sintomas[symptom_name] = float(raw_value)
                except (ValueError, TypeError):
                    sintomas[symptom_name] = 0.0

            documento = {
                "nombre": nombre,
                "origen": row.get("Origen", "").strip(),
                "tratamiento": row.get("Tratamiento", "").strip(),
                "sintomas": sintomas,
            }
            documentos.append(documento)

    return documentos


async def seed_enfermedades(db: AsyncIOMotorDatabase) -> None:
    """
    Inserta los datos del CSV en la colección `enfermedades`
    si la colección está vacía.
    """
    collection = db["enfermedades"]
    count = await collection.count_documents({})

    if count > 0:
        print(
            f"[SEED] La coleccion 'enfermedades' ya contiene {count} documentos. "
            f"Seed omitido."
        )
        return

    documentos = _parse_csv()
    if not documentos:
        print("[SEED] No se encontraron datos en el CSV para insertar.")
        return

    result = await collection.insert_many(documentos)
    print(
        f"[SEED] Seed completado: {len(result.inserted_ids)} enfermedades "
        f"insertadas en la coleccion 'enfermedades'."
    )

    # Crear índice por nombre para búsquedas rápidas
    await collection.create_index("nombre", unique=True)
    print("[SEED] Indice unico creado en campo 'nombre'.")
