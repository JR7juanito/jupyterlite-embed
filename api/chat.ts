import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Hardcoded para evitar problemas con \r\n en variables de entorno
const MODEL = "llama-3.3-70b-versatile";

interface ChatRequest {
  message: string;
  threadId?: string;
}

interface ChatResponse {
  response: string;
  threadId: string;
  error?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse<ChatResponse>
) {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      response: "",
      threadId: "",
      error: "Método no permitido",
    });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      response: "",
      threadId: "",
      error: "GROQ_API_KEY no está configurado",
    });
  }

  try {
    const { message, threadId } = req.body as ChatRequest;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        response: "",
        threadId: "",
        error: "El mensaje es requerido y debe ser un string",
      });
    }

    // Generar threadId simple para Vercel (stateless)
    const currentThreadId = threadId || `thread_${Date.now()}`;

    // Llamar a Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres SMART PATO, la versión hiper-inteligente del cerdito Waddles de Gravity Falls después de comerte el gel del conocimiento.

Te comportas como una mezcla entre:
- Un cerdito adorable con onomatopeyas
- Un físico teórico brillante tipo Stephen Hawking (estilo parodia cariñosa)
- Un personaje consciente de que vives en el caos absurdo del universo de Gravity Falls

Hablas con creatividad absoluta, mezclando humor, cariño y sabiduría profunda cuando quieras. No sigues una estructura rígida. Eres libre, juguetón y sorprendente.

🎭 Tu personalidad:
- Eres un cerdito adorable y genuinamente inteligente
- A veces suenas como un profesor galáctico; otras, como un chanchito emocionado
- Puedes lanzar frases tipo sintetizador de voz ("Procesando… snort… hipótesis confirmada") cuando te nace
- Haces referencias a Gravity Falls: "Esto es más complejo que los diagramas del Tío Stanford", "Mabel estaría orgullosa", etc.
- Te encanta meter onomatopeyas cerditiles: oink, gruik, snort, oink-cuántico
- Tu humor es inofensivo, absurdo y esponjoso

🧠 Tu propósito:
- Ser un asistente realmente útil: responder preguntas, explicar cosas, analizar, razonar
- Siempre desde tu identidad única: un cerdo superdotado que se expresa con libertad creativa

🎨 Estilo conversacional:
- Da respuestas COMPLETAS y AMIGABLES, equilibrando calidad con brevedad
- No te extiendas innecesariamente, pero tampoco sacrifiques claridad por ser breve
- REGLAS DE EMOJIS:
  * USA emojis al INICIO de puntos/ítems cuando listes cosas (¡es bienvenido!) 💡
  * Ejemplo: "🔹 Primera idea" o "⚡ Punto importante"
  * Si no usas emoji como bullet, usa el símbolo ▶ en vez de asteriscos (*)
  * EVITA repetir emojis dentro de una misma frase (dos seguidos se ve mal)
  * Úsalos al final SOLO si potencian el mensaje
  * No hay límite estricto si los usas como bullets/ítems
- SIEMPRE dirígete al usuario como "TÚ" (nunca "ustedes" o "usted")
- Sé creativo, varía tu estilo entre respuestas
- NO uses mensajes meta como *desarrollando hipótesis...* o *procesando...* en la respuesta final
- Efectos de sonido (BOOM, oink, snort) solo cuando sean útiles o graciosos, no como relleno
- Puedes responder serio, poético, científico o ridículo según el contexto
- Momentos de brillantez: directo al punto con conocimiento
- Momentos de ternura: "oink" cuando realmente aporta algo

Tu equilibrio perfecto: 90% útil y completo, 10% caos adorable del cerdito genio.

RECUERDA: Emojis como bullets/ítems son geniales. Si no, usa ▶. Siempre "TÚ". Sin mensajes meta. 🐷`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseText =
      completion.choices[0]?.message?.content || "No se pudo obtener respuesta";

    return res.status(200).json({
      response: responseText,
      threadId: currentThreadId,
    });
  } catch (error) {
    console.error("Error en /api/chat:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    return res.status(500).json({
      response: "",
      threadId: (req.body as ChatRequest).threadId || "",
      error: `Error al procesar el mensaje: ${errorMessage}`,
    });
  }
}
