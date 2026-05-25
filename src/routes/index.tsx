import { createFileRoute, Link } from "@tanstack/react-router";
import sunFace from "@/assets/sun-face.png";
import { StarField, Ornament } from "@/components/Celestial";

export const Route = createFileRoute("/")({
  component: Welcome,
  head: () => ({
    meta: [
      { title: "Cosmorum — seu universo, sua essência" },
      { name: "description", content: "Comece sua jornada celestial com Cosmorum: mapa astral, leituras emocionais e cartas diárias do cosmos." },
    ],
  }),
});

function Welcome() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-paper">
      <StarField />
      <div className="relative flex min-h-screen flex-col px-7 pt-16 pb-10">
        <div className="text-center animate-fade-up">
          <p className="tracking-mystic text-[10px] text-accent">★ COSMORUM ★</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-primary">
            Cosmorum
          </h1>
          <p className="mt-2 font-serif italic text-[15px] text-muted-foreground">
            seu universo, sua essência
          </p>
        </div>

        <div className="relative mt-6 animate-float">
          <div className="absolute inset-x-4 top-10 h-48 rounded-full bg-accent/15 blur-3xl" />
          <img
            src={sunFace}
            alt="Sol celestial entre nuvens"
            width={1024}
            height={1024}
            className="relative mx-auto w-full max-w-[320px] opacity-90"
            style={{ filter: "drop-shadow(0 16px 40px rgba(120, 40, 30, 0.18))" }}
          />
        </div>

        <div className="mt-8 text-center animate-fade-up">
          <Ornament />
          <h2 className="mt-5 font-display text-2xl leading-snug text-primary text-balance">
            Um universo emocional
            <br />
            <em className="font-serif">esperando por você.</em>
          </h2>
          <p className="mx-auto mt-3 max-w-[300px] text-[13px] leading-relaxed text-muted-foreground">
            Mapa astral profundo, leituras poéticas e cartas diárias do cosmos —
            uma jornada íntima entre você e as estrelas.
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-10">
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm tracking-[0.18em] text-primary-foreground shadow-mystic"
          >
            COMEÇAR MINHA JORNADA ✦
          </Link>
          <Link
            to="/auth"
            search={{ mode: "login" }}
            className="text-center font-serif text-sm italic text-muted-foreground"
          >
            já tenho uma conta —{" "}
            <span className="text-primary underline-offset-4 hover:underline">entrar</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
