import { Database, Plus, Search, ShieldCheck, UserPlus, Wrench } from 'lucide-react';
import { CompactList } from '@/features/selfit-dashboard/components/CompactList';
import { DashboardHeader } from '@/features/selfit-dashboard/components/DashboardHeader';
import { EditEquipmentModal } from '@/features/selfit-dashboard/components/EditEquipmentModal';
import { EquipmentForm } from '@/features/selfit-dashboard/components/EquipmentForm';
import { EquipmentTable } from '@/features/selfit-dashboard/components/EquipmentTable';
import { Field } from '@/features/selfit-dashboard/components/Field';
import { LoginView } from '@/features/selfit-dashboard/components/LoginView';
import { MetricsGrid } from '@/features/selfit-dashboard/components/Metric';
import { Panel } from '@/features/selfit-dashboard/components/Panel';
import { Toast } from '@/features/selfit-dashboard/components/Toast';
import { equipmentCategories, fieldClass } from '@/features/selfit-dashboard/constants';
import { equipmentFormFromEquipment, useSelfitDashboard } from '@/features/selfit-dashboard/useSelfitDashboard';
import { formatDate, onlyDigits } from '@/features/selfit-dashboard/utils';

export default function App() {
  const dashboard = useSelfitDashboard();

  if (!dashboard.token) {
    return (
      <LoginView
        login={dashboard.login}
        loading={dashboard.loading}
        toast={dashboard.toast}
        setLogin={dashboard.setLogin}
        onSubmit={dashboard.handleLogin}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <DashboardHeader
        userName={dashboard.userName}
        loading={dashboard.loading}
        onRefresh={dashboard.refreshAll}
        onLogout={dashboard.handleLogout}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-6">
        {dashboard.toast && <Toast toast={dashboard.toast} />}

        <MetricsGrid stats={dashboard.stats} />

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel title="Consultar e Gerenciar Equipamentos" icon={<Search className="h-5 w-5" />}>
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_14rem]">
              <input
                value={dashboard.search}
                onChange={(event) => dashboard.setSearch(event.target.value)}
                placeholder="Buscar por unidade, patrimonio, serie, nome..."
                className={fieldClass}
              />
              <select value={dashboard.categoryFilter} onChange={(event) => dashboard.setCategoryFilter(event.target.value)} className={fieldClass}>
                <option value="TODAS">Todas categorias</option>
                {equipmentCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <EquipmentTable
              equipments={dashboard.visibleEquipments}
              onEdit={dashboard.setEditing}
              onDelete={dashboard.deleteEquipment}
            />
          </Panel>

          <div className="space-y-6">
            <Panel title="Cadastrar Unidade" icon={<Plus className="h-5 w-5" />}>
              <form onSubmit={dashboard.createUnit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Nome" value={dashboard.unitForm.nome} onChange={(value) => dashboard.setUnitForm((current) => ({ ...current, nome: value }))} required />
                <Field label="CNPJ" value={dashboard.unitForm.cnpj} onChange={(value) => dashboard.setUnitForm((current) => ({ ...current, cnpj: onlyDigits(value) }))} required placeholder="14 digitos" />
                <Field label="CEP" value={dashboard.unitForm.cep} onChange={(value) => dashboard.setUnitForm((current) => ({ ...current, cep: onlyDigits(value) }))} required placeholder="8 digitos" />
                <Field label="UF" value={dashboard.unitForm.uf} onChange={(value) => dashboard.setUnitForm((current) => ({ ...current, uf: value.toUpperCase().slice(0, 2) }))} required />
                <Field label="Bairro" value={dashboard.unitForm.bairro} onChange={(value) => dashboard.setUnitForm((current) => ({ ...current, bairro: value }))} required />
                <Field label="Rua" value={dashboard.unitForm.rua} onChange={(value) => dashboard.setUnitForm((current) => ({ ...current, rua: value }))} required />
                <div className="sm:col-span-2">
                  <Field label="Numero" value={dashboard.unitForm.numero} onChange={(value) => dashboard.setUnitForm((current) => ({ ...current, numero: value }))} required />
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 sm:col-span-2">
                  <Plus className="h-4 w-4" /> Cadastrar unidade
                </button>
              </form>
            </Panel>

            <Panel title="Cadastrar Equipamento" icon={<Database className="h-5 w-5" />}>
              <EquipmentForm
                value={dashboard.equipmentForm}
                unidades={dashboard.unidades}
                onChange={dashboard.setEquipmentForm}
                onSubmit={dashboard.createEquipment}
              />
            </Panel>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Panel title="Garantias" icon={<ShieldCheck className="h-5 w-5" />}>
            <CompactList
              items={dashboard.warranties}
              empty="Nenhuma garantia vigente retornada."
              detail={(item) => `${formatDate(item.data_garantia)} | ${item.unidade_nome}`}
            />
          </Panel>
          <Panel title="Manutencoes Abertas" icon={<Wrench className="h-5 w-5" />}>
            <CompactList
              items={dashboard.maintenances}
              empty="Nenhuma manutencao aberta retornada."
              detail={(item) => `${item.descricao_manutencao || 'Sem descricao'} | ${item.unidade_nome}`}
            />
          </Panel>
          <Panel title="Cadastrar Usuario" icon={<UserPlus className="h-5 w-5" />}>
            <form onSubmit={dashboard.createUser} className="space-y-3">
              <Field label="Usuario" value={dashboard.registerUser.usuario} onChange={(value) => dashboard.setRegisterUser((current) => ({ ...current, usuario: value }))} required />
              <Field label="Senha" type="password" value={dashboard.registerUser.senha} onChange={(value) => dashboard.setRegisterUser((current) => ({ ...current, senha: value }))} required />
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
                <UserPlus className="h-4 w-4" /> Cadastrar usuario
              </button>
            </form>
          </Panel>
        </section>
      </div>

      {dashboard.editing && (
        <EditEquipmentModal
          equipmentId={dashboard.editing.id}
          formValue={equipmentFormFromEquipment(dashboard.editing)}
          unidades={dashboard.unidades}
          onChange={(value) => dashboard.setEditing((current) => current ? { ...current, ...value } : current)}
          onSubmit={dashboard.updateEquipment}
          onClose={() => dashboard.setEditing(null)}
        />
      )}
    </main>
  );
}
