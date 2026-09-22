import type { LinearDim, Point } from '../types';
import { formatMm } from '../lib/properties';

function dimGeometry(dim: LinearDim) {
  const dx = dim.p2.x - dim.p1.x;
  const dy = dim.p2.y - dim.p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy * dim.side;
  const ny = ux * dim.side;
  const ox = nx * dim.offset;
  const oy = ny * dim.offset;
  const a1 = { x: dim.p1.x + ox, y: dim.p1.y + oy };
  const a2 = { x: dim.p2.x + ox, y: dim.p2.y + oy };
  const mid = { x: (a1.x + a2.x) / 2, y: (a1.y + a2.y) / 2 };
  const tick = 18;
  const t1a = { x: a1.x - ux * tick - nx * tick * 0.35, y: a1.y - uy * tick - ny * tick * 0.35 };
  const t1b = { x: a1.x + ux * tick + nx * tick * 0.35, y: a1.y + uy * tick + ny * tick * 0.35 };
  const t2a = { x: a2.x - ux * tick - nx * tick * 0.35, y: a2.y - uy * tick - ny * tick * 0.35 };
  const t2b = { x: a2.x + ux * tick + nx * tick * 0.35, y: a2.y + uy * tick + ny * tick * 0.35 };
  const nHat = { x: nx, y: ny };
  return { a1, a2, mid, t1a, t1b, t2a, t2b, len, nHat };
}

function toSvg(p: Point): Point {
  return { x: p.x, y: -p.y };
}

export function LinearDimension({ dim, fontSize }: { dim: LinearDim; fontSize: number }) {
  const g = dimGeometry(dim);
  const p1 = toSvg(dim.p1);
  const p2 = toSvg(dim.p2);
  const a1 = toSvg(g.a1);
  const a2 = toSvg(g.a2);
  const mid = toSvg(g.mid);
  const value = formatMm(g.len);
  const label = `${dim.letter}  ${value}`;

  const extOver = 14;
  const e1 = toSvg({
    x: g.a1.x + g.nHat.x * extOver,
    y: g.a1.y + g.nHat.y * extOver,
  });
  const e2 = toSvg({
    x: g.a2.x + g.nHat.x * extOver,
    y: g.a2.y + g.nHat.y * extOver,
  });

  const textAngle = (() => {
    const ang = (Math.atan2(a2.y - a1.y, a2.x - a1.x) * 180) / Math.PI;
    return Math.abs(ang) > 90 ? ang + 180 : ang;
  })();

  return (
    <g className="dim" stroke="#0e6e8c" fill="none" strokeWidth={1.6} strokeLinecap="round">
      <line x1={p1.x} y1={p1.y} x2={e1.x} y2={e1.y} opacity={0.7} />
      <line x1={p2.x} y1={p2.y} x2={e2.x} y2={e2.y} opacity={0.7} />
      <line x1={a1.x} y1={a1.y} x2={a2.x} y2={a2.y} />
      <line x1={toSvg(g.t1a).x} y1={toSvg(g.t1a).y} x2={toSvg(g.t1b).x} y2={toSvg(g.t1b).y} strokeWidth={2} />
      <line x1={toSvg(g.t2a).x} y1={toSvg(g.t2a).y} x2={toSvg(g.t2b).x} y2={toSvg(g.t2b).y} strokeWidth={2} />
      <g transform={`translate(${mid.x} ${mid.y - fontSize * 0.35}) rotate(${textAngle})`}>
        <rect
          x={-label.length * fontSize * 0.32}
          y={-fontSize * 0.85}
          width={label.length * fontSize * 0.64}
          height={fontSize * 1.25}
          fill="#f7f4ec"
          stroke="none"
        />
        <text
          fill="#0e6e8c"
          stroke="none"
          fontSize={fontSize}
          fontFamily="IBM Plex Mono, monospace"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      </g>
    </g>
  );
}
