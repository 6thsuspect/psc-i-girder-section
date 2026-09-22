export function ReferenceSchematic() {
  return (
    <svg viewBox="-20 -20 240 280" className="h-auto w-full text-ink-200" aria-hidden>
      <path
        d="M40 240 L160 240 L160 210 L130 190 L130 90 L180 70 L180 40 L20 40 L20 70 L70 90 L70 190 L40 210 Z"
        fill="#1a2330"
        stroke="#e2b56a"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <DimLine x1={20} y1={28} x2={180} y2={28} label="a" />
      <DimLine x1={200} y1={40} x2={200} y2={240} label="b" vertical />
      <DimLine x1={40} y1={252} x2={160} y2={252} label="c" />
      <DimLine x1={70} y1={140} x2={130} y2={140} label="d" />
      <text x={100} y={58} textAnchor="middle" fill="#e2b56a" fontSize="11" fontFamily="IBM Plex Mono, monospace">
        e
      </text>
      <text x={100} y={228} textAnchor="middle" fill="#e2b56a" fontSize="11" fontFamily="IBM Plex Mono, monospace">
        f
      </text>
      <text x={155} y={82} fill="#a8b3c4" fontSize="11" fontFamily="IBM Plex Mono, monospace">
        g
      </text>
      <text x={142} y={145} fill="#a8b3c4" fontSize="11" fontFamily="IBM Plex Mono, monospace">
        h
      </text>
      <text x={148} y={198} fill="#a8b3c4" fontSize="11" fontFamily="IBM Plex Mono, monospace">
        i
      </text>
    </svg>
  );
}

function DimLine({
  x1,
  y1,
  x2,
  y2,
  label,
  vertical,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  vertical?: boolean;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g stroke="#7d8aa0" fill="none" strokeWidth="1">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <text
        x={vertical ? x1 + 8 : mx}
        y={vertical ? my : y1 - 4}
        fill="#e2b56a"
        stroke="none"
        fontSize="11"
        fontFamily="IBM Plex Mono, monospace"
        textAnchor={vertical ? 'start' : 'middle'}
      >
        {label}
      </text>
    </g>
  );
}
