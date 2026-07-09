import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div className="max-w-sm">
        <p className="tracking-mystic text-xs text-accent">COSMORUM</p>
        <h1 className="mt-4 font-display text-6xl text-primary">404</h1>
        <p className="mt-2 font-serif italic text-muted-foreground">
          Esta estrela ainda não foi descoberta.
        </p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div className="max-w-sm">
        <h1 className="font-display text-2xl text-primary">Algo se perdeu no cosmos</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente em um instante.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Cosmorum — seu universo, sua essência" },
      { name: "description", content: "Comece sua jornada celestial com Cosmorum: mapa astral, leituras emocionais e cartas diárias do cosmos." },
      { name: "author", content: "Cosmorum" },
      { name: "theme-color", content: "#f3ead6" },
      { property: "og:title", content: "Cosmorum — seu universo, sua essência" },
      { property: "og:description", content: "Comece sua jornada celestial com Cosmorum: mapa astral, leituras emocionais e cartas diárias do cosmos." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Cosmorum — seu universo, sua essência" },
      { name: "twitter:description", content: "Comece sua jornada celestial com Cosmorum: mapa astral, leituras emocionais e cartas diárias do cosmos." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/65a88d5d-a644-4ea8-83f9-1a34e624e14e/id-preview-870919c7--1ba011e4-09cb-423f-b397-726df1ff1e9c.lovable.app-1779711497222.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/65a88d5d-a644-4ea8-83f9-1a34e624e14e/id-preview-870919c7--1ba011e4-09cb-423f-b397-726df1ff1e9c.lovable.app-1779711497222.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-x-hidden">
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
