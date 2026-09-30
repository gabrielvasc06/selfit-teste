import type { ReactNode } from 'react';

export function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-fade-in-up">
      <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">{icon}</div>
        <h2 className="font-display text-lg font-black text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}
