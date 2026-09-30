import { Loader2, ShieldCheck } from 'lucide-react';
import selfitLogoUrl from '@/assets/logos/selfit-logo.png';
import type { LoginForm, ToastMessage } from '../types';
import { Field } from './Field';
import { Toast } from './Toast';

type LoginViewProps = {
  login: LoginForm;
  loading: boolean;
  toast: ToastMessage;
  setLogin: React.Dispatch<React.SetStateAction<LoginForm>>;
  onSubmit: (event: React.FormEvent) => void;
};

export function LoginView({ login, loading, toast, setLogin, onSubmit }: LoginViewProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      <form onSubmit={onSubmit} className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={selfitLogoUrl} alt="Selfit" className="mb-4 h-20 w-20 rounded-2xl object-contain shadow-lg shadow-red-600/20" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white">SELFIT</h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Interface unica integrada ao Swagger</p>
        </div>

        {toast && <Toast toast={toast} />}

        <div className="space-y-4">
          <Field label="Usuario" value={login.usuario} onChange={(value) => setLogin((current) => ({ ...current, usuario: value }))} placeholder="VANDERSON.GABRIEL" />
          <Field label="Senha" type="password" value={login.senha} onChange={(value) => setLogin((current) => ({ ...current, senha: value }))} placeholder="Selfit@2026" />
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Entrar no Sistema
          </button>
        </div>
      </form>
    </main>
  );
}
