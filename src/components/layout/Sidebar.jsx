import {
  Boxes,
  Building2,
  Grid2X2,
  LogOut,
  MapPin,
  PlusCircle,
  Search,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LogoMark from '../LogoMark.jsx';

const navigation = [
  {
    label: 'VISAO GERAL',
    items: [{ to: '/dashboard', label: 'Painel Principal', icon: Grid2X2 }],
  },
  {
    label: 'CONSULTAS',
    items: [
      { to: '/unidades', label: 'Consultar Unidades', icon: Search },
      { to: '/regioes', label: 'Por Regiao', icon: MapPin },
    ],
  },
  {
    label: 'CADASTROS',
    items: [{ to: '/equipamentos', label: 'Cadastrar Equipamento', icon: PlusCircle }],
  },
  {
    label: 'GESTAO',
    items: [
      { to: '/garantias', label: 'Garantias', icon: ShieldCheck },
      { to: '/manutencoes', label: 'Manutencoes', icon: Wrench },
    ],
  },
];

function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const inEquipamentos = ['/equipamentos', '/garantias', '/manutencoes'].some((path) => location.pathname.startsWith(path));

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside className="sidebar-gradient fixed inset-y-0 left-0 z-30 hidden w-[315px] flex-col border-r border-white/10 lg:flex">
      <div className="border-b border-white/10 px-5 py-6">
        <LogoMark icon={Boxes} panelLabel={inEquipamentos ? 'PAINEL EQUIPAMENTOS' : 'PAINEL ATIVOS'} />
        <p className="mt-4 text-[13px] font-medium text-[#86a0c3]">Gestao de Inventario v2.0</p>
      </div>

      <nav className="flex-1 space-y-[18px] overflow-y-auto px-3 py-[19px]">
        {navigation.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#536683]">{group.label}</p>
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'group relative flex h-12 items-center gap-3 rounded-[8px] px-4 text-sm font-extrabold transition',
                      isActive
                        ? 'bg-[#ed0016] text-white shadow-[0_14px_28px_rgba(237,0,22,0.28)]'
                        : 'text-[#dbeafe] hover:bg-white/[0.07] hover:text-white',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={24} strokeWidth={2.25} className={isActive ? 'text-white' : 'text-[#8ea1bf] group-hover:text-white'} />
                      <span>{item.label}</span>
                      {isActive ? <span className="ml-auto h-2 w-2 rounded-full bg-white" /> : null}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-[8px] bg-white/[0.07] p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-selfit-red text-lg font-black text-white">
            {(user?.nome || user?.usuario || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">{user?.nome || user?.usuario || 'USUARIO'}</p>
            <p className="text-sm text-[#93c5fd]">{user?.perfil || 'Administrador'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-11 items-center gap-3 rounded-[8px] px-3 text-sm font-extrabold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={22} />
          Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
