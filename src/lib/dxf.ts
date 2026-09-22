import type { GirderParams, Point } from '../types';
import { computedHeight } from './geometry';

function pair(code: number, value: string | number): string {
  return `${code}\n${value}\n`;
}

function line(layer: string, a: Point, b: Point): string {
  return (
    pair(0, 'LINE') +
    pair(8, layer) +
    pair(10, a.x) +
    pair(20, a.y) +
    pair(11, b.x) +
    pair(21, b.y)
  );
}

function text(layer: string, p: Point, height: number, content: string): string {
  return (
    pair(0, 'TEXT') +
    pair(8, layer) +
    pair(10, p.x) +
    pair(20, p.y) +
    pair(40, height) +
    pair(1, content)
  );
}

export function girderToDxf(params: GirderParams, pts: Point[]): string {
  let entities = '';
  for (let i = 0; i < pts.length; i++) {
    entities += line('M_GIRDER', pts[i]!, pts[(i + 1) % pts.length]!);
  }
  const cx = params.c / 2;
  const H = computedHeight(params);
  entities += line('CO_CENTER', { x: cx, y: -40 }, { x: cx, y: H + 40 });
  entities += text('CO_TEXT', { x: 0, y: -300 }, 50, 'GIRDER MID SECTION DETAILS');

  return (
    pair(0, 'SECTION') +
    pair(2, 'HEADER') +
    pair(9, '$INSUNITS') +
    pair(70, 4) +
    pair(0, 'ENDSEC') +
    pair(0, 'SECTION') +
    pair(2, 'ENTITIES') +
    entities +
    pair(0, 'ENDSEC') +
    pair(0, 'EOF')
  );
}
