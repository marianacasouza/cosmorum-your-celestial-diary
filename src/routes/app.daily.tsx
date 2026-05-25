import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Calendar } from "lucide-react";
import { StarField, Sparkle } from "@/components/Celestial";
import moonFace from "@/assets/moon-face.jpg";
import peony from "@/assets/peony.jpg";
import statue from "@/assets/statue-reading.jpg";

export const Route = createFileRoute("/app/daily")({
  component: DailyPage,
});

const DAYS = [
  { n: "15", l: "QUI" },
  { n: "16", l: "SEX" },
  { n: "17", l: "SÁB" },
  { n: "18", l: "DOM" },
  { n: "19", l: "SEG" },
];

function DailyPage() {
  const [active, setActive] = useState("17");

  return (
    <div className="relative min-h-full overflow-hidden">
      <StarField />
      <header className="relative flex items-center justify-between px-5 pt-7">
        <button className="text-primary"><Menu size={18} strokeWidth={1.5} /></button>
        <h1 className="font-display tracking-[0.18em] text-[15px] text-primary">DAILY CARDS</h1>
        <button className="text-accent"><Calendar size={18} strokeWidth={1.5} /></button>
      </header>

      <div className="relative mx-5 mt-4 flex justify-between gap-1.5">
        {DAYS.map((d) => {
          const isActive = d.n === active;
          return (
            <button
              key={d.n}
              onClick={() => setActive(d.n)}
              className={`flex h-14 w-12 flex-col items-center justify-center rounded-full transition ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-mystic"
                  : "border border-border bg-card text-foreground"
              }`}
            >
              <span className="font-display text-base leading-none">{d.n}</span>
              <span className="mt-1 text-[8px] tracking-[0.18em] opacity-80">{d.l}</span>
            </button>
          );
        })}
      </div>

      <div className="relative mx-5 mt-5 space-y-4 pb-6">
        {/* Card 1 — night */}
        <article className="relative overflow-hidden rounded-3xl bg-night-sky p-5 text-cream shadow-mystic">
          <div className="absolute inset-0 star-field opacity-50" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.3em] text-cream/70">ENERGIA DO DIA</p>
              <h3 className="mt-2 font-display text-3xl italic leading-tight text-cream">
                Intuição
                <br /> em alta
              </h3>
              <p className="mt-3 max-w-[180px] text-[12px] leading-relaxed text-cream/80">
                A Lua favorece sonhos reveladores e insights profundos.
              </p>
            </div>
            <img
              src={moonFace}
              alt="Lua celestial"
              width={1024}
              height={1024}
              loading="lazy"
              className="h-24 w-24 shrink-0 rounded-2xl object-cover gold-border"
            />
          </div>
        </article>

        {/* Card 2 — blush */}
        <article className="relative overflow-hidden rounded-3xl border border-border bg-blush/40 p-5 shadow-sm">
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.3em] text-primary">AMOR</p>
              <h3 className="mt-2 font-display text-2xl italic leading-tight text-primary">
                Vínculos
                <br /> profundos
              </h3>
              <p className="mt-3 max-w-[200px] text-[12px] leading-relaxed text-foreground/75">
                Um bom dia para conversas sinceras e conexões verdadeiras.
              </p>
            </div>
            <img
              src={peony}
              alt="Peônia"
              width={768}
              height={1024}
              loading="lazy"
              className="h-28 w-24 shrink-0 rounded-2xl object-cover"
            />
          </div>
          <Sparkle className="absolute right-3 top-3 h-3 w-3 text-accent animate-twinkle" />
        </article>

        {/* Card 3 — cream */}
        <article className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.3em] text-terracotta">ALERTA ASTROLÓGICO</p>
              <h3 className="mt-2 font-display text-2xl italic leading-tight text-primary">
                Cuidado com impulsos
                <br /> emocionais
              </h3>
              <p className="mt-3 max-w-[200px] text-[12px] leading-relaxed text-foreground/75">
                Respire antes de reagir. Nem tudo precisa de resposta imediata.
              </p>
            </div>
            <img
              src={statue}
              alt="Estátua"
              width={1024}
              height={1024}
              loading="lazy"
              className="h-24 w-24 shrink-0 rounded-2xl object-cover"
            />
          </div>
        </article>

        {/* Card 4 — daily cosmic quote */}
        <article className="relative overflow-hidden rounded-3xl border border-accent/40 bg-cream p-6 text-center shadow-mystic">
          <div className="absolute inset-0 star-field opacity-40" />
          <p className="relative text-[10px] tracking-[0.3em] text-accent">CARTA DO DIA</p>
          <p className="relative mt-3 font-display text-2xl italic leading-snug text-primary text-balance">
            "Confie no que você sente."
          </p>
          <p className="relative mt-3 font-serif italic text-[12px] text-muted-foreground">
            A intuição é o seu mapa quando a lógica não alcança.
          </p>
          <button className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-[10px] tracking-[0.2em] text-primary">
            COMPARTILHAR ↑
          </button>
        </article>
      </div>
    </div>
  );
}
