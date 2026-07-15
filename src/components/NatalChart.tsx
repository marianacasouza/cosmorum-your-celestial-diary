import type { ChartData } from "@/hooks/use-leitura";
import { PLANET_SYMBOLS, SIGN_ORDER, totalDegrees, normalizeSign } from "@/lib/astro";

const SIGN_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

// Which planets get "harmonic" (gold) vs "tense" (wine) styling — purely decorative
const GOLD_PLANETS = new Set(["Sol", "Lua"]);

// Aspect angles in degrees with color by harmony
const ASPECT_DEFS: Array<{ angle: number; orb: number; color: string }> = [
  { angle: 0, orb: 8, color: "#8a6a2a" },   // conjunction (neutral gold)
  { angle: 60, orb: 4, color: "#3a5fa8" },  // sextile (blue)
  { angle: 120, orb: 6, color: "#3a5fa8" }, // trine (blue)
  { angle: 90, orb: 6, color: "#a83a3a" },  // square (red)
  { angle: 180, orb: 8, color: "#a83a3a" }, // opposition (red)
];

function ascLongitude(chart: ChartData): number {
  const a = chart.ascendente;
  const raw = a.grau_total ?? a.longitude;
  if (raw !== undefined && raw !== null) {
    const n = typeof raw === "number" ? raw : parseFloat(String(raw).replace(",", "."));
    if (isFinite(n)) return n;
  }
  return totalDegrees(a.signo, a.grau);
}

function planetLongitude(signo: string, grau: string | number, grauTotal?: string | number): number {
  if (grauTotal !== undefined && grauTotal !== null) {
    const n = typeof grauTotal === "number" ? grauTotal : parseFloat(String(grauTotal).replace(",", "."));
    if (isFinite(n)) return n;
  }
  return totalDegrees(signo, grau);
}

type PlanetDot = { name: string; sym: string; deg: number; color: string };

export function NatalChart({ chart }: { chart?: ChartData | null }) {
  const cx = 200, cy = 200;
  const rOuter = 195;
  const rSigns = 168;
  const rHouses = 130;
  const rInner = 80;
  const rPlanets = 152;

  // deg is "angle from ASC", counter-clockwise. 0 => left (9 o'clock).
  // ASC at left (9h), zodiac progresses counter-clockwise through IC (bottom),
  // DSC (right), MC (top). Screen Y grows downward, so add r*sin(rad).
  const polar = (deg: number, r: number) => {
    const rad = ((180 - deg) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const ascLon = chart ? ascLongitude(chart) : 0;
  const ascSignIdx = chart ? SIGN_ORDER.indexOf(normalizeSign(chart.ascendente.signo)) : 0;

  // Sign wheel rotates so ASC sign sits at the left (9 o'clock).
  // The offset within the ASC sign puts the exact ASC degree at the left.
  const ascOffsetInSign = ascLon - ascSignIdx * 30;

  const planets: PlanetDot[] = chart
    ? Object.entries(chart.posicoes).map(([name, p]) => {
        const lon = planetLongitude(p.signo, p.grau, p.grau_total);
        const angle = ((lon - ascLon) % 360 + 360) % 360;
        return {
          name,
          sym: PLANET_SYMBOLS[name] ?? "•",
          deg: angle,
          color: GOLD_PLANETS.has(name) ? "var(--gold)" : "var(--wine)",
        };
      })
    : [];

  // Avoid overlapping planet glyphs: bump colliding ones to alternate radii.
  const sorted = [...planets].sort((a, b) => a.deg - b.deg);
  const radiusOf = new Map<string, number>();
  for (let i = 0; i < sorted.length; i++) {
    let r = rPlanets;
    const prev = sorted[i - 1];
    if (prev && Math.min(Math.abs(sorted[i].deg - prev.deg), 360 - Math.abs(sorted[i].deg - prev.deg)) < 6) {
      const prevR = radiusOf.get(prev.name) ?? rPlanets;
      r = prevR === rPlanets ? rPlanets - 20 : prevR === rPlanets - 20 ? rPlanets - 40 : rPlanets;
    }
    radiusOf.set(sorted[i].name, r);
  }

  // Aspect lines between planets
  const aspectLines: Array<{ x1: number; y1: number; x2: number; y2: number; color: string }> = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      let diff = Math.abs(planets[i].deg - planets[j].deg) % 360;
      if (diff > 180) diff = 360 - diff;
      for (const asp of ASPECT_DEFS) {
        if (Math.abs(diff - asp.angle) <= asp.orb) {
          const pa = polar(planets[i].deg, rInner - 4);
          const pb = polar(planets[j].deg, rInner - 4);
          aspectLines.push({ x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y, color: asp.color });
          break;
        }
      }
    }
  }

  return (
    <div className="relative rounded-2xl border border-border bg-card/70 p-2 shadow-mystic">
      <svg viewBox="0 0 400 400" className="block w-full">
        <defs>
          <radialGradient id="bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbf3df" />
            <stop offset="100%" stopColor="#f0e6cf" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={rOuter} fill="url(#bg)" stroke="var(--gold)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={rSigns} fill="none" stroke="var(--gold)" strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r={rHouses} fill="none" stroke="var(--gold)" strokeWidth="0.6" opacity="0.7" />
        <circle cx={cx} cy={cy} r={rInner} fill="#fbf3df" stroke="var(--gold)" strokeWidth="0.8" />

        {/* Sign divisions: 12 sectors of 30°, rotated so ASC sign starts at left */}
        {Array.from({ length: 12 }).map((_, i) => {
          const deg = i * 30 + ascOffsetInSign;
          const p1 = polar(deg, rInner);
          const p2 = polar(deg, rOuter);
          return <line key={`div-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--gold)" strokeWidth="0.5" opacity="0.6" />;
        })}

        {/* Sign glyphs — ordered starting at ASC sign, placed in the middle of each sector */}
        {SIGN_GLYPHS.map((_, i) => {
          const signIdx = (ascSignIdx + i) % 12;
          const p = polar(i * 30 + 15 + ascOffsetInSign, (rSigns + rOuter) / 2);
          return (
            <text key={`sign-${i}`} x={p.x} y={p.y + 6} textAnchor="middle" fontSize="16" fill="var(--wine)" fontFamily="serif">
              {SIGN_GLYPHS[signIdx]}
            </text>
          );
        })}

        {/* House numbers (whole-sign, so aligned with sign sectors) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const p = polar(i * 30 + 15 + ascOffsetInSign, (rHouses + rInner) / 2);
          return (
            <text key={`h-${i}`} x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fill="#999" fontFamily="serif">
              {i + 1}
            </text>
          );
        })}

        {/* Aspect lines */}
        {aspectLines.map((l, i) => (
          <line key={`asp-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth="0.7" opacity="0.7" />
        ))}

        {/* ASC / MC labels */}
        <text x={6} y={cy + 4} fontSize="10" fill="var(--wine)" fontFamily="serif" fontWeight="600">ASC</text>
        <text x={cx} y={14} textAnchor="middle" fontSize="10" fill="var(--wine)" fontFamily="serif" fontWeight="600">MC</text>

        {/* Planets */}
        {planets.map((pl) => {
          const r = radiusOf.get(pl.name) ?? rPlanets;
          const p = polar(pl.deg, r);
          return (
            <g key={pl.name}>
              <circle cx={p.x} cy={p.y} r="10" fill="#fbf3df" stroke={pl.color} strokeWidth="0.8" />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="13" fill={pl.color} fontFamily="serif">
                {pl.sym}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
