import { BadgeDollarSign, CalendarClock, CheckCircle2, Plus, Search, Wrench } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Modal from '../components/ui/Modal.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { useInventory } from '../context/InventoryContext.jsx';
import { createManutencao, listEquipamentos, listManutencoes } from '../services/inventoryService.js';
import { formatCurrency, formatDate, hasRequiredText, normalizeUpperText, sanitizeUppercase } from '../utils/formatters.js';

const emptyMaintenance = {
  equipamento_id: '',
  descricao: '',
  data_envio: '',
  data_retorno: '',
  custo: '',
  status_manutencao: 'ABERTA',
};

const maintenanceStatuses = ['ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'];

function Manutencoes() {
  const { selectedUnidadeId } = useInventory();
  const [items, setItems] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [form, setForm] = useState(emptyMaintenance);

  const loadData = useCallback(async () => {
    setLoading(true);
    const params = selectedUnidadeId !== 'all' ? { unidade_id: selectedUnidadeId } : {};

    try {
      const [maintenanceData, equipmentData] = await Promise.all([listManutencoes(params), listEquipamentos(params)]);
      setItems(maintenanceData);
      setEquipamentos(equipmentData);
    } catch {
      setItems([]);
      setEquipamentos([]);
    } finally {
      setLoading(false);
    }
  }, [selectedUnidadeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toUpperCase();
    return items.filter((item) => {
      const equipment = equipamentos.find((equipamento) => equipamento.id === item.equipamento_id);
      const matchesSearch = !term || [item.descricao, equipment?.nome_identificacao, equipment?.placa_patrimonio].some((value) => String(value || '').toUpperCase().includes(term));
      const matchesStatus = !status || item.status_manutencao === status;

      return matchesSearch && matchesStatus;
    });
  }, [equipamentos, items, search, status]);

  const summary = useMemo(() => {
    const open = items.filter((item) => item.status_manutencao === 'ABERTA' || item.status_manutencao === 'EM_ANDAMENTO').length;
    const finished = items.filter((item) => item.status_manutencao === 'CONCLUIDA').length;
    const totalCost = items.reduce((sum, item) => sum + Number(item.custo || 0), 0);

    return { open, finished, totalCost };
  }, [items]);

  async function handleCreate(event) {
    event.preventDefault();

    if (!form.equipamento_id || !hasRequiredText(form.descricao) || !form.data_envio || !hasRequiredText(form.status_manutencao)) {
      toast.warning('Preencha os campos obrigatorios da manutencao.');
      return;
    }

    setSubmitting(true);
    try {
      await createManutencao(form);
      toast.success('Manutencao registrada com sucesso.');
      setForm(emptyMaintenance);
      setModalOpen(false);
      await loadData();
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.erro || 'Nao foi possivel registrar a manutencao.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-7">
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <StatCard label="Manutencoes abertas" value={summary.open} icon={Wrench} />
        <StatCard label="Concluidas" value={summary.finished} icon={CheckCircle2} accent="green" />
        <StatCard label="Custo acumulado" value={formatCurrency(summary.totalCost)} icon={BadgeDollarSign} />
      </section>

      <section className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">Manutencoes</h2>
            <p className="text-sm font-medium text-slate-500">Controle de envio, retorno, status e custos</p>
          </div>
          <button type="button" onClick={() => setModalOpen(true)} className="primary-button">
            <Plus size={18} />
            Nova Manutencao
          </button>
        </div>

        <div className="grid gap-3 border-b border-slate-200 bg-slate-50 p-5 md:grid-cols-[1fr_220px]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(sanitizeUppercase(event.target.value))}
              placeholder="Buscar por descricao, equipamento ou patrimonio"
              className="field-input pl-10 uppercase"
            />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="field-select">
            <option value="">Todos os status</option>
            {maintenanceStatuses.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div className="table-scroll overflow-x-auto">
          <table className="min-w-[980px] w-full text-left">
            <thead className="bg-white text-xs font-black uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Equipamento</th>
                <th className="px-5 py-4">Descricao</th>
                <th className="px-5 py-4">Envio</th>
                <th className="px-5 py-4">Retorno</th>
                <th className="px-5 py-4">Custo</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-sm font-bold text-slate-500">Carregando manutencoes...</td>
                </tr>
              ) : filteredItems.length ? (
                filteredItems.map((item) => {
                  const equipment = equipamentos.find((equipamento) => equipamento.id === item.equipamento_id);
                  return (
                    <tr key={item.id} className="bg-white transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-black text-slate-900">{equipment?.nome_identificacao || `Equipamento #${item.equipamento_id}`}</p>
                        <p className="text-sm font-medium text-slate-500">{equipment?.placa_patrimonio || 'Sem patrimonio'}</p>
                      </td>
                      <td className="max-w-[360px] px-5 py-4 text-sm font-medium text-slate-600">{item.descricao}</td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-700">{formatDate(item.data_envio)}</td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-700">{formatDate(item.data_retorno)}</td>
                      <td className="px-5 py-4 text-sm font-black text-slate-900">{formatCurrency(item.custo)}</td>
                      <td className="px-5 py-4">
                        <span className={`status-pill ${item.status_manutencao === 'CONCLUIDA' ? 'bg-emerald-100 text-emerald-700' : item.status_manutencao === 'CANCELADA' ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700'}`}>
                          {item.status_manutencao}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <Wrench className="mx-auto text-slate-300" size={42} />
                    <p className="mt-3 text-sm font-black text-slate-700">Nenhuma manutencao encontrada</p>
                    <p className="text-sm text-slate-500">Registre reparos, revisoes ou ajustes de equipamentos.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={modalOpen}
        title="Registrar Manutencao"
        subtitle="Vincule o chamado a um equipamento cadastrado"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" onClick={() => setModalOpen(false)} className="secondary-button">Cancelar</button>
            <button type="submit" form="maintenance-form" disabled={submitting} className="primary-button">
              {submitting ? 'Salvando...' : 'Salvar Manutencao'}
            </button>
          </>
        }
      >
        <form id="maintenance-form" onSubmit={handleCreate} className="grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="field-label">Equipamento</span>
            <select required value={form.equipamento_id} onChange={(event) => setForm((current) => ({ ...current, equipamento_id: event.target.value }))} className="field-select">
              <option value="">Selecione</option>
              {equipamentos.map((equipamento) => (
                <option key={equipamento.id} value={equipamento.id}>
                  {equipamento.nome_identificacao} - {equipamento.placa_patrimonio}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="field-label">Descricao</span>
            <textarea
              required
              value={form.descricao}
              onChange={(event) => setForm((current) => ({ ...current, descricao: sanitizeUppercase(event.target.value) }))}
              onBlur={() => setForm((current) => ({ ...current, descricao: normalizeUpperText(current.descricao) }))}
              rows={4}
              className="w-full rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold uppercase text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-selfit-red focus:ring-4 focus:ring-red-100"
            />
          </label>
          <label>
            <span className="field-label">Data de Envio</span>
            <div className="relative">
              <CalendarClock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="date" required value={form.data_envio} onChange={(event) => setForm((current) => ({ ...current, data_envio: event.target.value }))} className="field-input pl-10" />
            </div>
          </label>
          <label>
            <span className="field-label">Data de Retorno</span>
            <input type="date" value={form.data_retorno} onChange={(event) => setForm((current) => ({ ...current, data_retorno: event.target.value }))} className="field-input" />
          </label>
          <label>
            <span className="field-label">Custo</span>
            <input type="number" min="0" step="0.01" value={form.custo} onChange={(event) => setForm((current) => ({ ...current, custo: event.target.value }))} className="field-input" />
          </label>
          <label>
            <span className="field-label">Status</span>
            <select value={form.status_manutencao} onChange={(event) => setForm((current) => ({ ...current, status_manutencao: event.target.value }))} className="field-select">
              {maintenanceStatuses.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        </form>
      </Modal>
    </div>
  );
}

export default Manutencoes;
