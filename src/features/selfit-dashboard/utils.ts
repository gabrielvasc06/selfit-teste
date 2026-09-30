import type { ApiEquipment } from './types';

export function getError(error: unknown) {
  return error instanceof Error ? error.message : 'Erro inesperado.';
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function normalizeDate(value?: string | null) {
  if (!value) return '';
  return value.slice(0, 10);
}

export function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-BR');
}

export function getUnitNames(equipments: ApiEquipment[]) {
  const byName = new Map<string, string>();
  equipments.forEach((item) => {
    if (item.unidade_nome) byName.set(item.unidade_nome, item.unidade_nome);
  });
  return [...byName.values()].sort((a, b) => a.localeCompare(b));
}

export function filterEquipments(equipments: ApiEquipment[], search: string, categoryFilter: string) {
  const term = search.trim().toUpperCase();

  return equipments.filter((item) => {
    const matchesCategory = categoryFilter === 'TODAS' || item.categoria === categoryFilter;
    const matchesSearch = !term || [
      item.unidade_nome,
      item.nome_identificacao,
      item.categoria,
      item.marca,
      item.modelo,
      item.numero_serie,
      item.placa_patrimonio,
      item.localizacao,
      item.status,
    ].some((value) => String(value || '').toUpperCase().includes(term));

    return matchesCategory && matchesSearch;
  });
}

export function getStats(equipments: ApiEquipment[], warranties: ApiEquipment[]) {
  return {
    total: equipments.length,
    ativas: equipments.filter((item) => item.status === 'ATIVO').length,
    manutencao: equipments.filter((item) => item.status.includes('MANUT')).length,
    garantias: warranties.length,
  };
}
