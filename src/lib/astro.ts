import type { ChartData } from "@/hooks/use-leitura";

export const SIGN_ORDER = [
  "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
  "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes",
];

// Also accept without accent / variants
const SIGN_ALIASES: Record<string, string> = {
  "aries": "Áries",
  "áries": "Áries",
  "touro": "Touro",
  "gemeos": "Gêmeos",
  "gêmeos": "Gêmeos",
  "cancer": "Câncer",
  "câncer": "Câncer",
  "leao": "Leão",
  "leão": "Leão",
  "virgem": "Virgem",
  "libra": "Libra",
  "escorpiao": "Escorpião",
  "escorpião": "Escorpião",
  "sagitario": "Sagitário",
  "sagitário": "Sagitário",
  "capricornio": "Capricórnio",
  "capricórnio": "Capricórnio",
  "aquario": "Aquário",
  "aquário": "Aquário",
  "peixes": "Peixes",
};

export const PLANET_SYMBOLS: Record<string, string> = {
  "Sol": "☉", "Lua": "☽", "Mercúrio": "☿", "Vênus": "♀", "Marte": "♂",
  "Júpiter": "♃", "Saturno": "♄", "Urano": "♅", "Netuno": "♆", "Plutão": "♇",
  "Quíron": "⚷", "Ascendente": "↑",
};

export const SIGN_SYMBOLS: Record<string, string> = {
  "Áries": "♈", "Touro": "♉", "Gêmeos": "♊", "Câncer": "♋", "Leão": "♌", "Virgem": "♍",
  "Libra": "♎", "Escorpião": "♏", "Sagitário": "♐", "Capricórnio": "♑", "Aquário": "♒", "Peixes": "♓",
};

export const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];

export function normalizeSign(s: string): string {
  return SIGN_ALIASES[s.trim().toLowerCase()] ?? s;
}

export function signIndex(s: string): number {
  return SIGN_ORDER.indexOf(normalizeSign(s));
}

export function totalDegrees(signo: string, grau: string | number): number {
  const idx = signIndex(signo);
  const g = typeof grau === "number" ? grau : parseFloat(String(grau).replace(",", "."));
  return idx * 30 + (isFinite(g) ? g : 0);
}

export function formatDeg(grau: string | number): string {
  const g = typeof grau === "number" ? grau : parseFloat(String(grau).replace(",", "."));
  if (!isFinite(g)) return String(grau);
  const d = Math.floor(g);
  const m = Math.round((g - d) * 60);
  return `${String(d).padStart(2, "0")}°${String(m).padStart(2, "0")}'`;
}

// House (whole-sign): planet's sign relative to ASC sign
export function houseOf(planetSign: string, ascSign: string): number {
  const p = signIndex(planetSign);
  const a = signIndex(ascSign);
  if (p < 0 || a < 0) return 0;
  return ((p - a + 12) % 12) + 1;
}

export type AspectType = "conjuncao" | "sextil" | "quadratura" | "trigono" | "oposicao";

const ASPECTS: Array<{ type: AspectType; angle: number; orb: number; label: string; sym: string; harmonic: "harm" | "tens" | "neut" }> = [
  { type: "conjuncao", angle: 0, orb: 8, label: "conjunção", sym: "☌", harmonic: "neut" },
  { type: "sextil", angle: 60, orb: 4, label: "sextil", sym: "✶", harmonic: "harm" },
  { type: "quadratura", angle: 90, orb: 6, label: "quadratura", sym: "□", harmonic: "tens" },
  { type: "trigono", angle: 120, orb: 6, label: "trígono", sym: "△", harmonic: "harm" },
  { type: "oposicao", angle: 180, orb: 8, label: "oposição", sym: "☍", harmonic: "tens" },
];

export type ComputedAspect = {
  a: string; b: string;
  aSym: string; bSym: string;
  label: string; sym: string;
  orb: string;
  color: string;
};

export function computeAspects(chart: ChartData): ComputedAspect[] {
  const entries = Object.entries(chart.posicoes).map(([name, p]) => ({
    name,
    deg: p.grau_total ? parseFloat(String(p.grau_total).replace(",", ".")) : totalDegrees(p.signo, p.grau),
  }));
  const results: ComputedAspect[] = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i], b = entries[j];
      let diff = Math.abs(a.deg - b.deg) % 360;
      if (diff > 180) diff = 360 - diff;
      for (const asp of ASPECTS) {
        const orb = Math.abs(diff - asp.angle);
        if (orb <= asp.orb) {
          results.push({
            a: a.name, b: b.name,
            aSym: PLANET_SYMBOLS[a.name] ?? "•",
            bSym: PLANET_SYMBOLS[b.name] ?? "•",
            label: asp.label, sym: asp.sym,
            orb: formatDeg(orb),
            color: asp.harmonic === "harm" ? "text-blue-700" : asp.harmonic === "tens" ? "text-red-700" : "text-primary",
          });
          break;
        }
      }
    }
  }
  results.sort((x, y) => {
    const ox = parseFloat(x.orb);
    const oy = parseFloat(y.orb);
    return ox - oy;
  });
  return results;
}
