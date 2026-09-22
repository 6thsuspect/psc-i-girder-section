import type { GirderParams, ValidationIssue } from '../types';
import { defineGirderPoints } from '../lib/geometry';
import {
  formatArea,
  formatInertia,
  formatMm,
  sectionProperties,
} from '../lib/properties';

interface Props {
  params: GirderParams;
  issues: ValidationIssue[];
}

export function PropertiesPanel({ params, issues }: Props) {
  const pts = defineGirderPoints(params);
  const s = sectionProperties(params, pts);

  return (
    <aside className="no-print flex h-full w-[300px] shrink-0 flex-col border-l border-white/5 bg-ink-900">
      <div className="border-b border-white/5 px-4 py-3">
        <p className="font-cond text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-400">
          Section properties
        </p>
        <p className="mt-1 text-xs text-ink-400">Polygon integrals of the mid-span outline.</p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        <Stat label="Area A" value={formatArea(s.area)} />
        <Stat label="Centroid x̄" value={`${formatMm(s.cx, 2)} mm from left of soffit`} />
        <Stat label="Neutral axis ȳ" value={`${formatMm(s.cy, 2)} mm from soffit`} />
        <Stat label="Ixx (about NA)" value={formatInertia(s.ixx)} />
        <Stat label="Iyy (about CL)" value={formatInertia(s.iyy)} />
        <Stat label="Z top" value={`${(s.ztTop / 1000).toFixed(0)} ×10³ mm³`} />
        <Stat label="Z soffit" value={`${(s.zbBot / 1000).toFixed(0)} ×10³ mm³`} />
        <Stat
          label="Self-weight"
          value={`${s.selfWeightKnPerM.toFixed(2)} kN/m  (γ = 25 kN/m³)`}
        />

        <div className="rounded-md border border-white/10 bg-ink-950/50 p-3 text-[12px] leading-relaxed text-ink-300">
          Values assume a homogeneous concrete section with the drawn outline. Haunches are
          included as linear tapers, matching the original AutoCAD mid-section generator.
        </div>

        <div>
          <p className="mb-2 font-cond text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
            Checks
          </p>
          {issues.length === 0 ? (
            <p className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
              Geometry is consistent.
            </p>
          ) : (
            <ul className="space-y-2">
              {issues.map((issue) => (
                <li
                  key={issue.message}
                  className={
                    issue.level === 'error'
                      ? 'rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200'
                      : 'rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200'
                  }
                >
                  {issue.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/5 pb-2">
      <p className="text-[10px] uppercase tracking-[0.16em] text-ink-400">{label}</p>
      <p className="mt-0.5 font-mono text-[13px] text-paper-50">{value}</p>
    </div>
  );
}
