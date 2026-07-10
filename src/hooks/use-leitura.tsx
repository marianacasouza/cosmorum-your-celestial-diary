import { createContext, useContext, useState, type ReactNode } from "react";

type LeituraContextValue = {
  leitura: string | null;
  setLeitura: (value: string | null) => void;
};

const LeituraContext = createContext<LeituraContextValue>({
  leitura: null,
  setLeitura: () => {},
});

export function LeituraProvider({ children }: { children: ReactNode }) {
  const [leitura, setLeitura] = useState<string | null>(null);
  return (
    <LeituraContext.Provider value={{ leitura, setLeitura }}>
      {children}
    </LeituraContext.Provider>
  );
}

export const useLeitura = () => useContext(LeituraContext);
