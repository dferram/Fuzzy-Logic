import pytest
from app.services.fuzzy_engine import _calcular_interseccion

def test_calcular_interseccion_coincidencia_exacta():
    vector_usuario = [1.0] * 15  # El paciente tiene todos los síntomas al 100%
    enfermedad = {
        "nombre": "Enfermedad Prueba",
        "origen": "Prueba",
        "tratamiento": "Ninguno",
        "sintomas": {
            "Fiebre": 1.0,
            "Tos": 1.0,
            "Dificultad_Para_Respirar": 1.0,
            "Fatiga": 1.0,
            "Dolor_De_Garganta": 1.0,
            "Congestion_Nasal": 1.0,
            "Dolor_De_Cabeza": 1.0,
            "Dolor_Muscular": 1.0,
            "Perdida_De_Olfato": 1.0,
            "Perdida_De_Gusto": 1.0,
            "Escalofrios": 1.0,
            "Nauseas": 1.0,
            "Diarrea": 1.0,
            "Dolor_En_Pecho": 1.0,
            "Sibilancias": 1.0,
        }
    }
    resultado = _calcular_interseccion(vector_usuario, enfermedad)
    assert resultado.nombre == "Enfermedad Prueba"
    assert resultado.grado_coincidencia == 15.0
    assert resultado.porcentaje == 100.0
    
def test_calcular_interseccion_coincidencia_parcial():
    # El usuario solo tiene fiebre (1.0) y tos (0.5), el resto 0.0
    vector_usuario = [1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    enfermedad = {
        "nombre": "Gripe Leve",
        "sintomas": {
            "Fiebre": 0.8,
            "Tos": 1.0,
            "Fatiga": 0.5,
        }
    }
    # Intersección: 
    # Fiebre: min(1.0, 0.8) = 0.8
    # Tos: min(0.5, 1.0) = 0.5
    # Fatiga: min(0.0, 0.5) = 0.0
    # Total suma: 1.3
    # Porcentaje: (1.3 / 15) * 100 = 8.67%
    resultado = _calcular_interseccion(vector_usuario, enfermedad)
    assert resultado.nombre == "Gripe Leve"
    assert resultado.grado_coincidencia == 1.3
    assert resultado.porcentaje == 8.67
    
def test_calcular_interseccion_sin_coincidencia():
    vector_usuario = [0.0] * 15
    enfermedad = {
        "nombre": "Sano",
        "sintomas": {
            "Fiebre": 1.0
        }
    }
    resultado = _calcular_interseccion(vector_usuario, enfermedad)
    assert resultado.grado_coincidencia == 0.0
    assert resultado.porcentaje == 0.0
