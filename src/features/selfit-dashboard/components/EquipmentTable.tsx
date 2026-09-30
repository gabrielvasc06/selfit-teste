import { Pencil, Trash2 } from 'lucide-react';
import type { ApiEquipment } from '../types';
import { StatusBadge } from './StatusBadge';

type EquipmentTableProps = {
  equipments: ApiEquipment[];
  onEdit: (item: ApiEquipment) => void;
  onDelete: (id: number) => void;
};

export function EquipmentTable({ equipments, onEdit, onDelete }: EquipmentTableProps) {
  return (
    <div className="max-h-[36rem] overflow-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Equipamento</th>
            <th className="px-4 py-3">Unidade</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Serie / Patrimonio</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Acoes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {equipments.length === 0 ? (
            <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">Nenhum equipamento encontrado.</td></tr>
          ) : equipments.map((item) => (
            <tr key={item.id} className="transition hover:bg-slate-50">
              <td className="px-4 py-3">
                <strong className="block text-slate-900">{item.nome_identificacao}</strong>
                <span className="text-xs text-slate-500">{item.marca} {item.modelo} | {item.localizacao}</span>
              </td>
              <td className="px-4 py-3">{item.unidade_nome}</td>
              <td className="px-4 py-3">{item.categoria}</td>
              <td className="px-4 py-3 text-xs">{item.numero_serie}<br />{item.placa_patrimonio}</td>
              <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(item)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-white" title="Editar"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => onDelete(item.id)} className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50" title="Excluir"><Trash2 className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
