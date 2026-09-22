import type { GirderParams, Point, SectionProperties } from '../types';
import { computedHeight } from './geometry';

const CONCRETE_KN_M3 = 25;

export function sectionProperties(params: GirderParams, pts: Point[]): SectionProperties {
  const closed = pts;
  const n = closed.length;
  let area = 0;
  let ixx = 0;
  let iyy = 0;
  let ixy = 0;

  for (let i = 0; i < n; i++) {
    const p0 = closed[i]!;
    const p1 = closed[(i + 1) % n]!;
    const cross = p0.x * p1.y - p1.x * p0.y;
    area += cross;
    ixx += (p0.y * p0.y + p0.y * p1.y + p1.y * p1.y) * cross;
    iyy += (p0.x * p0.x + p0.x * p1.x + p1.x * p1.x) * cross;
    ixy += (p0.x * p1.y + 2 * p0.x * p0.y + 2 * p1.x * p1.y + p1.x * p0.y) * cross;
  }

  area *= 0.5;
  ixx /= 12;
  iyy /= 12;
  ixy /= 24;

  const cx =
    area === 0
      ? 0
      : (1 / (6 * area)) *
        closed.reduce((sum, p0, i) => {
          const p1 = closed[(i + 1) % n]!;
          return sum + (p0.x + p1.x) * (p0.x * p1.y - p1.x * p0.y);
        }, 0);
  const cy =
    area === 0
      ? 0
      : (1 / (6 * area)) *
        closed.reduce((sum, p0, i) => {
          const p1 = closed[(i + 1) % n]!;
          return sum + (p0.y + p1.y) * (p0.x * p1.y - p1.x * p0.y);
        }, 0);

  const IxxC = ixx - area * cy * cy;
  const IyyC = iyy - area * cx * cx;
  const IxyC = ixy - area * cx * cy;

  const A = Math.abs(area);
  const h = computedHeight(params);
  const yTop = h - cy;
  const yBot = cy;

  return {
    area: A,
    cx,
    cy,
    ixx: Math.abs(IxxC),
    iyy: Math.abs(IyyC),
    ixy: IxyC,
    ztTop: yTop > 0 ? Math.abs(IxxC) / yTop : 0,
    zbBot: yBot > 0 ? Math.abs(IxxC) / yBot : 0,
    selfWeightKnPerM: (A / 1e6) * CONCRETE_KN_M3,
    computedHeight: h,
  };
}

export function formatMm(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n - Math.round(n)) < 1e-6) return String(Math.round(n));
  return n.toFixed(digits);
}

export function formatSci(n: number, digits = 3): string {
  if (!Number.isFinite(n) || n === 0) return '0';
  if (Math.abs(n) >= 1e6 || Math.abs(n) < 0.01) return n.toExponential(digits);
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export function formatArea(mm2: number): string {
  return `${formatSci(mm2, 0)} mm²  ·  ${(mm2 / 100).toFixed(1)} cm²`;
}

export function formatInertia(mm4: number): string {
  return `${(mm4 / 1e6).toFixed(2)} ×10⁶ mm⁴`;
}
