export type ApiEquipment = {
  id: number;
  unidade_nome: string;
  nome_identificacao: string;
  categoria: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  placa_patrimonio: string;
  localizacao: string;
  status: string;
  data_garantia: string;
  endereco_ip?: string | null;
  mac_address?: string | null;
  descricao_manutencao?: string;
  data_envio?: string;
};

export type ApiListResponse<T> = {
  sucesso: boolean;
  total?: number;
  dados?: T[];
  mensagem?: string;
  message?: string;
};

export type LoginForm = {
  usuario: string;
  senha: string;
};

export type UnitForm = {
  nome: string;
  cnpj: string;
  cep: string;
  uf: string;
  bairro: string;
  rua: string;
  numero: string;
};

export type EquipmentFormValue = {
  unidade_nome: string;
  nome_identificacao: string;
  categoria: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  placa_patrimonio: string;
  localizacao: string;
  status: string;
  data_garantia: string;
  endereco_ip: string;
  mac_address: string;
};

export type ToastMessage = {
  type: 'success' | 'error';
  text: string;
} | null;

export type DashboardStats = {
  total: number;
  ativas: number;
  manutencao: number;
  garantias: number;
};
