import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Heart } from "lucide-react";
import { StarField } from "@/components/Celestial";
import statueImg from "@/assets/statue-reading.jpg";

export const Route = createFileRoute("/app/chat")({
  component: ChatPage,
});

type Msg = { from: "user" | "bot"; text: string; liked?: boolean };

const INITIAL: Msg[] = [
  { from: "user", text: "O que meu mapa diz sobre meus relacionamentos?" },
  {
    from: "bot",
    text:
      "Seu mapa mostra uma Lua em Escorpião na Casa 7, indicando que você busca conexões profundas e verdadeiras. Você sente intensamente e precisa de lealdade e entrega emocional.\n\nAlém disso, Vênus em Câncer na Casa 4 mostra que você ama com cuidado, proteção e um desejo de construir algo duradouro.",
    liked: true,
  },
  { from: "user", text: "E na vida profissional?" },
  {
    from: "bot",
    text:
      "Seu Meio do Céu em Aquário mostra que você veio para inovar e inspirar. Há um chamado para algo que una propósito, liberdade e impacto social.",
  },
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text:
            "O cosmos sussurra: confie na sua intuição neste momento. As estrelas estão alinhadas para revelações suaves — fique com o que vier sem pressa.",
        },
      ]);
    }, 900);
  };

  return (
    <div className="relative flex h-[calc(100vh-72px)] flex-col overflow-hidden">
      <StarField />
      <header className="relative flex items-center justify-between px-5 pt-7 pb-3">
        <button className="text-primary text-xl">‹</button>
        <h1 className="font-display tracking-[0.18em] text-[13px] text-primary">
          CONVERSA COM COSMORUM
        </h1>
        <span className="text-accent text-sm">✦</span>
      </header>

      <div className="relative flex-1 space-y-4 overflow-y-auto px-4 pb-2">
        {messages.map((m, i) => (
          <Bubble key={i} m={m} />
        ))}
        <div ref={endRef} />
      </div>

      <div className="relative border-t border-border/60 bg-cream/95 px-3 py-3 backdrop-blur-md">
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none"
          />
          <button
            type="submit"
            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}

function Bubble({ m }: { m: Msg }) {
  if (m.from === "user") {
    return (
      <div className="flex justify-end animate-fade-up">
        <div className="max-w-[78%] rounded-2xl rounded-tr-sm border border-blush/60 bg-blush/40 px-4 py-2.5 text-[13px] leading-relaxed text-foreground">
          {m.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 animate-fade-up">
      <img
        src={statueImg}
        alt="Cosmorum"
        width={1024}
        height={1024}
        loading="lazy"
        className="h-9 w-9 shrink-0 rounded-full object-cover gold-border"
      />
      <div className="relative max-w-[78%] rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-[13px] leading-relaxed text-foreground shadow-sm whitespace-pre-line">
        {m.text}
        {m.liked && (
          <Heart size={12} fill="currentColor" className="absolute -bottom-1.5 -right-1.5 text-primary" />
        )}
      </div>
    </div>
  );
}
