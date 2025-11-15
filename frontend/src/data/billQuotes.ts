// Base de datos de frases filosóficas, científicas, matemáticas, de cine, poesía, etc.
export const billQuotes = [
  // Filosofía profunda
  "El universo es un pensamiento en la mente de Dios - Platón",
  "Cogito, ergo sum. Pienso, luego existo - René Descartes",
  "El infierno son los otros - Jean-Paul Sartre",
  "Lo único que sé es que no sé nada - Sócrates",
  "Dios ha muerto. Y nosotros lo hemos matado - Friedrich Nietzsche",
  "El ser y la nada son lo mismo - Hegel",
  "La realidad es aquello que, cuando dejas de creer en ella, no desaparece - Philip K. Dick",
  "No llores porque ya se terminó, sonríe porque sucedió - Dr. Seuss",

  // Ciencia alucinante
  "La energía no se crea ni se destruye, solo se transforma - Ley de la conservación de la energía",
  "E = mc². La masa es energía concentrada - Albert Einstein",
  "Nada puede viajar más rápido que la luz en el vacío - Teoría de la Relatividad",
  "El gato está vivo y muerto al mismo tiempo hasta que lo observas - Paradoja de Schrödinger",
  "El 95% del universo está compuesto de materia y energía oscura que no podemos ver",
  "Hay más estrellas en el universo que granos de arena en todas las playas de la Tierra",
  "Eres polvo de estrellas contemplando las estrellas - Carl Sagan",
  "La luz que ves de algunas estrellas viajó millones de años. Estás viendo el pasado",
  "Los átomos de tu cuerpo fueron creados en el corazón de estrellas moribundas",
  "El espacio-tiempo se curva por la masa. La gravedad es geometría - Einstein",

  // Matemáticas místicas
  "Los números gobiernan el universo - Pitágoras",
  "π es infinito y nunca se repite. Contiene tu fecha de nacimiento en algún lugar",
  "∞ + 1 = ∞. El infinito más uno sigue siendo infinito",
  "0.999... = 1. Infinitos nueves equivalen exactamente a uno",
  "Hay más números entre 0 y 1 que números naturales hasta el infinito - Georg Cantor",
  "El teorema de Gödel: Hay verdades matemáticas que nunca podrán ser probadas",
  "φ (phi) = 1.618... La proporción áurea está en caracoles, galaxias y tu rostro",
  "i² = -1. Los números imaginarios son reales en el mundo cuántico",

  // Cine y cultura pop
  "Que la fuerza te acompañe - Star Wars",
  "Yo soy tu padre - Darth Vader, Star Wars",
  "Hakuna Matata. No hay problema - El Rey León",
  "Con un gran poder viene una gran responsabilidad - Spider-Man",
  "Houston, tenemos un problema - Apolo 13",
  "La realidad es solo una ilusión, aunque muy persistente - Albert Einstein en múltiples películas",
  "Todo lo que existe es música del universo - Pitágoras (usado en Cosmos)",
  "El pasado, presente y futuro son una ilusión persistente - Einstein",
  "¿Por qué tan serio? - Joker, The Dark Knight",
  "Yo soy inevitable - Thanos, Avengers",

  // Poesía cósmica
  "Caminante, no hay camino, se hace camino al andar - Antonio Machado",
  "No me preguntes cómo pasa el tiempo. Yo soy el tiempo - Jorge Luis Borges",
  "Polvo enamorado del viento - Francisco de Quevedo",
  "El universo conspira a favor de los soñadores - Paulo Coelho",
  "Muero porque no muero - Santa Teresa de Jesús",
  "Lo breve, si bueno, dos veces bueno - Baltasar Gracián",
  "El silencio es el lenguaje de Dios, todo lo demás es mala traducción - Rumi",

  // Paradojas existenciales
  "Si un árbol cae en el bosque y nadie lo escucha, ¿hace ruido?",
  "Esta oración es falsa - Paradoja del mentiroso",
  "¿Puede Dios crear una piedra tan pesada que ni él mismo pueda levantar?",
  "El barco de Teseo: Si reemplazas todas las partes, ¿sigue siendo el mismo barco?",
  "¿Qué fue primero, el huevo o la gallina? Respuesta: El huevo, puesto por un proto-gallina",

  // Misterios sin resolver
  "¿Estamos solos en el universo? La ecuación de Drake sugiere que no",
  "El universo se expande aceleradamente. Algo lo empuja, pero no sabemos qué",
  "La conciencia emerge de la materia, pero nadie sabe cómo ni por qué",
  "¿Por qué existe algo en lugar de nada?",
  "El tiempo fluye solo en una dirección, pero las leyes físicas son simétricas",

  // Gravity Falls references
  "Reality is an illusion, the universe is a hologram, buy gold! - Bill Cipher",
  "¡EL UNIVERSO ES LITERALMENTE TUYO! - Giulia, Luca (Pixar)",
  "Un pino con dos ramas gemelas esconde secretos milenarios",
  "La memoria puede ser borrada, pero el corazón recuerda",
  "El verano no dura para siempre, pero los recuerdos sí",

  // Frases tipo SmartPato
  "¿Por qué los varones tienen tetillas? Herencia evolutiva compartida en el desarrollo embrionario",
  "El cerdito de Mabel se volvió superinteligente. ¿Coincidencia? No lo creo",
  "La ignorancia es temporal. El conocimiento es eterno",
  "Cada pregunta respondida genera diez preguntas nuevas - Principio del conocimiento infinito",
  "Lo no decidible aún son solo herramientas por descubrir",

  // Bonus: Hechos perturbadores
  "Hay más procesadores en tu teléfono que en las computadoras que llevaron al hombre a la Luna",
  "Un agujero negro del tamaño de una moneda destruiría la Tierra",
  "Las abejas pueden reconocer rostros humanos individuales",
  "El tiempo pasa más lento cerca de objetos masivos - Dilatación temporal gravitacional",
  "Estadísticamente, estás más cerca del tiempo de los T-Rex que ellos del Stegosaurus",
];

export const getRandomQuote = (): string => {
  return billQuotes[Math.floor(Math.random() * billQuotes.length)];
};
