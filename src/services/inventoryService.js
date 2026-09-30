import api from './api';
import { normalizeUpperText } from '../utils/formatters';

export async function listUnidades() {
  const { data } = await api.get('/unidades');
  return Array.isArray(data) ? data : data?.data || data?.unidades || [];
}

export async function listEquipamentos(params = {}) {
  const { data } = await api.get('/equipamentos', { params });
  const equipamentos = Array.isArray(data) ? data : data?.data || data?.equipamentos || [];
  return equipamentos.filter((equipamento) => !equipamento.deleted_at);
}

export async function createEquipamento(payload) {
  const { data } = await api.post('/equipamentos', normalizeEquipamentoPayload(payload));
  return data;
}

export async function listManutencoes(params = {}) {
  const { data } = await api.get('/manutencoes', { params });
  return Array.isArray(data) ? data : data?.data || data?.manutencoes || [];
}

export async function createManutencao(payload) {
  const { data } = await api.post('/manutencoes', {
    equipamento_id: Number(payload.equipamento_id),
    descricao: normalizeUpperText(payload.descricao),
    data_envio: payload.data_envio,
    data_retorno: payload.data_retorno || null,
    custo: payload.custo === '' || payload.custo === null || payload.custo === undefined ? null : Number(payload.custo),
    status_manutencao: normalizeUpperText(payload.status_manutencao || 'ABERTA'),
  });
  return data;
}

function normalizeEquipamentoPayload(payload) {
  // Envie apenas os campos usados pelo fluxo de gestao de ativos.
  return {
    unidade_id: Number(payload.unidade_id),
    nome_identificacao: normalizeUpperText(payload.nome_identificacao),
    categoria: normalizeUpperText(payload.categoria),
    marca: normalizeUpperText(payload.marca),
    modelo: normalizeUpperText(payload.modelo),
    numero_serie: normalizeUpperText(payload.numero_serie),
    placa_patrimonio: normalizeUpperText(payload.placa_patrimonio),
    localizacao: normalizeUpperText(payload.localizacao),
    status: normalizeUpperText(payload.status || 'ATIVO'),
    data_garantia: payload.data_garantia,
  };
}
