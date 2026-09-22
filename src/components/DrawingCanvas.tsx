import { useEffect, useMemo, useRef, useState, type PointerEvent, type RefObject } from 'react';
import type { GirderParams, ViewBox } from '../types';
import {
  defineGirderPoints,
  girderDimensions,
  modelExtents,
} from '../lib/geometry';
import { sectionProperties } from '../lib/properties';
import { GirderSheet } from './GirderSheet';

interface Props {
  params: GirderParams;
  showDims: boolean;
  showHatch: boolean;
  showCenterline: boolean;
  showLabels: boolean;
  pulse: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
  onFitRequest: number;
}

function padBox(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  pad: number,
): ViewBox {
  const w = Math.max(10, maxX - minX);
  const h = Math.max(10, maxY - minY);
  return { x: minX - pad, y: -(maxY + pad), w: w + pad * 2, h: h + pad * 2 };
}

export function DrawingCanvas({
  params,
  showDims,
  showHatch,
  showCenterline,
  showLabels,
  pulse,
  svgRef,
  onFitRequest,
}: Props) {
  const points = useMemo(() => defineGirderPoints(params), [params]);
  const dims = useMemo(() => girderDimensions(params, points), [params, points]);
  const section = useMemo(() => sectionProperties(params, points), [params, points]);
  const extents = useMemo(() => modelExtents(params, points), [params, points]);

  const fitted = useMemo(
    () => padBox(extents.minX, extents.maxX, extents.minY, extents.maxY, 80),
    [extents],
  );

  const [view, setView] = useState<ViewBox>(fitted);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const fittedRef = useRef(fitted);
  fittedRef.current = fitted;
  const viewRef = useRef(view);
  viewRef.current = view;

  useEffect(() => {
    setView(fittedRef.current);
  }, [onFitRequest]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const current = viewRef.current;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const cursor = pt.matrixTransform(ctm.inverse());
      const factor = e.deltaY > 0 ? 1.12 : 0.89;
      const newW = current.w * factor;
      const newH = current.h * factor;
      setView({
        x: cursor.x - ((cursor.x - current.x) / current.w) * newW,
        y: cursor.y - ((cursor.y - current.y) / current.h) * newH,
        w: newW,
        h: newH,
      });
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [svgRef]);

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
  };

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = ((e.clientX - drag.current.x) / rect.width) * view.w;
    const dy = ((e.clientY - drag.current.y) / rect.height) * view.h;
    setView({ ...view, x: drag.current.vx - dx, y: drag.current.vy - dy });
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <div className="relative h-full min-h-0 print-sheet">
      <svg
        ref={svgRef as RefObject<SVGSVGElement>}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        className="h-full w-full cursor-grab active:cursor-grabbing touch-none select-none rounded-sm bg-paper-50"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="img"
        aria-label="PSC-I girder mid-section drawing"
      >
        <rect x={view.x} y={view.y} width={view.w} height={view.h} fill="#f7f4ec" />
        <GirderSheet
          params={params}
          points={points}
          dims={dims}
          props={section}
          showDims={showDims}
          showHatch={showHatch}
          showCenterline={showCenterline}
          showLabels={showLabels}
          pulse={pulse}
        />
      </svg>
    </div>
  );
}
