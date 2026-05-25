import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, User, Calendar, Clock, MapPin, Globe, ChevronDown } from "lucide-react";
import { StarField, Sparkle, Ornament } from "@/components/Celestial";
import sunFace from "@/assets/sun-face.png";
import { NatalChart } from "@/components/NatalChart";

export const Route = createFileRoute("/app/mapa")({
  component: MapaPage,
});

function MapaPage() {
  const [generated, setGenerated] = useState(false);
  const [form, setForm] = useState({
    name: "Mariana Silva",
    date: "17 / 05 / 1993",
    time: "14 : 30",
    city: "São Paulo, SP",
    country: "Brasil",
  });

  if (generated) {
    return <ChartView name={form.name} onBack={() => setGenerated(false)} />;
  }

  return (
    <div className="relative min-h-full overflow-hidden">
      <StarField />
      <header className="relative px-6 pt-8">
        <button className="absolute right-5 top-8 rounded-full p-2 text-primary">
          <Bell size={18} strokeWidth={1.5} />
        </button>
        <div className="text-center">
          <p className="tracking-mystic text-[10px] text-accent">★ COSMORUM ★</p>
          <h1 className="mt-1 font-display text-4xl leading-none text-primary">COSMORUM</h1>
          <p className="mt-1 font-serif italic text-[13px] text-muted-foreground">
            seu universo, sua essência
          </p>
        </div>
      </header>

      <div className="relative mx-6 mt-2 animate-float">
        <img
          src={sunFace}
          alt="Sol celestial"
          width={1024}
          height={1024}
          className="mx-auto w-full max-w-[240px] opacity-90"
          style={{ filter: "drop-shadow(0 12px 30px rgba(120, 40, 30, 0.18))" }}
        />
      </div>

      <div className="relative mt-2 px-6">
        <div className="text-center">
          <p className="font-serif text-[15px] italic text-primary/80">Bem-vinda ao</p>
          <h2 className="mt-0.5 font-display text-4xl italic leading-none text-primary">
            seu cosmos
          </h2>
          <p className="mx-auto mt-3 max-w-[260px] text-[12px] leading-relaxed text-muted-foreground">
            Para começar, preciso de algumas informações sobre você.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <InputCard icon={<User size={16} />} label="Nome completo">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-transparent text-[15px] focus:outline-none"
            />
          </InputCard>
          <InputCard icon={<Calendar size={16} />} label="Data de nascimento" trailing={<Calendar size={16} className="text-accent" />}>
            <input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full bg-transparent text-[15px] focus:outline-none"
            />
          </InputCard>
          <InputCard icon={<Clock size={16} />} label="Hora de nascimento" trailing={<Clock size={16} className="text-accent" />}>
            <input
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full bg-transparent text-[15px] focus:outline-none"
            />
          </InputCard>
          <InputCard icon={<MapPin size={16} />} label="Cidade de nascimento">
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full bg-transparent text-[15px] focus:outline-none"
            />
          </InputCard>
          <InputCard icon={<Globe size={16} />} label="País" trailing={<ChevronDown size={16} className="text-accent" />}>
            <input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full bg-transparent text-[15px] focus:outline-none"
            />
          </InputCard>
        </div>

        <button
          onClick={() => setGenerated(true)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm tracking-[0.2em] text-primary-foreground shadow-mystic"
        >
          GERAR MEU MAPA <Sparkle className="h-3 w-3" />
        </button>

        <Ornament className="my-6" />
      </div>
    </div>
  );
}

function InputCard({
  icon,
  label,
  trailing,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-2.5 shadow-sm">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <div className="text-foreground">{children}</div>
      </div>
      {trailing}
    </div>
  );
}

function ChartView({ name, onBack }: { name: string; onBack: () => void }) {
  const [tab, setTab] = useState<"posicoes" | "aspectos" | "casas">("aspectos");

  const aspects = [
    { a: "☉", n: "Sol", rel: "trígono", b: "Lua", bs: "☽", orb: "3°12'", sym: "△", color: "text-blue-700" },
    { a: "☽", n: "Lua", rel: "oposição", b: "Marte", bs: "♂", orb: "5°47'", sym: "☍", color: "text-red-700" },
    { a: "☿", n: "Mercúrio", rel: "trígono", b: "Júpiter", bs: "♃", orb: "2°21'", sym: "△", color: "text-blue-700" },
    { a: "♀", n: "Vênus", rel: "quadratura", b: "Saturno", bs: "♄", orb: "4°01'", sym: "□", color: "text-red-700" },
    { a: "♂", n: "Marte", rel: "sextil", b: "Urano", bs: "♅", orb: "1°39'", sym: "✶", color: "text-blue-700" },
  ];

  const positions = [
    { p: "Sol", s: "Touro", deg: "26°14'", h: "Casa X" },
    { p: "Lua", s: "Escorpião", deg: "08°02'", h: "Casa IV" },
    { p: "Ascendente", s: "Leão", deg: "12°47'", h: "—" },
    { p: "Mercúrio", s: "Gêmeos", deg: "03°55'", h: "Casa XI" },
    { p: "Vênus", s: "Câncer", deg: "19°28'", h: "Casa XII" },
    { p: "Marte", s: "Touro", deg: "14°06'", h: "Casa X" },
    { p: "Júpiter", s: "Libra", deg: "22°41'", h: "Casa III" },
    { p: "Saturno", s: "Aquário", deg: "27°33'", h: "Casa VII" },
    { p: "Quíron", s: "Leão", deg: "05°18'", h: "Casa I" },
  ];

  const houses = Array.from({ length: 12 }, (_, i) => ({
    n: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][i],
    s: ["Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes", "Áries", "Touro", "Gêmeos", "Câncer"][i],
    deg: `${(i * 7 + 4) % 30}°${(i * 13) % 60 < 10 ? "0" : ""}${(i * 13) % 60}'`,
  }));

  return (
    <div className="relative min-h-full overflow-hidden">
      <StarField />
      <header className="relative flex items-center justify-between px-5 pt-7">
        <button onClick={onBack} className="text-primary text-xl">‹</button>
        <h1 className="font-display tracking-[0.18em] text-[15px] text-primary">
          <span className="text-accent">✦</span> MEU MAPA ASTRAL <span className="text-accent">✦</span>
        </h1>
        <button className="text-primary"><Bell size={16} strokeWidth={1.5} /></button>
      </header>

      <p className="relative mt-1 text-center text-[10px] tracking-[0.3em] text-accent">{name.toUpperCase()}</p>

      <div className="relative mx-4 mt-3">
        <NatalChart />
      </div>

      <div className="relative mx-5 mt-3 grid grid-cols-3 gap-2">
        {(["posicoes", "aspectos", "casas"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3 py-2 text-[11px] tracking-[0.18em] transition ${
              tab === t
                ? "bg-primary text-primary-foreground shadow-mystic"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {t === "posicoes" ? "POSIÇÕES" : t === "aspectos" ? "ASPECTOS" : "CASAS"}
          </button>
        ))}
      </div>

      <div className="relative mx-4 mt-3 rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
        {tab === "aspectos" && (
          <>
            <p className="mb-2 text-[10px] tracking-[0.2em] text-accent">PRINCIPAIS ASPECTOS</p>
            <ul className="divide-y divide-border/60">
              {aspects.map((a) => (
                <li key={a.n + a.b} className="flex items-center gap-3 py-2 text-[13px]">
                  <span className="font-display text-lg text-primary">{a.a}</span>
                  <span className="flex-1 truncate">
                    {a.n} <em className="italic text-muted-foreground">{a.rel}</em> {a.b}{" "}
                    <span className="font-display text-primary">{a.bs}</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">orb {a.orb}</span>
                  <span className={`font-display text-lg ${a.color}`}>{a.sym}</span>
                </li>
              ))}
            </ul>
            <button className="mt-3 w-full rounded-full border border-border py-2.5 text-[11px] tracking-[0.2em] text-primary">
              VER TODOS OS ASPECTOS
            </button>
          </>
        )}

        {tab === "posicoes" && (
          <>
            <p className="mb-2 text-[10px] tracking-[0.2em] text-accent">PLANETAS & PONTOS</p>
            <ul className="divide-y divide-border/60">
              {positions.map((p) => (
                <li key={p.p} className="flex items-center justify-between gap-2 py-2 text-[13px]">
                  <span className="font-medium text-foreground">{p.p}</span>
                  <span className="flex-1 text-right font-serif italic text-muted-foreground">
                    {p.s} · {p.deg}
                  </span>
                  <span className="text-[10px] tracking-[0.18em] text-accent">{p.h}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === "casas" && (
          <>
            <p className="mb-2 text-[10px] tracking-[0.2em] text-accent">SIGNOS WHOLE SIGN</p>
            <ul className="grid grid-cols-2 gap-1.5">
              {houses.map((h) => (
                <li key={h.n} className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2 text-[12px]">
                  <span className="font-display text-base text-primary">{h.n}</span>
                  <span className="font-serif italic text-muted-foreground">{h.s}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <Ornament className="my-5" />
    </div>
  );
}
