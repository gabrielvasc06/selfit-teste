import { Database } from 'lucide-react';
import { equipmentCategories, equipmentStatuses, fieldClass } from '../constants';
import type { EquipmentFormValue } from '../types';
import { Field } from './Field';

type EquipmentFormProps = {
  value: EquipmentFormValue;
  unidades: string[];
  submitLabel?: string;
  onChange: (value: EquipmentFormValue) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export function EquipmentForm({
  value,
  unidades,
  submitLabel = 'Cadastrar equipamento',
  onChange,
  onSubmit,
}: EquipmentFormProps) {
  const update = (key: keyof EquipmentFormValue, next: string) => onChange({ ...value, [key]: next });

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block space-y-1 sm:col-span-2">
        <span className="text-xs font-bold uppercase text-slate-500">Unidade</span>
        <input
          list="unidades-list"
          required
          value={value.unidade_nome}
          onChange={(event) => update('unidade_nome', event.target.value)}
          className={fieldClass}
          placeholder="Nome exato da unidade cadastrada"
        />
        <datalist id="unidades-list">{unidades.map((unidade) => <option key={unidade} value={unidade} />)}</datalist>
      </label>

      <Field label="Nome / Identificacao" value={value.nome_identificacao} onChange={(next) => update('nome_identificacao', next)} required />

      <label className="block space-y-1">
        <span className="text-xs font-bold uppercase text-slate-500">Categoria</span>
        <select required value={value.categoria} onChange={(event) => update('categoria', event.target.value)} className={fieldClass}>
          {equipmentCategories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </label>

      <Field label="Marca" value={value.marca} onChange={(next) => update('marca', next)} required />
      <Field label="Modelo" value={value.modelo} onChange={(next) => update('modelo', next)} required />
      <Field label="Numero de Serie" value={value.numero_serie} onChange={(next) => update('numero_serie', next)} required />
      <Field label="Placa Patrimonio" value={value.placa_patrimonio} onChange={(next) => update('placa_patrimonio', next)} required />
      <Field label="Localizacao" value={value.localizacao} onChange={(next) => update('localizacao', next)} required />

      <label className="block space-y-1">
        <span className="text-xs font-bold uppercase text-slate-500">Status</span>
        <select value={value.status} onChange={(event) => update('status', event.target.value)} className={fieldClass}>
          {equipmentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </label>

      <Field label="Data Garantia" type="date" value={value.data_garantia} onChange={(next) => update('data_garantia', next)} required />
      <Field label="Endereco IP" value={value.endereco_ip} onChange={(next) => update('endereco_ip', next)} />
      <Field label="MAC Address" value={value.mac_address} onChange={(next) => update('mac_address', next)} />

      <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 sm:col-span-2">
        <Database className="h-4 w-4" /> {submitLabel}
      </button>
    </form>
  );
}
