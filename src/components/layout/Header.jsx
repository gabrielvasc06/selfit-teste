import { Boxes, Grid2X2, Menu, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext.jsx';
import LogoMark from '../LogoMark.jsx';

const headerMap = {
  '/dashboard': {
    tag: 'Modulo: Gestao de Equipamentos',
    title: 'Painel Principal',
    subtitle: 'Visao geral de equipamentos',
  },
  '/equipamentos': {
    tag: 'Modulo: Gestao de Equipamentos',
    title: 'Painel de Equipamentos',
    subtitle: 'Visao geral de equipamentos',
  },
  '/manutencoes': {
    tag: 'Modulo: Gestao de Manutencoes',
    title: 'Painel de Manutencoes',
    subtitle: 'Acompanhamento de reparos e custos',
  },
  '/garantias': {
    tag: 'Modulo: Gestao de Garantias',
    title: 'Garantias',
    subtitle: 'Equipamentos proximos ao vencimento',
  },
};

function Header() {
  const location = useLocation();
  const { unidades, selectedUnidadeId, setSelectedUnidadeId, loadingUnidades } = useInventory();
  const meta = headerMap[location.pathname] || headerMap['/dashboard'];

  return (
    <header className="sticky top-0 z-20 border-b border-[#dbe3ef] bg-white/95 backdrop-blur">
      <div className="flex min-h-[120px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-9">
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <LogoMark size="sm" icon={Boxes} label={false} />
          </div>
          <div>
            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-[13px] font-extrabold text-red-700">{meta.tag}</span>
            <h1 className="mt-2 text-[23px] font-black leading-[1.05] tracking-[-0.015em] text-slate-900">{meta.title}</h1>
            <p className="mt-1 text-base font-medium text-[#64748b]">{meta.subtitle}</p>
          </div>
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={selectedUnidadeId}
              onChange={(event) => setSelectedUnidadeId(event.target.value)}
              disabled={loadingUnidades}
              className="h-10 min-w-[260px] rounded-[8px] border border-[#dbe3ef] bg-white pl-10 pr-4 text-sm font-bold text-slate-700 shadow-sm outline-none focus:border-selfit-red focus:ring-4 focus:ring-red-100"
            >
              <option value="all">Todas as unidades</option>
              {unidades.map((unidade) => (
                <option key={unidade.id} value={unidade.id}>
                  {unidade.nome}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="secondary-button">
            <Grid2X2 size={18} />
            Trocar Modulo
          </button>
        </div>

        <button type="button" className="icon-button lg:hidden" aria-label="Abrir menu">
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}

export default Header;
