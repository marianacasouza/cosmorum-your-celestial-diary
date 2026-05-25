import { Link, useLocation } from "@tanstack/react-router";
import { Star, Sun, MessageCircle, Sparkles, User } from "lucide-react";

const items = [
  { to: "/app/mapa", label: "MAPA", icon: Star },
  { to: "/app/leitura", label: "LEITURA", icon: Sun },
  { to: "/app/chat", label: "CHAT", icon: MessageCircle },
  { to: "/app/daily", label: "DAILY", icon: Sparkles },
  { to: "/app/eu", label: "EU", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 z-30 border-t border-border/60 bg-cream/95 backdrop-blur-md">
      <div className="flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-1"
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                className={active ? "text-primary" : "text-muted-foreground"}
                fill={active ? "currentColor" : "none"}
              />
              <span
                className={`text-[9px] tracking-[0.2em] ${
                  active ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
