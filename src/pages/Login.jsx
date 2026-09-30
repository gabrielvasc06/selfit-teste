import { Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import selfitIcon from '../assets/selfit-icon.jpeg';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  usuario: '',
  senha: '',
};

function Login() {
  const { isAuthenticated, user, loading, login, changePassword, requiresPasswordChange } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [passwordForm, setPasswordForm] = useState({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const mustChangePassword = requiresPasswordChange || showChangePassword || user?.senha_provisoria || location.state?.forcePasswordChange;
  const redirectTo = useMemo(() => location.state?.from?.pathname || '/dashboard', [location.state]);

  if (isAuthenticated && !mustChangePassword) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await login(form);

    if (result.requiresPasswordChange) {
      setPasswordForm((current) => ({ ...current, senhaAtual: form.senha }));
      setShowChangePassword(true);
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  async function handleChangePassword(event) {
    event.preventDefault();

    if (passwordForm.novaSenha.length < 8) {
      return;
    }

    if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
      return;
    }

    await changePassword(passwordForm);
    navigate(redirectTo, { replace: true });
  }

  return (
    <main className="login-grid relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <section className="relative z-10 w-full max-w-[504px] rounded-[26px] border border-[#253149] bg-[#111827]/95 px-11 py-[45px] shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur">
        <div className="flex flex-col items-center text-center">
          <img
            src={selfitIcon}
            alt="Selfit"
            className="h-[90px] w-[90px] rounded-[18px] object-cover shadow-[0_14px_32px_rgba(239,0,21,0.24)]"
          />
          <h1 className="mt-5 text-[34px] font-black leading-none tracking-[-0.02em] text-white">SELFIT</h1>
          <div className="mt-[18px] flex w-full items-center justify-center gap-3">
            <span className="h-px w-9 bg-selfit-red" />
            <p className="text-[13px] font-extrabold uppercase tracking-[0.2em] text-[#94a3b8]">Sistema de Gestao e Inventario</p>
            <span className="h-px w-9 bg-selfit-red" />
          </div>
        </div>

        {!mustChangePassword ? (
          <form className="mt-[38px] space-y-[22px]" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-[15px] font-bold text-[#cbd5e1]">Usuario Corporativo</span>
              <span className="relative block">
                <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" size={22} />
                <input
                  value={form.usuario}
                  onChange={(event) => setForm((current) => ({ ...current, usuario: event.target.value.toUpperCase() }))}
                  autoComplete="username"
                  required
                  className="h-[58px] w-full rounded-[14px] border border-red-500 bg-[#050914] pl-14 pr-4 text-base font-bold uppercase text-white outline-none transition placeholder:text-slate-600 focus:ring-4 focus:ring-red-500/15"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-[15px] font-bold text-[#cbd5e1]">Senha</span>
              <span className="relative block">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={22} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.senha}
                  onChange={(event) => setForm((current) => ({ ...current, senha: event.target.value }))}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  required
                  className="h-[58px] w-full rounded-[14px] border border-slate-700 bg-[#050914] pl-14 pr-14 text-base font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-red-500 focus:ring-4 focus:ring-red-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </span>
            </label>

            <button type="submit" disabled={loading} className="h-[60px] w-full rounded-[12px] bg-[#ed1c24] text-base font-black text-white shadow-[0_14px_30px_rgba(239,0,21,0.28)] transition hover:bg-selfit-redDark disabled:opacity-60">
              {loading ? 'Entrando...' : 'Entrar no Sistema'}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleChangePassword}>
            <div className="rounded-[8px] border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-left text-sm font-semibold text-amber-100">
              Troca de senha obrigatoria para liberar o acesso ao painel.
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-300">Senha Atual</span>
              <input
                type="password"
                value={passwordForm.senhaAtual}
                onChange={(event) => setPasswordForm((current) => ({ ...current, senhaAtual: event.target.value }))}
                required
                className="h-12 w-full rounded-[10px] border border-slate-700 bg-[#050914] px-4 text-white outline-none focus:border-red-500"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-300">Nova Senha</span>
              <input
                type="password"
                value={passwordForm.novaSenha}
                onChange={(event) => setPasswordForm((current) => ({ ...current, novaSenha: event.target.value }))}
                minLength={8}
                required
                className="h-12 w-full rounded-[10px] border border-slate-700 bg-[#050914] px-4 text-white outline-none focus:border-red-500"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-300">Confirmar Nova Senha</span>
              <input
                type="password"
                value={passwordForm.confirmarSenha}
                onChange={(event) => setPasswordForm((current) => ({ ...current, confirmarSenha: event.target.value }))}
                minLength={8}
                required
                className="h-12 w-full rounded-[10px] border border-slate-700 bg-[#050914] px-4 text-white outline-none focus:border-red-500"
              />
            </label>
            <button type="submit" disabled={loading || passwordForm.novaSenha !== passwordForm.confirmarSenha} className="h-[54px] w-full rounded-[12px] bg-selfit-red text-base font-black text-white shadow-red transition hover:bg-selfit-redDark disabled:opacity-60">
              {loading ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </form>
        )}

        <div className="mt-[27px] flex h-12 items-center justify-center gap-3 rounded-[10px] border border-[#1b2940] bg-[#081121] text-sm font-medium text-[#94a3b8]">
          <ShieldCheck size={18} className="text-emerald-400" />
          Ambiente Seguro - Selfit Holding 2026
        </div>
      </section>
    </main>
  );
}

export default Login;
