import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS para permitir requests desde el frontend
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : ["http://localhost:5173", "http://localhost:4173"],
    credentials: true,
  })
);

app.use(express.json());

// Inicializar cliente de Groq (API GRATUITA)
if (!process.env.GROQ_API_KEY) {
  console.error(
    "❌ ERROR: GROQ_API_KEY no está configurado en las variables de entorno"
  );
  console.error("👉 Obtén tu API key gratis en: https://console.groq.com/keys");
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Almacenar conversaciones en memoria (threadId -> historial de mensajes)
const conversations = new Map<
  string,
  Array<{ role: string; content: string }>
>();

// Tipos
interface ChatRequest {
  message: string;
  threadId?: string;
}

interface ChatResponse {
  response: string;
  threadId: string;
  error?: string;
}

// Generar un ID único para el thread
function generateThreadId(): string {
  return `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    model: MODEL,
    provider: "Groq (FREE)",
  });
});

// Endpoint principal de chat
app.post(
  "/api/chat",
  async (req: Request<{}, {}, ChatRequest>, res: Response<ChatResponse>) => {
    try {
      const { message, threadId } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({
          response: "",
          threadId: "",
          error: "El mensaje es requerido y debe ser un string",
        });
      }

      // Crear o recuperar thread
      let currentThreadId = threadId || generateThreadId();
      let conversationHistory = conversations.get(currentThreadId) || [];

      // Agregar mensaje del usuario al historial
      conversationHistory.push({
        role: "user",
        content: message,
      });

      console.log(`📨 Mensaje recibido en thread ${currentThreadId}`);

      // Preparar mensajes para Groq (incluir sistema + historial)
      const messages = [
        {
          role: "system" as const,
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
        ...conversationHistory.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ];

      // Llamar a Groq API
      const completion = await groq.chat.completions.create({
        messages,
        model: MODEL,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const responseText =
        completion.choices[0]?.message?.content ||
        "No se pudo obtener respuesta";

      // Agregar respuesta del asistente al historial
      conversationHistory.push({
        role: "assistant",
        content: responseText,
      });

      // Guardar conversación actualizada
      conversations.set(currentThreadId, conversationHistory);

      console.log(`✅ Respuesta generada para thread: ${currentThreadId}`);

      res.json({
        response: responseText,
        threadId: currentThreadId,
      });
    } catch (error) {
      console.error("❌ Error en /api/chat:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      res.status(500).json({
        response: "",
        threadId: req.body.threadId || "",
        error: `Error al procesar el mensaje: ${errorMessage}`,
      });
    }
  }
);

// Endpoint para crear un nuevo thread manualmente
app.post("/api/thread/new", async (req: Request, res: Response) => {
  try {
    const newThreadId = generateThreadId();
    conversations.set(newThreadId, []);
    res.json({ threadId: newThreadId });
  } catch (error) {
    console.error("❌ Error creando thread:", error);
    res.status(500).json({ error: "Error al crear un nuevo thread" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🤖 Modelo: ${MODEL} (Groq - API GRATUITA 🎉)`);
});
