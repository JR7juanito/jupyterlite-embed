import { useState, useCallback, useRef, useEffect } from "react";
import "./ChatApp.css";
import { getRandomQuote } from "../data/billQuotes";

const API_URL = import.meta.env.VITE_API_URL || "";

interface ChatApiResponse {
  response: string;
  threadId: string;
  error?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const ChatApp = () => {
  const [threadId, setThreadId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [billQuote, setBillQuote] = useState<string | null>(null);
  const [showBillQuote, setShowBillQuote] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll cuando cambian mensajes o loading
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, typingText]);

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isLoading) return;

      // Agregar mensaje del usuario
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: messageText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            threadId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data: ChatApiResponse = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Actualizar el threadId si es nuevo
        if (data.threadId && data.threadId !== threadId) {
          setThreadId(data.threadId);
        }

        // Efecto de escritura tipo máquina de escribir
        const fullText = data.response;

        // Pequeña pausa para dar sensación de "pensamiento" antes de escribir
        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsTyping(true);
        setTypingText("");

        let currentIndex = 0;
        const typingSpeed = 30; // milisegundos por carácter

        const typingInterval = setInterval(() => {
          if (currentIndex < fullText.length) {
            setTypingText(fullText.substring(0, currentIndex + 1));
            currentIndex++;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);

            // Agregar mensaje completo después de terminar de escribir
            const assistantMessage: Message = {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: fullText,
              timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setTypingText("");
          }
        }, typingSpeed);
      } catch (error) {
        console.error("Error al enviar mensaje:", error);

        // Mostrar mensaje de error
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `❌ Error: ${
            error instanceof Error
              ? error.message
              : "No se pudo enviar el mensaje"
          }`,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [threadId, isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleBillClick = () => {
    const quote = getRandomQuote();
    setBillQuote(quote);
    setShowBillQuote(true);

    // Ocultar después de 7 segundos
    setTimeout(() => {
      setShowBillQuote(false);
    }, 7000);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-content">
          <div className="bot-avatar">
            <img src="/patin.gif" alt="SmartPato" className="avatar-img" />
          </div>
          <div className="header-text">
            <h1>SmartPato AI</h1>
            <p className="chat-subtitle">
              🐷 Saludos! mente poco desarrollada, ¿Listx para presenciar al
              cerdito que sabe más que tú? #Oink #SupremoParadigma #PatoLoSabe
            </p>
          </div>
          <div className="bill-container">
            {showBillQuote && billQuote && (
              <div className="bill-quote-bubble">
                <div className="bill-quote-text">{billQuote}</div>
                <div className="bill-quote-arrow"></div>
              </div>
            )}
            <div
              className="bill-avatar"
              onClick={handleBillClick}
              title="Click para sabiduría cósmica"
            >
              <img src="/bill.gif" alt="Bill" className="bill-img" />
            </div>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="empty-icon">
              <img
                src="/smartpato-typing.gif"
                alt="SmartPato"
                className="empty-avatar"
              />
            </div>
            <h3>¡Hola! Soy SmartPato</h3>
            <p>
              ¡Que brille la luz del conocimiento por sobre la oscuridad de la
              ignorancia! Puedo enseñarte muchas cosas, desde los secretos de la
              astrofísica, el origen de la vida, el significado de la
              existencia, ¿por qué los varones tienen tetillas? lo no decidible
              es tan solo cosas cuyo entendimiento depende de herramientas que
              aún no hemos descubierto.
            </p>
            <p className="empty-subtitle">
              Sumérgete en tus dudas y cuestionamientos, pues como dijo una
              joven italiana pelirroja alguna vez... ¡¡EL UNIVERSO ES
              LITERALMENTE TUYO!!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message message--${msg.role}`}>
              <div className="message-avatar">
                {msg.role === "user" ? (
                  "👤"
                ) : (
                  <img
                    src="/smartpato-typing.gif"
                    alt="SmartPato"
                    className="avatar-img"
                  />
                )}
              </div>
              <div className="message-bubble">
                <div className="message-sender">
                  {msg.role === "user" ? "Tú" : "SmartPato"}
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="message message--assistant">
            <div className="message-avatar">
              <img
                src="/smartpato-typing.gif"
                alt="SmartPato"
                className="avatar-img"
              />
            </div>
            <div className="message-bubble">
              <div className="message-sender">SmartPato</div>
              <div className="message-content">
                {typingText}
                <span className="typing-cursor">|</span>
              </div>
            </div>
          </div>
        )}
        {isLoading && !isTyping && (
          <div className="message message--assistant">
            <div className="message-avatar">
              <img
                src="/smartpato-typing.gif"
                alt="SmartPato"
                className="avatar-img"
              />
            </div>
            <div className="message-bubble">
              <div className="message-sender">SmartPato</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <img
                    src="/smartpato-typing.gif"
                    alt="SmartPato escribiendo"
                    className="typing-gif"
                  />
                  <span className="typing-text">
                    Procesando con intelecto superior...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-container" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Pregúntale a SmartPato..."
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="chat-send-button"
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? "⏳" : "🍎"}
        </button>
      </form>
    </div>
  );
};

export default ChatApp;
