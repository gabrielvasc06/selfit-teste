import type { ApiEquipment } from '../types';

export function CompactList({ items, empty, detail }: { items: ApiEquipment[]; empty: string; detail: (item: ApiEquipment) => string }) {
  if (items.length === 0) {
    return <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-400">{empty}</p>;
  }

  return (
    <div className="max-h-80 space-y-2 overflow-auto">
      {items.map((item) => (
        <div key={`${item.id}-${item.nome_identificacao}`} className="rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50">
          <strong className="block text-sm text-slate-900">{item.nome_identificacao}</strong>
          <span className="text-xs text-slate-500">{detail(item)}</span>
        </div>
      ))}
    </div>
  );
}
