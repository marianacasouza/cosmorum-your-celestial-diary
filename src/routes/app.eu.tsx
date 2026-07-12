import { createFileRoute } from "@tanstack/react-router";
import { Settings, Crown, BookOpen, Sparkles, Heart, Archive } from "lucide-react";
import { StarField, Ornament } from "@/components/Celestial";
import sunFace from "@/assets/sun-face.jpg";
import moonFace from "@/assets/moon-face.jpg";
import statue from "@/assets/statue-reading.jpg";
import { useLeitura } from "@/hooks/use-leitura";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/eu")({
  component: EuPage,
});

const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

function formatDate(d?: string): string | null {
  if (!d) return null;
  const parts = d.split(/[\s/\-]+/).filter(Boolean);
  if (parts.length !== 3) return d;
  const [dd, mm] = parts;
  const m = MONTHS[parseInt(mm, 10) - 1];
  if (!m) return d;
  return `${parseInt(dd, 10)} de ${m}`;
}

function EuPage() {
  const { user } = useAuth();
  const { profile, signs } = useLeitura();

  const displayName =
    profile?.name?.trim() ||
    ((user?.user_metadata as { full_name?: string } | undefined)?.full_name) ||
    user?.email?.split("@")[0] ||
    "Viajante";
  const firstName = displayName.split(" ")[0];
  const dateLabel = formatDate(profile?.date);
  const cityLabel = profile?.city?.trim() || null;
  const subtitle = [dateLabel, cityLabel].filter(Boolean).join(" · ");

  return (
    <div className="relative min-h-full overflow-hidden">
      <StarField />

      <header className="relative flex items-center justify-between px-5 pt-7">
        <span className="text-accent text-sm">✦</span>
        <h1 className="font-display tracking-[0.18em] text-[13px] text-primary">MEU UNIVERSO</h1>
        <button className="text-primary"><Settings size={16} strokeWidth={1.5} /></button>
      </header>

      <div className="relative mt-5 text-center">
        <div className="relative mx-auto h-24 w-24 animate-float">
          <img
            src={statue}
            alt="Avatar celestial"
            width={1024}
            height={1024}
            loading="lazy"
            className="h-full w-full rounded-full object-cover shadow-mystic gold-border"
          />
        </div>
        <h2 className="mt-3 font-display text-2xl text-primary">{firstName}</h2>
        {subtitle && (
          <p className="font-serif italic text-[12px] text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Trinity cards */}
      <div className="relative mx-5 mt-5 grid grid-cols-3 gap-2">
        <TrinityCard sym="☉" img={sunFace} label="SOL" sign={signs?.sol ?? "—"} />
        <TrinityCard sym="☽" img={moonFace} label="LUA" sign={signs?.lua ?? "—"} />
        <TrinityCard sym="↑" img={null} label="ASC" sign={signs?.asc ?? "—"} />
      </div>

      {/* Premium */}
      <div className="relative mx-5 mt-5 overflow-hidden rounded-3xl bg-paper-deep p-5 text-cream shadow-mystic">
        <div className="absolute inset-0 star-field opacity-40" />
        <div className="relative flex items-start gap-3">
          <Crown size={20} className="mt-1 text-accent" />
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] text-accent">COSMORUM PREMIUM</p>
            <h3 className="mt-1 font-display text-xl italic text-cream">
              Acesse o universo completo
            </h3>
            <p className="mt-1 text-[12px] leading-relaxed text-cream/75">
              Leituras profundas, trânsitos, sinastria e cartas exclusivas.
            </p>
            <button className="mt-3 rounded-full bg-cream px-5 py-2 text-[10px] tracking-[0.2em] text-wine-deep">
              EXPLORAR PREMIUM ✦
            </button>
          </div>
        </div>
      </div>

      {/* Sections list */}
      <div className="relative mx-5 mt-5 space-y-2">
        <RowCard icon={<BookOpen size={16} />} title="Leituras salvas" count="12" />
        <RowCard icon={<Sparkles size={16} />} title="Cartas favoritas" count="7" />
        <RowCard icon={<Heart size={16} />} title="Pessoas no meu cosmos" count="3" />
        <RowCard icon={<Archive size={16} />} title="Arquivo cósmico" count="48 dias" />
      </div>

      <Ornament className="my-5" />

      <p className="relative px-5 pb-6 text-center font-serif text-[12px] italic text-muted-foreground">
        "Você é feita de estrelas
        <br /> que escolheram um corpo."
      </p>
    </div>
  );
}

function TrinityCard({
  sym, img, label, sign,
}: { sym: string; img: string | null; label: string; sign: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 p-3 text-center shadow-sm">
      {img ? (
        <img src={img} alt={sign} width={1024} height={1024} loading="lazy" className="mx-auto h-14 w-14 rounded-full object-cover gold-border" />
      ) : (
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 font-display text-3xl text-primary gold-border">
          {sym}
        </div>
      )}
      <p className="mt-2 text-[9px] tracking-[0.25em] text-accent">{label}</p>
      <p className="font-display text-[15px] italic text-primary">{sign}</p>
    </div>
  );
}

function RowCard({ icon, title, count }: { icon: React.ReactNode; title: string; count: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 text-left shadow-sm">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="flex-1 text-[14px] text-foreground">{title}</span>
      <span className="text-[11px] tracking-[0.18em] text-muted-foreground">{count}</span>
      <span className="text-accent">›</span>
    </button>
  );
}
