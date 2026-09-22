export interface GirderParams {
  /** Top flange width */
  a: number;
  /** Overall height */
  b: number;
  /** Bottom flange width */
  c: number;
  /** Web thickness */
  d: number;
  /** Top flange thickness */
  e: number;
  /** Bottom flange thickness */
  f: number;
  /** Depth of web below top flange (top haunch) */
  g: number;
  /** Straight web height */
  h: number;
  /** Depth of web above bottom flange (bottom haunch) */
  i: number;
}

export type ParamKey = keyof GirderParams;

export interface Point {
  x: number;
  y: number;
}

export interface LinearDim {
  id: string;
  p1: Point;
  p2: Point;
  /** Offset distance in model space, along CAD +Y / +X outward */
  offset: number;
  /** Side of the segment in CAD space: which perpendicular to use */
  side: 1 | -1;
  letter: string;
  title: string;
}

export interface SectionProperties {
  area: number;
  cx: number;
  cy: number;
  ixx: number;
  iyy: number;
  ixy: number;
  ztTop: number;
  zbBot: number;
  selfWeightKnPerM: number;
  computedHeight: number;
}

export interface ValidationIssue {
  level: 'error' | 'warn';
  message: string;
}

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const PARAM_FIELDS: {
  key: ParamKey;
  label: string;
  hint: string;
}[] = [
  { key: 'a', label: 'Top flange width (a)', hint: 'Overall width of the top flange' },
  { key: 'b', label: 'Overall height (b)', hint: 'Should equal e + g + h + i + f' },
  { key: 'c', label: 'Bottom flange width (c)', hint: 'Overall width of the bottom flange' },
  { key: 'd', label: 'Web thickness (d)', hint: 'Thickness of the vertical web' },
  { key: 'e', label: 'Top flange thickness (e)', hint: 'Depth of the top flange slab' },
  { key: 'f', label: 'Bottom flange thickness (f)', hint: 'Depth of the bottom flange' },
  { key: 'g', label: 'Web below top flange (g)', hint: 'Top haunch / fillet depth' },
  { key: 'h', label: 'Web height (h)', hint: 'Straight web between haunches' },
  { key: 'i', label: 'Web above bottom flange (i)', hint: 'Bottom haunch / fillet depth' },
];

export const DEFAULT_PARAMS: GirderParams = {
  a: 900,
  b: 1500,
  c: 700,
  d: 500,
  e: 150,
  f: 250,
  g: 75,
  h: 875,
  i: 150,
};

export const PRESETS: { id: string; name: string; note: string; params: GirderParams }[] = [
  {
    id: 'default',
    name: 'Reference mid-span',
    note: 'Original GUI defaults',
    params: { ...DEFAULT_PARAMS },
  },
  {
    id: 'slender',
    name: 'Slender web',
    note: 'Narrower web, taller stem',
    params: {
      a: 1000,
      b: 1800,
      c: 650,
      d: 180,
      e: 140,
      f: 220,
      g: 90,
      h: 1220,
      i: 130,
    },
  },
  {
    id: 'heavy',
    name: 'Heavy bulb',
    note: 'Wide bottom flange',
    params: {
      a: 800,
      b: 1600,
      c: 900,
      d: 280,
      e: 160,
      f: 300,
      g: 80,
      h: 920,
      i: 140,
    },
  },
];
