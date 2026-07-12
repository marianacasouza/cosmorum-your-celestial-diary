import { createContext, useContext, useState, type ReactNode } from "react";

export type Profile = {
  name: string;
  date: string; // "DD / MM / YYYY" as typed in form
  time: string;
  city: string;
  country: string;
};

export type Signs = {
  sol?: string;
  lua?: string;
  asc?: string;
};

type LeituraContextValue = {
  leitura: string | null;
  setLeitura: (value: string | null) => void;
  profile: Profile | null;
  setProfile: (value: Profile | null) => void;
  signs: Signs | null;
  setSigns: (value: Signs | null) => void;
  generated: boolean;
  setGenerated: (value: boolean) => void;
};

const LeituraContext = createContext<LeituraContextValue>({
  leitura: null,
  setLeitura: () => {},
  profile: null,
  setProfile: () => {},
  signs: null,
  setSigns: () => {},
  generated: false,
  setGenerated: () => {},
});

export function LeituraProvider({ children }: { children: ReactNode }) {
  const [leitura, setLeitura] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [signs, setSigns] = useState<Signs | null>(null);
  const [generated, setGenerated] = useState(false);
  return (
    <LeituraContext.Provider
      value={{ leitura, setLeitura, profile, setProfile, signs, setSigns, generated, setGenerated }}
    >
      {children}
    </LeituraContext.Provider>
  );
}

export const useLeitura = () => useContext(LeituraContext);
