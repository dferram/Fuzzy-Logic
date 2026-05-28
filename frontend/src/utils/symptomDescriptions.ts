export type SymptomKey =
  | 'fiebre'
  | 'tos_seca'
  | 'tos_productiva'
  | 'rinorrea'
  | 'estornudos'
  | 'dolor_garganta'
  | 'disnea'
  | 'sibilancias'
  | 'dolor_pecho'
  | 'fatiga'
  | 'cianosis'
  | 'expectoracion_purulenta'
  | 'perdida_olfato'
  | 'congestion_nasal'
  | 'crepitantes_pulmonares';

export interface SymptomDescription {
  nada: string;
  leve: string;
  moderado: string;
  grave: string;
}

export const symptomDictionary: Record<SymptomKey, SymptomDescription> = {
  fiebre: {
    nada: "Ausencia de fiebre. Temperatura corporal normal (36.5°C - 37.2°C).",
    leve: "Fiebre leve o febrícula (37.3°C - 38°C). Sensación de calor, pero tolerable.",
    moderado: "Fiebre moderada (38.1°C - 39°C). Escalofríos, sudoración y malestar general.",
    grave: "Fiebre alta (>39°C). Requiere atención. Puede causar confusión o delirio."
  },
  tos_seca: {
    nada: "Sin presencia de tos seca.",
    leve: "Tos ocasional. No interrumpe las actividades diarias ni el sueño.",
    moderado: "Tos frecuente. Causa irritación de garganta y puede interrumpir el descanso.",
    grave: "Accesos de tos persistentes e incontrolables. Agota físicamente e impide dormir."
  },
  tos_productiva: {
    nada: "Sin presencia de tos con flemas.",
    leve: "Tos esporádica con ligera expulsión de mucosidad clara o blanquecina.",
    moderado: "Tos frecuente con mucosidad abundante. Puede generar algo de cansancio al toser.",
    grave: "Tos constante con flemas espesas, abundantes. Sensación de ahogo o congestión profunda."
  },
  rinorrea: {
    nada: "Respiración nasal normal. Sin secreción.",
    leve: "Secreción nasal esporádica (goteo leve) que requiere sonar la nariz ocasionalmente.",
    moderado: "Secreción constante (nariz suelta). Requiere uso continuo de pañuelos.",
    grave: "Flujo nasal abundante y continuo. Afecta significativamente la calidad de vida diaria."
  },
  estornudos: {
    nada: "Frecuencia normal de estornudos.",
    leve: "Estornudos ocasionales en salvas cortas de 1 a 2 veces.",
    moderado: "Episodios frecuentes de estornudos a lo largo del día que causan molestia.",
    grave: "Ataques constantes de estornudos (5+ seguidos). Causa irritación facial y agotamiento."
  },
  dolor_garganta: {
    nada: "Sin dolor al tragar o hablar.",
    leve: "Ligera picazón o molestia al tragar alimentos sólidos o en la mañana.",
    moderado: "Dolor constante que dificulta tragar sólidos. Sensación de garganta inflamada.",
    grave: "Dolor intenso. Imposibilidad o gran dificultad para tragar incluso líquidos o saliva."
  },
  disnea: {
    nada: "Respiración completamente normal y sin esfuerzo.",
    leve: "Falta de aire ligera al hacer esfuerzos físicos moderados (ej. subir escaleras).",
    moderado: "Falta de aire evidente al realizar actividades cotidianas (ej. caminar en llano).",
    grave: "Sensación de ahogo en reposo. Imposibilidad de hablar oraciones completas."
  },
  sibilancias: {
    nada: "Respiración silenciosa.",
    leve: "Silbidos muy sutiles en el pecho, perceptibles solo al exhalar profundo.",
    moderado: "Silbidos agudos claramente audibles al respirar normalmente.",
    grave: "Silbidos fuertes y ruidosos, acompañados de sensación de pecho apretado."
  },
  dolor_pecho: {
    nada: "Pecho sin dolor ni sensación de opresión.",
    leve: "Ligera incomodidad ocasional, suele relacionarse con la tos o ciertas posturas.",
    moderado: "Dolor u opresión evidente al toser profundo o respirar hondo.",
    grave: "Dolor intenso y agudo, tipo pinchazo o sensación de pesadez asfixiante."
  },
  fatiga: {
    nada: "Nivel de energía normal.",
    leve: "Cansancio ligeramente superior al habitual al final del día.",
    moderado: "Agotamiento claro. Dificultad para mantener la concentración y realizar tareas físicas.",
    grave: "Astenia severa. Imposibilidad de levantarse de la cama o realizar cualquier actividad."
  },
  cianosis: {
    nada: "Coloración de la piel normal.",
    leve: "Ligera palidez o leve tono azulado en las uñas al estar en reposo.",
    moderado: "Tono azulado visible en labios o yemas de los dedos. (Requiere evaluación clínica).",
    grave: "Coloración azul o gris intensa en labios, rostro y uñas. (Urgencia médica inmediata)."
  },
  expectoracion_purulenta: {
    nada: "Sin flemas o flema transparente normal.",
    leve: "Flema escasa de color amarillento claro al toser por la mañana.",
    moderado: "Flema frecuente, espesa y de color amarillo oscuro o verdoso.",
    grave: "Flema muy abundante, espesa, de color verde intenso, marrón o con rastros de sangre."
  },
  perdida_olfato: {
    nada: "Sentido del olfato completamente intacto.",
    leve: "Disminución leve. Los olores suaves son difíciles de percibir.",
    moderado: "Solo se perciben olores muy fuertes (café, perfumes intensos).",
    grave: "Pérdida total (Anosmia). Incapacidad para detectar cualquier tipo de olor o sabor."
  },
  congestion_nasal: {
    nada: "Vías nasales despejadas.",
    leve: "Ligera sensación de nariz tapada, pero es posible respirar por la nariz.",
    moderado: "Nariz muy tapada (puede ser de un solo lado). Dificulta dormir.",
    grave: "Obstrucción nasal total. Obliga a respirar exclusivamente por la boca."
  },
  crepitantes_pulmonares: {
    nada: "Pulmones limpios.",
    leve: "Sonido de burbujeo muy leve o crujido tenue (usualmente detectado con estetoscopio).",
    moderado: "Sonido húmedo o de roce evidente al inhalar profundamente.",
    grave: "Burbujeo fuerte en el pecho (estertores audibles a simple vista) o vibración táctil."
  }
};

/**
 * Retorna la explicación descriptiva del síntoma en función de su nivel de intensidad (0 - 100).
 */
export function getSymptomDescription(symptomKey: SymptomKey, value: number): string {
  const desc = symptomDictionary[symptomKey];
  if (!desc) return "Sin descripción disponible.";

  if (value === 0) return desc.nada;
  if (value >= 1 && value <= 33) return desc.leve;
  if (value >= 34 && value <= 66) return desc.moderado;
  return desc.grave;
}

export function getSymptomLevelName(value: number): string {
  if (value === 0) return "Nada (0)";
  if (value >= 1 && value <= 33) return `Leve (${value})`;
  if (value >= 34 && value <= 66) return `Moderado (${value})`;
  return `Muy Fuerte (${value})`;
}
