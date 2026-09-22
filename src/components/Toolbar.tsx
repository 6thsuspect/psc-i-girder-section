import type { ReactNode } from 'react';
import {
  BoxSelect,
  Download,
  Eye,
  EyeOff,
  FileJson,
  Focus,
  Grid3x3,
  Printer,
} from 'lucide-react';

interface Props {
  showDims: boolean;
  showHatch: boolean;
  showCenterline: boolean;
  showLabels: boolean;
  live: boolean;
  onToggle: (key: 'dims' | 'hatch' | 'center' | 'labels' | 'live') => void;
  onFit: () => void;
  onExportSvg: () => void;
  onExportPng: () => void;
  onExportDxf: () => void;
  onExportJson: () => void;
  onPrint: () => void;
}

export function Toolbar({
  showDims,
  showHatch,
  showCenterline,
  showLabels,
  live,
  onToggle,
  onFit,
  onExportSvg,
  onExportPng,
  onExportDxf,
  onExportJson,
  onPrint,
}: Props) {
  return (
    <div className="no-print flex flex-wrap items-center gap-2 border-b border-white/5 bg-ink-900/80 px-3 py-2">
      <Toggle pressed={live} onClick={() => onToggle('live')} label="Live preview" />
      <Toggle pressed={showDims} onClick={() => onToggle('dims')} label="Dimensions" />
      <Toggle pressed={showHatch} onClick={() => onToggle('hatch')} label="Hatch" />
      <Toggle
        pressed={showCenterline}
        onClick={() => onToggle('center')}
        label="Centreline / NA"
      />
      <Toggle pressed={showLabels} onClick={() => onToggle('labels')} label="Part names" />

      <span className="mx-1 h-5 w-px bg-white/10" />

      <IconBtn onClick={onFit} title="Fit drawing">
        <Focus className="h-4 w-4" />
        Fit
      </IconBtn>
      <IconBtn onClick={onExportSvg} title="Export SVG">
        <Download className="h-4 w-4" />
        SVG
      </IconBtn>
      <IconBtn onClick={onExportPng} title="Export PNG">
        <Grid3x3 className="h-4 w-4" />
        PNG
      </IconBtn>
      <IconBtn onClick={onExportDxf} title="Export DXF">
        <BoxSelect className="h-4 w-4" />
        DXF
      </IconBtn>
      <IconBtn onClick={onExportJson} title="Export parameters JSON">
        <FileJson className="h-4 w-4" />
        JSON
      </IconBtn>
      <IconBtn onClick={onPrint} title="Print">
        <Printer className="h-4 w-4" />
        Print
      </IconBtn>

      <span className="ml-auto hidden items-center gap-1 text-[11px] text-ink-400 sm:flex">
        {live ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        Scroll to zoom · drag to pan
      </span>
    </div>
  );
}

function Toggle({
  pressed,
  onClick,
  label,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={
        pressed
          ? 'rounded-full border border-brass-400/40 bg-brass-400/15 px-2.5 py-1 text-[11px] font-medium text-brass-400'
          : 'rounded-full border border-white/10 bg-ink-800 px-2.5 py-1 text-[11px] text-ink-300 hover:text-ink-200'
      }
    >
      {label}
    </button>
  );
}

function IconBtn({
  children,
  onClick,
  title,
}: {
  children: ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-ink-800 px-2 py-1 text-[11px] text-ink-200 hover:border-brass-400/40 hover:text-brass-400"
    >
      {children}
    </button>
  );
}
