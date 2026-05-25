export function StarField({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 star-field opacity-60 ${className}`}
    />
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0l1.6 8.4L22 10l-8.4 1.6L12 20l-1.6-8.4L2 10l8.4-1.6z" />
    </svg>
  );
}

export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-accent ${className}`}>
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-accent/60" />
      <Sparkle className="h-3 w-3" />
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-accent/60" />
    </div>
  );
}
