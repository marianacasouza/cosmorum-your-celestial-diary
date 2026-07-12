import { createContext, useContext, useState, type ReactNode } from "react";

export type Profile = {
  name: string;
  date: string;
  time: string;
  city: string;
  country: string;
};

export type Signs = {
  sol?: string;
  lua?: string;
  asc?: string;
};

export type PlanetPosition = {
  signo: string;
  grau: string;
  grau_total?: string;
};

export type ChartData = {
  posicoes: Record<string, PlanetPosition>;
  ascendente: { signo: string; grau: string };
  casas_whole_sign: Array<{ casa: number; signo: string }>;
};

type LeituraContextValue = {
  leitura: string | null;
  setLeitura: (v: string | null) => void;
  profile: Profile | null;
  setProfile: (v: Profile | null) => void;
  signs: Signs | null;
  setSigns: (v: Signs | null) => void;
  chart: ChartData | null;
  setChart: (v: ChartData | null) => void;
  generated: boolean;
  setGenerated: (v: boolean) => void;
};

const LeituraContext = createContext<LeituraContextValue>({
  leitura: null,
  setLeitura: () => {},
  profile: null,
  setProfile: () => {},
  signs: null,
  setSigns: () => {},
  chart: null,
  setChart: () => {},
  generated: false,
  setGenerated: () => {},
});

export function LeituraProvider({ children }: { children: ReactNode }) {
  const [leitura, setLeitura] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [signs, setSigns] = useState<Signs | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [generated, setGenerated] = useState(false);
  return (
    <LeituraContext.Provider
      value={{ leitura, setLeitura, profile, setProfile, signs, setSigns, chart, setChart, generated, setGenerated }}
    >
      {children}
    </LeituraContext.Provider>
  );
}

export const useLeitura = () => useContext(LeituraContext);
