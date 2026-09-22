import { RotateCcw } from 'lucide-react';
import type { GirderParams, ParamKey } from '../types';
import { DEFAULT_PARAMS, PARAM_FIELDS, PRESETS } from '../types';
import { computedHeight } from '../lib/geometry';
import { ReferenceSchematic } from './ReferenceSchematic';

interface Props {
  params: GirderParams;
  onChange: (key: ParamKey, value: number) => void;
  onReplace: (next: GirderParams) => void;
  onDraw: () => void;
  onSyncHeight: () => void;
}

export function ParameterPanel({ params, onChange, onReplace, onDraw, onSyncHeight }: Props) {
  const stacked = computedHeight(params);

  return (
    <aside className="no-print flex h-full min-h-0 w-[340px] shrink-0 flex-col border-r border-white/5 bg-ink-900">
      <div className="border-b border-white/5 px-4 py-3">
        <p className="font-cond text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-400">
          Section parameters
        </p>
        <p className="mt-1 text-xs text-ink-400">All values in millimetres. Enter to tab, last field draws.</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div className="mb-4 rounded-lg border border-white/5 bg-ink-950/60 p-3">
          <ReferenceSchematic />
        </div>

        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
          Preset
        </label>
        <select
          className="mb-4 w-full rounded-md border border-white/10 bg-ink-800 px-2 py-2 text-sm text-ink-200 outline-none focus:border-brass-400"
          defaultValue="default"
          onChange={(e) => {
            const preset = PRESETS.find((p) => p.id === e.target.value);
            if (preset) onReplace({ ...preset.params });
          }}
        >
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="space-y-2">
          {PARAM_FIELDS.map((field, index) => (
            <label key={field.key} className="block">
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] text-ink-200">{field.label}</span>
                <span className="font-mono text-[10px] text-ink-400">mm</span>
              </span>
              <input
                type="number"
                min={0}
                max={10_000_000}
                step={1}
                value={Number.isFinite(params[field.key]) ? params[field.key] : ''}
                onChange={(e) => onChange(field.key, e.target.value === '' ? Number.NaN : Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  if (index === PARAM_FIELDS.length - 1) onDraw();
                  else {
                    const next = document.querySelector<HTMLInputElement>(
                      `input[data-param="${PARAM_FIELDS[index + 1]?.key}"]`,
                    );
                    next?.focus();
                    next?.select();
                  }
                }}
                data-param={field.key}
                className="mt-1 w-full rounded-md border border-white/10 bg-ink-800 px-2.5 py-1.5 font-mono text-sm text-paper-50 outline-none ring-brass-400/40 focus:border-brass-400 focus:ring-2"
              />
              <span className="mt-0.5 block text-[11px] text-ink-400">{field.hint}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 rounded-md border border-white/10 bg-ink-800/80 px-3 py-2 text-xs text-ink-300">
          Stacked depth e+g+h+i+f ={' '}
          <span className="font-mono text-brass-400">{stacked}</span> mm
          {Math.abs(stacked - params.b) > 0.5 && (
            <button
              type="button"
              onClick={onSyncHeight}
              className="ml-2 text-brass-400 underline decoration-brass-400/40"
            >
              Set b to {stacked}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-t border-white/5 p-4">
        <button
          type="button"
          onClick={() => onReplace({ ...DEFAULT_PARAMS })}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-ink-200 hover:bg-ink-700"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button
          type="button"
          onClick={onDraw}
          className="flex-[1.4] rounded-md bg-brass-500 px-3 py-2.5 font-cond text-sm font-semibold uppercase tracking-[0.14em] text-ink-950 shadow-lg shadow-brass-500/20 hover:bg-brass-400"
        >
          Draw Mid Section
        </button>
      </div>
    </aside>
  );
}
