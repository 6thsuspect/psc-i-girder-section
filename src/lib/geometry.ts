import type { GirderParams, LinearDim, Point, ValidationIssue } from '../types';

/** Outline of the PSC-I mid-section, matching the original AutoCAD point order. */
export function defineGirderPoints(v: GirderParams): Point[] {
  return [
    { x: 0, y: 0 },
    { x: v.c, y: 0 },
    { x: v.c, y: v.f },
    { x: v.d / 2 + v.c / 2, y: v.f + v.i },
    { x: v.d / 2 + v.c / 2, y: v.f + v.i + v.h },
    { x: v.a / 2 + v.c / 2, y: v.f + v.i + v.h + v.g },
    { x: v.a / 2 + v.c / 2, y: v.f + v.i + v.h + v.g + v.e },
    { x: v.c / 2 - v.a / 2, y: v.f + v.i + v.h + v.g + v.e },
    { x: v.c / 2 - v.a / 2, y: v.f + v.i + v.h + v.g },
    { x: v.c / 2 - v.d / 2, y: v.f + v.i + v.h },
    { x: v.c / 2 - v.d / 2, y: v.f + v.i },
    { x: 0, y: v.f },
  ];
}

export function computedHeight(v: GirderParams): number {
  return v.e + v.g + v.h + v.i + v.f;
}

export function axisX(v: GirderParams): number {
  return v.c / 2;
}

export function validateGirder(v: GirderParams): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const keys: (keyof GirderParams)[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  for (const key of keys) {
    if (!Number.isFinite(v[key]) || v[key] < 0) {
      issues.push({ level: 'error', message: `Parameter ${key} must be a non-negative number.` });
    }
  }
  if (issues.some((i) => i.level === 'error')) return issues;

  if (v.a <= 0 || v.c <= 0 || v.d <= 0) {
    issues.push({ level: 'error', message: 'Flange widths and web thickness must be greater than zero.' });
  }
  if (v.e <= 0 || v.f <= 0 || v.h <= 0) {
    issues.push({ level: 'error', message: 'Flange thicknesses and web height must be greater than zero.' });
  }

  const h = computedHeight(v);
  if (Math.abs(h - v.b) > 0.5) {
    issues.push({
      level: 'warn',
      message: `Overall height b (${fmt(v.b)}) does not match e+g+h+i+f (${fmt(h)}). Drawing uses stacked depths.`,
    });
  }
  if (v.d >= v.c) {
    issues.push({
      level: 'warn',
      message: 'Web thickness d is not smaller than bottom flange width c — the bottom haunch will invert.',
    });
  }
  if (v.d >= v.a) {
    issues.push({
      level: 'warn',
      message: 'Web thickness d is not smaller than top flange width a — the top haunch will invert.',
    });
  }
  if (v.g <= 0 || v.i <= 0) {
    issues.push({
      level: 'warn',
      message: 'Haunch depths g or i are zero — the section will have sharp flange-to-web corners.',
    });
  }
  return issues;
}

export function girderDimensions(v: GirderParams, pts: Point[]): LinearDim[] {
  const p = pts;
  const H = computedHeight(v);
  const right = Math.max(v.c, v.c / 2 + v.a / 2);

  return [
    {
      id: 'c',
      p1: p[0]!,
      p2: p[1]!,
      offset: 150,
      side: -1,
      letter: 'c',
      title: 'Bottom flange width',
    },
    {
      id: 'f',
      p1: p[1]!,
      p2: p[2]!,
      offset: 220,
      side: -1,
      letter: 'f',
      title: 'Bottom flange thickness',
    },
    {
      id: 'i',
      p1: { x: right, y: v.f },
      p2: { x: right, y: v.f + v.i },
      offset: 220,
      side: -1,
      letter: 'i',
      title: 'Bottom haunch',
    },
    {
      id: 'h',
      p1: { x: right, y: v.f + v.i },
      p2: { x: right, y: v.f + v.i + v.h },
      offset: 220,
      side: -1,
      letter: 'h',
      title: 'Web height',
    },
    {
      id: 'g',
      p1: { x: right, y: v.f + v.i + v.h },
      p2: { x: right, y: v.f + v.i + v.h + v.g },
      offset: 220,
      side: -1,
      letter: 'g',
      title: 'Top haunch',
    },
    {
      id: 'e',
      p1: { x: right, y: H - v.e },
      p2: { x: right, y: H },
      offset: 220,
      side: -1,
      letter: 'e',
      title: 'Top flange thickness',
    },
    {
      id: 'b',
      p1: { x: right, y: 0 },
      p2: { x: right, y: H },
      offset: 400,
      side: -1,
      letter: 'b',
      title: 'Overall height',
    },
    {
      id: 'a',
      p1: p[7]!,
      p2: p[6]!,
      offset: 150,
      side: 1,
      letter: 'a',
      title: 'Top flange width',
    },
    {
      id: 'd',
      p1: p[9]!,
      p2: p[4]!,
      offset: Math.max(80, v.h * 0.35),
      side: -1,
      letter: 'd',
      title: 'Web thickness',
    },
  ];
}

export function modelExtents(v: GirderParams, pts: Point[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  const right = Math.max(v.c, v.c / 2 + v.a / 2);
  maxX = Math.max(maxX, right + 400);
  minY = Math.min(minY, -320);
  maxY = Math.max(maxY, computedHeight(v) + 220);
  minX = Math.min(minX, pts[7]!.x - 80);
  return { minX, maxX, minY, maxY };
}

export function pointsToPath(pts: Point[]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${-p.y}`).join(' ') + ' Z';
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
