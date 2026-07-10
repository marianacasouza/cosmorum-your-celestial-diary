import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { StarField } from "@/components/Celestial";
import statue from "@/assets/statue-reading.jpg";
import { useLeitura } from "@/hooks/use-leitura";

export const Route = createFileRoute("/app/leitura")({
  component: LeituraPage,
});

const TABS = ["ESSÊNCIA", "EMOÇÕES", "AMOR", "CARREIRA"] as const;

const READINGS: Record<(typeof TABS)[number], { title: string; subtitle: string; body: string[] }> = {
  ESSÊNCIA: {
    title: "Sua essência",
    subtitle: "Quem você é em sua expressão mais verdadeira",
    body: [
      "Você tem uma alma profunda, intuitiva e sensível. Seu mapa mostra uma forte conexão com o invisível, com os ciclos e com o que não pode ser explicado.",
      "Há uma sabedoria antiga em você. Você sente o que os outros não percebem, e carrega uma percepção aguçada da vida e das pessoas.",
      "Seu propósito envolve cura, compreensão e transmutação. Você não veio para seguir o comum — veio para deixar sua marca de forma significativa.",
    ],
  },
  EMOÇÕES: {
    title: "Seu mundo emocional",
    subtitle: "Como você sente, como você ama o silêncio",
    body: [
      "Sua Lua em Escorpião revela uma vida emocional intensa, profunda e quase oceânica. Você não sente em camadas leves — sente em ondas.",
      "Existe em você uma necessidade de intimidade real. Conversas superficiais te esgotam; encontros verdadeiros te alimentam.",
      "Aprender a abrir espaço para suas emoções — sem julgá-las — é parte do seu caminho de cura.",
    ],
  },
  AMOR: {
    title: "Sua linguagem do amor",
    subtitle: "Como você ama e como deseja ser amada",
    body: [
      "Vênus em Câncer na Casa 4 fala de um amor que constrói lar. Você ama protegendo, cuidando, criando refúgios emocionais.",
      "Você precisa de presença, lealdade e uma sensação clara de que o outro também escolheu ficar.",
      "Quando se sente segura, você floresce em ternura — uma das suas formas mais bonitas de amar.",
    ],
  },
  CARREIRA: {
    title: "Seu chamado",
    subtitle: "Para onde o cosmos te aponta",
    body: [
      "Meio do Céu em Aquário mostra que você veio para inovar, inspirar e tocar pessoas — não para seguir caminhos prontos.",
      "Há um chamado para algo com propósito, liberdade e impacto social. Estruturas rígidas te sufocam.",
      "Sua maior força profissional é unir sensibilidade emocional com uma visão fora do comum.",
    ],
  },
};

function LeituraPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("ESSÊNCIA");
  const data = READINGS[tab];

  return (
    <div className="relative min-h-full overflow-hidden">
      <StarField />
      <header className="relative flex items-center justify-between px-5 pt-7">
        <button className="text-primary text-xl">‹</button>
        <h1 className="font-display tracking-[0.18em] text-[15px] text-primary">
          <span className="text-accent">✦</span> SUA LEITURA <span className="text-accent">✦</span>
        </h1>
        <button className="text-accent"><Plus size={18} strokeWidth={1.5} /></button>
      </header>

      <div className="relative mx-5 mt-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-4 py-2 text-[10px] tracking-[0.2em] transition ${
              tab === t
                ? "bg-primary text-primary-foreground shadow-mystic"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="relative mx-5 mt-4 overflow-hidden rounded-3xl shadow-mystic">
        <img
          src={statue}
          alt="Estátua celestial"
          width={1024}
          height={1024}
          className="h-[260px] w-full object-cover"
        />
      </div>

      <div key={tab} className="relative mx-5 mt-5 animate-fade-up">
        <p className="text-[10px] tracking-[0.25em] text-accent">{data.title.toUpperCase()}</p>
        <h2 className="mt-2 font-display text-2xl italic leading-tight text-primary text-balance">
          {data.subtitle}
        </h2>
        <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-foreground/85">
          {data.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <button className="mt-5 w-full rounded-full border border-border bg-card py-3 text-[11px] tracking-[0.25em] text-primary">
          LER MAIS ↓
        </button>
      </div>

      <div className="h-6" />
    </div>
  );
}
