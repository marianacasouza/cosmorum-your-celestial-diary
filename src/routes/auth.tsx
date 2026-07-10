import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { StarField, Ornament, Sparkle } from "@/components/Celestial";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import moonFace from "@/assets/moon-face.jpg";


const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).catch("login"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthScreen,
  head: () => ({
    meta: [
      { title: "Entrar — Cosmorum" },
      { name: "description", content: "Acesse seu universo emocional em Cosmorum." },
    ],
  }),
});

function AuthScreen() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/app/mapa" });
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app/mapa`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado");
    } finally {
      setBusy(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/app/mapa` },
    });
    if (error) setError(error.message);
  };


  return (
    <div className="relative min-h-screen overflow-hidden bg-paper">
      <StarField />
      <div className="relative flex min-h-screen flex-col px-6 pt-10 pb-8">
        <Link to="/" className="font-serif text-sm italic text-muted-foreground">
          ← voltar
        </Link>

        <div className="mt-4 text-center">
          <div className="relative mx-auto h-24 w-24 animate-float">
            <img
              src={moonFace}
              alt="Lua celestial"
              width={1024}
              height={1024}
              className="h-full w-full rounded-full object-cover shadow-mystic gold-border"
            />
          </div>
          <p className="mt-4 tracking-mystic text-[10px] text-accent">COSMORUM</p>
          <h1 className="mt-2 font-display text-3xl text-primary">
            {isSignup ? "Comece sua jornada" : "Bem-vinda de volta"}
          </h1>
          <p className="mt-1 font-serif italic text-[13px] text-muted-foreground text-balance">
            {isSignup
              ? "as estrelas estavam esperando por você"
              : "o cosmos sentiu sua falta"}
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <button className="flex items-center justify-center gap-3 rounded-full border border-border bg-card px-6 py-3 text-sm text-foreground shadow-sm">
            <GoogleIcon /> Continuar com Google
          </button>
          <button className="flex items-center justify-center gap-3 rounded-full border border-border bg-card px-6 py-3 text-sm text-foreground shadow-sm">
            <AppleIcon /> Continuar com Apple
          </button>
        </div>

        <div className="my-5 flex items-center gap-3 text-[10px] tracking-[0.3em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          OU COM EMAIL
          <span className="h-px flex-1 bg-border" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/app/mapa" });
          }}
          className="flex flex-col gap-3"
        >
          {isSignup && (
            <Field label="Nome">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como o cosmos vai te chamar"
                className="w-full bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </Field>
          )}
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@cosmos.com"
              className="w-full bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </Field>
          <Field label="Senha">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </Field>

          {!isSignup && (
            <button type="button" className="self-end text-xs italic text-muted-foreground">
              esqueci minha senha
            </button>
          )}

          <button
            type="submit"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm tracking-[0.18em] text-primary-foreground shadow-mystic"
          >
            {isSignup ? "CRIAR MINHA CONTA" : "ENTRAR"} <Sparkle className="h-3 w-3" />
          </button>
        </form>

        <Ornament className="my-5" />

        <p className="text-center font-serif text-sm italic text-muted-foreground">
          {isSignup ? "já é parte do cosmos? " : "ainda não tem conta? "}
          <Link
            to="/auth"
            search={{ mode: isSignup ? "login" : "signup" }}
            className="text-primary not-italic underline-offset-4 hover:underline"
          >
            {isSignup ? "entrar" : "criar conta"}
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-2xl border border-border bg-card/70 px-4 py-2.5 shadow-sm">
      <span className="block text-[10px] tracking-[0.2em] text-accent">{label.toUpperCase()}</span>
      <div className="mt-0.5">{children}</div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.4 29.2 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.8 6.4 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.8 6.4 29.2 4.5 24 4.5c-7.4 0-13.8 4.1-17.7 10.2z" />
      <path fill="#4CAF50" d="M24 43.5c5.1 0 9.7-1.9 13.2-5l-6.1-5c-2 1.4-4.5 2.2-7.1 2.2-5.2 0-9.6-3.4-11.2-8l-6.5 5C9.9 39.5 16.4 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2.1-2.1 3.9-3.8 5.2l6.1 5c-.4.4 6.4-4.7 6.4-14.2 0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.4 12.7c0-2.8 2.3-4.1 2.4-4.2-1.3-1.9-3.3-2.2-4-2.2-1.7-.2-3.4 1-4.2 1-.9 0-2.2-1-3.7-1-1.9 0-3.7 1.1-4.7 2.9-2 3.5-.5 8.6 1.4 11.4 1 1.4 2.1 2.9 3.6 2.8 1.4-.1 2-.9 3.7-.9s2.2.9 3.7.9c1.5 0 2.5-1.4 3.5-2.7 1.1-1.5 1.5-3 1.5-3.1-.1 0-2.9-1.1-2.9-4.4zM13.7 4.5c.8-.9 1.3-2.2 1.1-3.5-1.1 0-2.4.7-3.2 1.6-.7.8-1.4 2.1-1.2 3.4 1.3.1 2.5-.6 3.3-1.5z" />
    </svg>
  );
}
