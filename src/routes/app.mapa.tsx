import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, User, Calendar, Clock, MapPin, Globe, ChevronDown, Loader2 } from "lucide-react";
import { StarField, Sparkle, Ornament } from "@/components/Celestial";
import sunFace from "@/assets/sun-face.png";
import { NatalChart } from "@/components/NatalChart";
import { useLeitura, type ChartData } from "@/hooks/use-leitura";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  SIGN_SYMBOLS,
  ROMAN,
  computeAspects,
  formatDeg,
  houseOf,
  normalizeSign,
} from "@/lib/astro";

export const Route = createFileRoute("/app/mapa")({
  component: MapaPage,
});

function parseDate(d: string): string {
  const parts = d.split(/[\s/\-]+/).filter(Boolean);
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts;
    return `${yyyy.padStart(4, "0")}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return d;
}

function parseTime(t: string): string {
  return t.replace(/\s+/g, "");
}

type WebhookResponse = {
  leitura?: string;
  posicoes?: ChartData["posicoes"];
  ascendente?: ChartData["ascendente"];
  casas_whole_sign?: ChartData["casas_whole_sign"];
};

function MapaPage() {
  const { user } = useAuth();
  const { setLeitura, profile, setProfile, setSigns, setChart, generated, setGenerated } = useLeitura();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(
    profile ?? {
      name: ((user?.user_metadata as { full_name?: string } | undefined)?.full_name) ?? user?.email?.split("@")[0] ?? "",
      date: "",
      time: "",
      city: "",
      country: "Brasil",
    },
  );

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://roraimacunha.app.n8n.cloud/webhook/cosmorum-mapa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.name,
          data_nascimento: parseDate(form.date),
          hora_nascimento: parseTime(form.time),
          cidade: form.city,
          pais: form.country,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json().catch(() => ({}));
      const data: WebhookResponse = Array.isArray(raw) ? raw[0] ?? {} : raw ?? {};

      if (data.leitura) setLeitura(data.leitura);

      let chart: ChartData | null = null;
      if (data.posicoes && data.ascendente && data.casas_whole_sign) {
        chart = {
          posicoes: data.posicoes,
          ascendente: data.ascendente,
          casas_whole_sign: data.casas_whole_sign,
        };
        setChart(chart);
        setSigns({
          sol: normalizeSign(data.posicoes["Sol"]?.signo ?? ""),
          lua: normalizeSign(data.posicoes["Lua"]?.signo ?? ""),
          asc: normalizeSign(data.ascendente.signo ?? ""),
        });
      }

      setProfile(form);
      setGenerated(true);

      // Persist to Supabase (best-effort — requires birth_charts table)
      if (user && chart) {
        supabase
          .from("birth_charts")
          .insert({
            user_id: user.id,
            name: form.name,
            birth_date: parseDate(form.date),
            birth_time: parseTime(form.time),
            city: form.city,
            country: form.country,
            sun_sign: normalizeSign(chart.posicoes["Sol"]?.signo ?? ""),
            moon_sign: normalizeSign(chart.posicoes["Lua"]?.signo ?? ""),
            asc_sign: normalizeSign(chart.ascendente.signo ?? ""),
            posicoes: chart.posicoes,
            ascendente: chart.ascendente,
            casas_whole_sign: chart.casas_whole_sign,
            leitura: data.leitura ?? null,
          })
          .then(({ error }) => {
            if (error) console.warn("[birth_charts] insert failed:", error.message);
          });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar mapa");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="relative mx-6 -mb-2">
        <img
          src={sunFace}
          alt="Sol celestial"
          width={1024}
          height={1024}
          className="mx-auto w-full max-w-[220px] opacity-90"
          style={{ filter: "drop-shadow(0 12px 30px rgba(120, 40, 30, 0.18))" }}
        />
      </div>

      <div className="relative px-6">
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
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm tracking-[0.2em] text-primary-foreground shadow-mystic disabled:opacity-60"
        >
          {loading ? (
            <>CONSULTANDO AS ESTRELAS <Loader2 className="h-3.5 w-3.5 animate-spin" /></>
          ) : (
            <>GERAR MEU MAPA <Sparkle className="h-3 w-3" /></>
          )}
        </button>
        {error && (
          <p className="mt-3 text-center text-[11px] text-red-700">{error}</p>
        )}

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
  const { chart } = useLeitura();
  const [tab, setTab] = useState<"posicoes" | "aspectos" | "casas">("aspectos");

  const ascSign = chart ? normalizeSign(chart.ascendente.signo) : "";

  const aspects = chart
    ? computeAspects(chart).slice(0, 8).map((a) => ({
        n: a.a, b: a.b, aSym: a.aSym, bSym: a.bSym,
        rel: a.label, orb: a.orb, sym: a.sym, color: a.color,
      }))
    : [];

  const positions = chart
    ? [
        ...Object.entries(chart.posicoes).map(([planet, p]) => ({
          p: planet,
          s: normalizeSign(p.signo),
          deg: formatDeg(p.grau),
          h: `Casa ${ROMAN[houseOf(p.signo, ascSign) - 1] ?? "—"}`,
        })),
        {
          p: "Ascendente",
          s: ascSign,
          deg: formatDeg(chart.ascendente.grau),
          h: "—",
        },
      ]
    : [];

  const houses = chart
    ? chart.casas_whole_sign.map((h) => ({
        n: ROMAN[h.casa - 1] ?? String(h.casa),
        s: normalizeSign(h.signo),
        sym: SIGN_SYMBOLS[normalizeSign(h.signo)] ?? "",
      }))
    : [];


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
        <NatalChart chart={chart} />
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
                  <span className="font-display text-lg text-primary">{a.aSym}</span>
                  <span className="flex-1 truncate">
                    {a.n} <em className="italic text-muted-foreground">{a.rel}</em> {a.b}{" "}
                    <span className="font-display text-primary">{a.bSym}</span>
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
                  <span className="font-serif italic text-muted-foreground">
                    {h.sym} {h.s}
                  </span>
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
