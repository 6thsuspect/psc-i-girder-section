import type { GirderParams, LinearDim, Point, SectionProperties } from '../types';
import { axisX, computedHeight, pointsToPath } from '../lib/geometry';
import { formatMm } from '../lib/properties';
import { LinearDimension } from './LinearDimension';

interface Props {
  params: GirderParams;
  points: Point[];
  dims: LinearDim[];
  props: SectionProperties;
  showDims: boolean;
  showHatch: boolean;
  showCenterline: boolean;
  showLabels: boolean;
  pulse: boolean;
}

export function GirderSheet({
  params,
  points,
  dims,
  props,
  showDims,
  showHatch,
  showCenterline,
  showLabels,
  pulse,
}: Props) {
  const path = pointsToPath(points);
  const cx = axisX(params);
  const H = computedHeight(params);
  const font = Math.max(22, Math.min(params.a, params.c, H) * 0.028);

  return (
    <g>
      <defs>
        <pattern id="concrete-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="14" stroke="#8d8270" strokeWidth="1.1" />
        </pattern>
        <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1f2a36" floodOpacity="0.18" />
        </filter>
      </defs>

      {showCenterline && (
        <line
          x1={cx}
          y1={40}
          x2={cx}
          y2={-H - 40}
          stroke="#9a4a32"
          strokeWidth={1.2}
          strokeDasharray="16 8 4 8"
        />
      )}

      <path
        d={path}
        fill={showHatch ? 'url(#concrete-hatch)' : '#d8d0c0'}
        stroke={pulse ? '#c9963a' : '#1f2a36'}
        strokeWidth={pulse ? 5 : 3.2}
        strokeLinejoin="round"
        filter="url(#soft)"
      />
      <path d={path} fill="#cfc6b4" fillOpacity={showHatch ? 0.45 : 0.85} stroke="none" />

      {showCenterline && (
        <circle cx={props.cx} cy={-props.cy} r={7} fill="#9a4a32" stroke="#f7f4ec" strokeWidth={1.5} />
      )}

      {showDims &&
        dims.map((dim) => <LinearDimension key={dim.id} dim={dim} fontSize={font} />)}

      {showLabels &&
        [
          { t: 'TOP FLANGE', p: { x: cx, y: H - params.e / 2 } },
          { t: 'WEB', p: { x: cx, y: params.f + params.i + params.h / 2 } },
          { t: 'BOTTOM FLANGE', p: { x: cx, y: params.f / 2 } },
        ].map((item) => (
          <text
            key={item.t}
            x={item.p.x}
            y={-item.p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#5c5346"
            fontSize={font * 0.85}
            fontFamily="Barlow Condensed, sans-serif"
            letterSpacing="2"
          >
            {item.t}
          </text>
        ))}

      <text
        x={Math.min(0, points[7]?.x ?? 0)}
        y={320}
        fill="#1f2a36"
        fontSize={font * 1.35}
        fontFamily="Barlow Condensed, sans-serif"
        fontWeight={600}
        letterSpacing="1.4"
      >
        GIRDER MID SECTION DETAILS
      </text>
      <text
        x={Math.min(0, points[7]?.x ?? 0)}
        y={320 + font * 1.6}
        fill="#5c5346"
        fontSize={font * 0.75}
        fontFamily="IBM Plex Mono, monospace"
      >
        PSC I-GIRDER  ·  UNITS mm  ·  NA @ {formatMm(props.cy)} FROM SOFFIT
      </text>
    </g>
  );
}
