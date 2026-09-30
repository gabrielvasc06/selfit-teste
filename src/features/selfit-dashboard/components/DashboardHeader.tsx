import { Database, LogOut, RefreshCw } from 'lucide-react';
import selfitLogoUrl from '@/assets/logos/selfit-logo.png';
import { API_URL } from '../constants';

type DashboardHeaderProps = {
  userName: string;
  loading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
};

export function DashboardHeader({ userName, loading, onRefresh, onLogout }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <img src={selfitLogoUrl} alt="Selfit" className="h-12 w-12 rounded-xl object-contain" />
          <div>
            <h1 className="font-display text-xl font-black text-slate-950">Painel Selfit</h1>
            <p className="text-xs font-medium text-slate-500">API {API_URL} | {userName || 'usuario logado'}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={onRefresh} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar
          </button>
          <a href={`${API_URL}/api-docs`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
            <Database className="h-4 w-4" /> Swagger
          </a>
          <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </div>
    </header>
  );
}
