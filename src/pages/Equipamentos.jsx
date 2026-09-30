import { Boxes, Building2, CalendarClock, Filter, Plus, Search, ShieldAlert, Trash2, Wrench } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Modal from '../components/ui/Modal.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { useInventory } from '../context/InventoryContext.jsx';
import { createEquipamento, listEquipamentos } from '../services/inventoryService.js';
import { getWarrantyState, hasRequiredText, normalizeUpperText, sanitizeUppercase } from '../utils/formatters.js';

const emptyEquipment = {
  unidade_id: '',
  nome_identificacao: '',
  categoria: '',
  marca: '',
  modelo: '',
  numero_serie: '',
  placa_patrimonio: '',
  localizacao: '',
  status: 'ATIVO',
  data_garantia: '',
};

const statusOptions = ['ATIVO', 'MANUTENCAO', 'INATIVO', 'BAIXADO'];
const categoryOptions = ['CARDIO', 'MUSCULACAO', 'CLIMATIZACAO', 'TI', 'CFTV', 'ELETRICO', 'HIDRAULICO'];
const requiredEquipmentTextFields = [
  'nome_identificacao',
  'categoria',
  'marca',
  'modelo',
  'numero_serie',
  'placa_patrimonio',
  'localizacao',
  'status',
];

function Equipamentos({ initialFilter = '' }) {
  const { unidades, selectedUnidadeId, unidadeCount } = useInventory();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', categoria: '', garantia: initialFilter });
  const [form, setForm] = useState(emptyEquipment);

  const loadEquipamentos = useCallback(async () => {
    setLoading(true);
    try {
      const params = selectedUnidadeId !== 'all' ? { unidade_id: selectedUnidadeId } : {};
      setItems(await listEquipamentos(params));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedUnidadeId]);

  useEffect(() => {
    loadEquipamentos();
  }, [loadEquipamentos]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const search = filters.search.trim().toUpperCase();
      const warranty = getWarrantyState(item.data_garantia);
      const matchesSearch = !search || [item.nome_identificacao, item.numero_serie, item.placa_patrimonio, item.localizacao].some((value) => String(value || '').toUpperCase().includes(search));
      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesCategory = !filters.categoria || item.categoria === filters.categoria;
      const matchesWarranty = filters.garantia !== 'GARANTIA' || warranty.tone !== 'green';

      return matchesSearch && matchesStatus && matchesCategory && matchesWarranty;
    });
  }, [filters, items]);

  const summary = useMemo(() => {
    return {
      total: items.length,
      active: items.filter((item) => item.status === 'ATIVO').length,
      maintenance: items.filter((item) => item.status === 'MANUTENCAO').length,
      warranty: items.filter((item) => getWarrantyState(item.data_garantia).tone !== 'green').length,
    };
  }, [items]);

  function handleUpperField(field, value) {
    setForm((current) => ({ ...current, [field]: sanitizeUppercase(value) }));
  }

  async function handleCreate(event) {
    event.preventDefault();

    const hasInvalidText = requiredEquipmentTextFields.some((field) => !hasRequiredText(form[field]));

    if (!form.unidade_id || hasInvalidText || !form.data_garantia) {
      toast.warning('Preencha todos os campos obrigatorios respeitando o contrato do banco.');
      return;
    }

    setSubmitting(true);
    try {
      await createEquipamento(form);
      toast.success('Equipamento cadastrado com sucesso.');
      setForm(emptyEquipment);
      setModalOpen(false);
      await loadEquipamentos();
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.erro || 'Nao foi possivel cadastrar o equipamento.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-7">
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        <StatCard label="Equipamentos" value={`${summary.total} cadastrados`} icon={Boxes} />
        <StatCard label="Unidades" value={`${unidadeCount} cadastradas`} icon={Building2} accent="green" />
        <StatCard label="Em manutencao" value={summary.maintenance} icon={Wrench} />
        <StatCard label="Alertas de garantia" value={summary.warranty} icon={ShieldAlert} />
      </section>

      <section className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">Equipamentos</h2>
            <p className="text-sm font-medium text-slate-500">Inventario com filtros por status, categoria e garantia</p>
          </div>
          <button type="button" onClick={() => setModalOpen(true)} className="primary-button">
            <Plus size={18} />
            Novo Equipamento
          </button>
        </div>

        <div className="grid gap-3 border-b border-slate-200 bg-slate-50 p-5 md:grid-cols-4">
          <label className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: sanitizeUppercase(event.target.value) }))}
              placeholder="Buscar por patrimonio, serie, nome ou local"
              className="field-input pl-10 uppercase"
            />
          </label>
          <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="field-select">
            <option value="">Todos os status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select value={filters.categoria} onChange={(event) => setFilters((current) => ({ ...current, categoria: event.target.value }))} className="field-select">
            <option value="">Todas as categorias</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setFilters((current) => ({ ...current, garantia: current.garantia ? '' : 'GARANTIA' }))}
            className={`secondary-button md:col-span-4 xl:col-span-1 ${filters.garantia ? 'border-amber-300 bg-amber-50 text-amber-800' : ''}`}
          >
            <Filter size={18} />
            Alertas de Garantia
          </button>
        </div>

        <div className="table-scroll overflow-x-auto">
          <table className="min-w-[1050px] w-full text-left">
            <thead className="bg-white text-xs font-black uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Equipamento</th>
                <th className="px-5 py-4">Categoria</th>
                <th className="px-5 py-4">Patrimonio</th>
                <th className="px-5 py-4">Serie</th>
                <th className="px-5 py-4">Localizacao</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Garantia</th>
                <th className="px-5 py-4 text-right">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-10 text-center text-sm font-bold text-slate-500">
                    Carregando equipamentos...
                  </td>
                </tr>
              ) : filteredItems.length ? (
                filteredItems.map((item) => {
                  const warranty = getWarrantyState(item.data_garantia);
                  return (
                    <tr key={item.id} className="bg-white transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-black text-slate-900">{item.nome_identificacao}</p>
                        <p className="text-sm font-medium text-slate-500">{item.marca} {item.modelo}</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-700">{item.categoria}</td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-700">{item.placa_patrimonio}</td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-700">{item.numero_serie}</td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-600">{item.localizacao}</td>
                      <td className="px-5 py-4">
                        <span className={`status-pill ${item.status === 'ATIVO' ? 'bg-emerald-100 text-emerald-700' : item.status === 'MANUTENCAO' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`status-pill ${warranty.className}`}>{warranty.label}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button type="button" className="icon-button" aria-label="Excluir equipamento">
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center">
                    <Boxes className="mx-auto text-slate-300" size={42} />
                    <p className="mt-3 text-sm font-black text-slate-700">Nenhum equipamento encontrado</p>
                    <p className="text-sm text-slate-500">Cadastre o primeiro ativo ou ajuste os filtros.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={modalOpen}
        title="Cadastrar Equipamento"
        subtitle="Campos criticos sao convertidos automaticamente para maiusculas"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" onClick={() => setModalOpen(false)} className="secondary-button">Cancelar</button>
            <button type="submit" form="equipment-form" disabled={submitting} className="primary-button">
              {submitting ? 'Salvando...' : 'Salvar Equipamento'}
            </button>
          </>
        }
      >
        <form id="equipment-form" onSubmit={handleCreate} className="grid gap-5 md:grid-cols-2">
          <label>
            <span className="field-label">Unidade</span>
            <select required value={form.unidade_id} onChange={(event) => setForm((current) => ({ ...current, unidade_id: event.target.value }))} className="field-select">
              <option value="">Selecione</option>
              {unidades.map((unidade) => (
                <option key={unidade.id} value={unidade.id}>
                  {unidade.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="field-label">Nome de Identificacao</span>
            <input required value={form.nome_identificacao} onChange={(event) => handleUpperField('nome_identificacao', event.target.value)} onBlur={() => handleUpperField('nome_identificacao', normalizeUpperText(form.nome_identificacao))} className="field-input uppercase" />
          </label>
          <label>
            <span className="field-label">Categoria</span>
            <input list="categorias" required value={form.categoria} onChange={(event) => handleUpperField('categoria', event.target.value)} onBlur={() => handleUpperField('categoria', normalizeUpperText(form.categoria))} className="field-input uppercase" />
            <datalist id="categorias">
              {categoryOptions.map((category) => <option key={category} value={category} />)}
            </datalist>
          </label>
          <label>
            <span className="field-label">Status</span>
            <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="field-select">
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label>
            <span className="field-label">Marca</span>
            <input required value={form.marca} onChange={(event) => handleUpperField('marca', event.target.value)} onBlur={() => handleUpperField('marca', normalizeUpperText(form.marca))} className="field-input uppercase" />
          </label>
          <label>
            <span className="field-label">Modelo</span>
            <input required value={form.modelo} onChange={(event) => handleUpperField('modelo', event.target.value)} onBlur={() => handleUpperField('modelo', normalizeUpperText(form.modelo))} className="field-input uppercase" />
          </label>
          <label>
            <span className="field-label">Numero de Serie</span>
            <input required value={form.numero_serie} onChange={(event) => handleUpperField('numero_serie', event.target.value)} onBlur={() => handleUpperField('numero_serie', normalizeUpperText(form.numero_serie))} className="field-input uppercase" />
          </label>
          <label>
            <span className="field-label">Placa Patrimonio</span>
            <input required value={form.placa_patrimonio} onChange={(event) => handleUpperField('placa_patrimonio', event.target.value)} onBlur={() => handleUpperField('placa_patrimonio', normalizeUpperText(form.placa_patrimonio))} className="field-input uppercase" />
          </label>
          <label>
            <span className="field-label">Localizacao</span>
            <input required value={form.localizacao} onChange={(event) => handleUpperField('localizacao', event.target.value)} onBlur={() => handleUpperField('localizacao', normalizeUpperText(form.localizacao))} className="field-input uppercase" />
          </label>
          <label>
            <span className="field-label">Data de Garantia</span>
            <div className="relative">
              <CalendarClock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="date" required value={form.data_garantia} onChange={(event) => setForm((current) => ({ ...current, data_garantia: event.target.value }))} className="field-input pl-10" />
            </div>
          </label>
        </form>
      </Modal>
    </div>
  );
}

export default Equipamentos;
