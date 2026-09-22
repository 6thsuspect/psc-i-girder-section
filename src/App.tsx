import { useCallback, useMemo, useRef, useState } from 'react';
import { DrawingCanvas } from './components/DrawingCanvas';
import { ParameterPanel } from './components/ParameterPanel';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Toolbar } from './components/Toolbar';
import { girderToDxf } from './lib/dxf';
import { downloadBlob, serializeSvg, svgElementToPngBlob } from './lib/exportDrawing';
import { computedHeight, defineGirderPoints, validateGirder } from './lib/geometry';
import { DEFAULT_PARAMS, type GirderParams, type ParamKey } from './types';

export default function App() {
  const [draft, setDraft] = useState<GirderParams>({ ...DEFAULT_PARAMS });
  const [committed, setCommitted] = useState<GirderParams>({ ...DEFAULT_PARAMS });
  const [live, setLive] = useState(true);
  const [showDims, setShowDims] = useState(true);
  const [showHatch, setShowHatch] = useState(true);
  const [showCenterline, setShowCenterline] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [fitToken, setFitToken] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const params = live ? draft : committed;
  const issues = useMemo(() => validateGirder(params), [params]);
  const blocking = issues.some((i) => i.level === 'error');

  const onChange = (key: ParamKey, value: number) => {
    setDraft((prev) => {
      const next = { ...prev, [key]: value };
      if (key !== 'b' && ['e', 'f', 'g', 'h', 'i'].includes(key) && Number.isFinite(value)) {
        next.b = computedHeight(next);
      }
      return next;
    });
  };

  const draw = useCallback(() => {
    if (issues.some((i) => i.level === 'error')) return;
    setCommitted({ ...draft });
    setPulse(true);
    setFitToken((n) => n + 1);
    window.setTimeout(() => setPulse(false), 700);
  }, [draft, issues]);

  const exportSvg = async () => {
    if (!svgRef.current) return;
    const xml = serializeSvg(svgRef.current);
    await downloadBlob('PSC-I-GIRDER-MID-SECTION.svg', new Blob([xml], { type: 'image/svg+xml' }));
  };

  const exportPng = async () => {
    if (!svgRef.current) return;
    const blob = await svgElementToPngBlob(svgRef.current, 2);
    await downloadBlob('PSC-I-GIRDER-MID-SECTION.png', blob);
  };

  const exportDxf = async () => {
    const dxf = girderToDxf(params, defineGirderPoints(params));
    await downloadBlob('PSC-I-GIRDER-MID-SECTION.dxf', new Blob([dxf], { type: 'application/dxf' }));
  };

  const exportJson = async () => {
    const body = JSON.stringify({ name: 'PSC-I girder mid-section', units: 'mm', params }, null, 2);
    await downloadBlob('PSC-I-GIRDER-params.json', new Blob([body], { type: 'application/json' }));
  };

  return (
    <div className="flex h-full flex-col bg-ink-950">
      <header className="no-print flex items-center justify-between border-b border-white/5 bg-ink-900 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brass-500/15 ring-1 ring-brass-400/40">
            <svg viewBox="0 0 32 32" className="h-6 w-6">
              <path
                d="M6 6h20v5H21v10h5v5H6v-5h5V11H6z"
                fill="none"
                stroke="#e2b56a"
                strokeWidth="2.2"
              />
            </svg>
          </div>
          <div>
            <h1 className="font-cond text-xl font-semibold uppercase tracking-[0.14em] text-paper-50">
              PSC-I Girder
            </h1>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ink-400">
              Mid-section drawing studio
            </p>
          </div>
        </div>
        <div className="hidden text-right md:block">
          <p className="font-mono text-[11px] text-ink-400">DWG PSC-I-MID-01 · MILLIMETRES</p>
          <p className="text-[11px] text-ink-400">SVG visualisation of the PyQt5 / AutoCAD mid-span tool</p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <ParameterPanel
          params={draft}
          onChange={onChange}
          onReplace={(next) => {
            setDraft(next);
            if (live) setCommitted(next);
          }}
          onDraw={draw}
          onSyncHeight={() =>
            setDraft((prev) => ({ ...prev, b: computedHeight(prev) }))
          }
        />

        <main className="flex min-w-0 flex-1 flex-col bg-[#161d28]">
          <Toolbar
            showDims={showDims}
            showHatch={showHatch}
            showCenterline={showCenterline}
            showLabels={showLabels}
            live={live}
            onToggle={(key) => {
              if (key === 'dims') setShowDims((v) => !v);
              if (key === 'hatch') setShowHatch((v) => !v);
              if (key === 'center') setShowCenterline((v) => !v);
              if (key === 'labels') setShowLabels((v) => !v);
              if (key === 'live') setLive((v) => !v);
            }}
            onFit={() => setFitToken((n) => n + 1)}
            onExportSvg={() => void exportSvg()}
            onExportPng={() => void exportPng()}
            onExportDxf={() => void exportDxf()}
            onExportJson={() => void exportJson()}
            onPrint={() => window.print()}
          />
          <div className="relative min-h-0 flex-1 p-4">
            <div className="sheet-grid h-full overflow-hidden rounded-xl border border-white/10 bg-paper-50 shadow-sheet">
              {blocking ? (
                <div className="flex h-full items-center justify-center bg-paper-50 text-sm text-cad-line">
                  Enter valid dimensions to draw the mid-section.
                </div>
              ) : (
                <DrawingCanvas
                  params={params}
                  showDims={showDims}
                  showHatch={showHatch}
                  showCenterline={showCenterline}
                  showLabels={showLabels}
                  pulse={pulse}
                  svgRef={svgRef}
                  onFitRequest={fitToken}
                />
              )}
            </div>
          </div>
        </main>

        <PropertiesPanel params={params} issues={issues} />
      </div>
    </div>
  );
}
