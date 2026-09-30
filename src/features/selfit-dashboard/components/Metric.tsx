import type { DashboardStats } from '../types';

type MetricTone = 'slate' | 'emerald' | 'amber' | 'red';

export function Metric({ label, value, tone = 'slate' }: { label: string; value: number; tone?: MetricTone }) {
  const toneClass = {
    slate: 'border-l-slate-950 text-slate-950',
    emerald: 'border-l-emerald-500 text-emerald-700',
    amber: 'border-l-amber-500 text-amber-700',
    red: 'border-l-red-600 text-red-700',
  }[tone];

  return (
    <div className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm animate-fade-in-up ${toneClass}`}>
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <strong className="mt-1 block font-display text-3xl font-black">{value}</strong>
    </div>
  );
}

export function MetricsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Metric label="Equipamentos" value={stats.total} />
      <Metric label="Ativos" value={stats.ativas} tone="emerald" />
      <Metric label="Manutencao" value={stats.manutencao} tone="amber" />
      <Metric label="Garantias vigentes" value={stats.garantias} tone="red" />
    </section>
  );
}
