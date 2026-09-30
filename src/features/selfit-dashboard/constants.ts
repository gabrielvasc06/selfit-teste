import type { EquipmentFormValue, UnitForm } from './types';

export const API_URL = (import.meta.env.VITE_SELFIT_API_URL || 'http://localhost:3001').replace(/\/$/, '');

export const TOKEN_KEY = 'selfit.authToken';
export const USER_KEY = 'selfit.userName';

export const equipmentCategories = [
  'TV',
  'CAMERAS',
  'INFORMATICA',
  'TOTEM',
  'CATRACA',
  'LEITOR FACIAL',
  'ACCESS POINT',
  'IMPRESSORA',
  'SWITCH',
  'FIREWALL',
  'ROTEADOR',
  'NOBREAK',
];

export const equipmentStatuses = ['ATIVO', 'EM MANUTENCAO', 'INATIVO', 'OUTROS'];

export const fieldClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/15';

export const emptyUnitForm: UnitForm = {
  nome: '',
  cnpj: '',
  cep: '',
  uf: '',
  bairro: '',
  rua: '',
  numero: '',
};

export const emptyEquipmentForm: EquipmentFormValue = {
  unidade_nome: '',
  nome_identificacao: '',
  categoria: 'INFORMATICA',
  marca: '',
  modelo: '',
  numero_serie: '',
  placa_patrimonio: '',
  localizacao: '',
  status: 'ATIVO',
  data_garantia: '',
  endereco_ip: '',
  mac_address: '',
};
