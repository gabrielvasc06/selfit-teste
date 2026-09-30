import { EquipmentForm } from './EquipmentForm';
import type { EquipmentFormValue } from '../types';

type EditEquipmentModalProps = {
  equipmentId: number;
  formValue: EquipmentFormValue;
  unidades: string[];
  onChange: (value: EquipmentFormValue) => void;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
};

export function EditEquipmentModal({ equipmentId, formValue, unidades, onChange, onSubmit, onClose }: EditEquipmentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl animate-scale-in">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-black text-slate-950">Atualizar Equipamento</h2>
            <p className="text-sm text-slate-500">PUT /equipamentos/{equipmentId}</p>
          </div>
          <button onClick={onClose} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold transition hover:bg-slate-50">Fechar</button>
        </div>
        <EquipmentForm
          value={formValue}
          unidades={unidades}
          submitLabel="Salvar alteracoes"
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
