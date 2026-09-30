import { Boxes, Building2, PackageCheck, ShieldAlert, Wrench } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import InventoryDonut from '../components/ui/InventoryDonut.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import StatusBand from '../components/ui/StatusBand.jsx';
import { useInventory } from '../context/InventoryContext.jsx';
import { listEquipamentos, listManutencoes } from '../services/inventoryService.js';
import { calculatePercent, getWarrantyState } from '../utils/formatters.js';

function Dashboard() {
  const { selectedUnidadeId, unidadeCount } = useInventory();
  const [equipamentos, setEquipamentos] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);

  useEffect(() => {
    let mounted = true;
    const params = selectedUnidadeId !== 'all' ? { unidade_id: selectedUnidadeId } : {};

    Promise.allSettled([listEquipamentos(params), listManutencoes(params)]).then(([equipmentResult, maintenanceResult]) => {
      if (!mounted) return;
      setEquipamentos(equipmentResult.status === 'fulfilled' ? equipmentResult.value : []);
      setManutencoes(maintenanceResult.status === 'fulfilled' ? maintenanceResult.value : []);
    });

    return () => {
      mounted = false;
    };
  }, [selectedUnidadeId]);

  const summary = useMemo(() => {
    const total = equipamentos.length;
    const active = equipamentos.filter((item) => item.status === 'ATIVO').length;
    const inMaintenance = equipamentos.filter((item) => item.status === 'MANUTENCAO').length;
    const other = Math.max(total - active - inMaintenance, 0);
    const warrantyAlert = equipamentos.filter((item) => getWarrantyState(item.data_garantia).tone !== 'green').length;
    const openMaintenance = manutencoes.filter((item) => item.status_manutencao === 'ABERTA').length;

    return { total, active, inMaintenance, other, warrantyAlert, openMaintenance };
  }, [equipamentos, manutencoes]);

  return (
    <div className="space-y-7">
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <StatCard label="Equipamentos" value={`${summary.total} cadastrados`} icon={Boxes} />
        <StatCard label="Unidades" value={`${unidadeCount} cadastradas`} icon={Building2} accent="green" />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[395px_1fr]">
        <InventoryDonut total={summary.total} label="Equipamentos" />
        <div className="space-y-3.5">
          <StatusBand
            icon={PackageCheck}
            title="Em operacao"
            subtitle="Funcionando normalmente"
            value={summary.active}
            percent={calculatePercent(summary.active, summary.total)}
            tone="green"
          />
          <StatusBand
            icon={Wrench}
            title="Em Manutencao"
            subtitle="Em reparo ou acompanhamento"
            value={summary.inMaintenance + summary.openMaintenance}
            percent={calculatePercent(summary.inMaintenance + summary.openMaintenance, summary.total)}
            tone="red"
          />
          <StatusBand
            icon={ShieldAlert}
            title="Outros"
            subtitle={summary.warrantyAlert ? 'Garantias vencidas ou proximas' : 'Inativos ou em outra situacao'}
            value={summary.other + summary.warrantyAlert}
            percent={calculatePercent(summary.other + summary.warrantyAlert, summary.total)}
            tone="amber"
          />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
