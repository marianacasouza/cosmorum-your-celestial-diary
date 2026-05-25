/* Decorative natal chart — Whole Sign houses with planets & aspects. */
const SIGNS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

// Planet positions in degrees (0-360, 0 = ASC at left, going counter-clockwise)
const PLANETS = [
  { sym: "☉", deg: 56, color: "var(--gold)" },
  { sym: "☽", deg: 218, color: "var(--gold)" },
  { sym: "☿", deg: 65, color: "var(--wine)" },
  { sym: "♀", deg: 109, color: "var(--wine)" },
  { sym: "♂", deg: 44, color: "var(--wine)" },
  { sym: "♃", deg: 200, color: "var(--wine)" },
  { sym: "♄", deg: 297, color: "var(--wine)" },
  { sym: "♅", deg: 134, color: "var(--wine)" },
  { sym: "♆", deg: 152, color: "var(--wine)" },
  { sym: "⚷", deg: 145, color: "var(--wine)" },
];

const ASPECT_LINES = [
  { a: 0, b: 2, c: "#3a5fa8" },
  { a: 0, b: 4, c: "#3a5fa8" },
  { a: 1, b: 5, c: "#a83a3a" },
  { a: 2, b: 6, c: "#a83a3a" },
  { a: 3, b: 7, c: "#3a5fa8" },
  { a: 1, b: 4, c: "#a83a3a" },
  { a: 0, b: 6, c: "#3a5fa8" },
  { a: 5, b: 9, c: "#a83a3a" },
];

export function NatalChart() {
  const cx = 200, cy = 200;
  const rOuter = 195;
  const rSigns = 168;
  const rHouses = 130;
  const rInner = 80;
  const rPlanets = 152;

  const polar = (deg: number, r: number) => {
    const rad = ((180 - deg) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  };

  return (
    <div className="relative rounded-2xl border border-border bg-card/70 p-2 shadow-mystic">
      <svg viewBox="0 0 400 400" className="block w-full">
        <defs>
          <radialGradient id="bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbf3df" />
            <stop offset="100%" stopColor="#f0e6cf" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={rOuter} fill="url(#bg)" stroke="var(--gold)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={rSigns} fill="none" stroke="var(--gold)" strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r={rHouses} fill="none" stroke="var(--gold)" strokeWidth="0.6" opacity="0.7" />
        <circle cx={cx} cy={cy} r={rInner} fill="#fbf3df" stroke="var(--gold)" strokeWidth="0.8" />

        {/* Sign divisions (12 sectors of 30°) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const deg = i * 30;
          const p1 = polar(deg, rInner);
          const p2 = polar(deg, rOuter);
          return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--gold)" strokeWidth="0.5" opacity="0.6" />;
        })}

        {/* Sign glyphs */}
        {SIGNS.map((s, i) => {
          const p = polar(i * 30 + 15, (rSigns + rOuter) / 2);
          return (
            <text key={s} x={p.x} y={p.y + 6} textAnchor="middle" fontSize="16" fill="var(--wine)" fontFamily="serif">
              {s}
            </text>
          );
        })}

        {/* House numbers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const p = polar(i * 30 + 15, (rHouses + rInner) / 2);
          return (
            <text key={i} x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fill="#999" fontFamily="serif">
              {i + 1}
            </text>
          );
        })}

        {/* Aspect lines inside inner circle */}
        {ASPECT_LINES.map((l, i) => {
          const pa = polar(PLANETS[l.a].deg, rInner - 4);
          const pb = polar(PLANETS[l.b].deg, rInner - 4);
          return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={l.c} strokeWidth="0.7" opacity="0.7" />;
        })}

        {/* ASC / MC labels */}
        <text x={6} y={cy + 4} fontSize="10" fill="var(--wine)" fontFamily="serif" fontWeight="600">ASC</text>
        <text x={cx} y={14} textAnchor="middle" fontSize="10" fill="var(--wine)" fontFamily="serif" fontWeight="600">MC</text>

        {/* Planets */}
        {PLANETS.map((pl) => {
          const p = polar(pl.deg, rPlanets);
          return (
            <g key={pl.sym}>
              <circle cx={p.x} cy={p.y} r="10" fill="#fbf3df" stroke={pl.color} strokeWidth="0.8" />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="13" fill={pl.color} fontFamily="serif">
                {pl.sym}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
