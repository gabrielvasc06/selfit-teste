import { API_URL } from './constants';
import type { ApiEquipment, ApiListResponse, EquipmentFormValue, LoginForm, UnitForm } from './types';

async function request<T>(path: string, token: string, init: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.mensagem || data.message || `Erro ${response.status} em ${path}`);
  }

  return data as T;
}

export const selfitApi = {
  login: (input: LoginForm) => request<{ token: string }>('/auth', '', {
    method: 'POST',
    body: JSON.stringify(input),
  }),

  listEquipments: (token: string) =>
    request<ApiListResponse<ApiEquipment>>('/equipamentos/consultar?busca=%25', token),

  listWarranties: (token: string) =>
    request<ApiListResponse<ApiEquipment>>('/equipamentos/garantia', token),

  listMaintenances: (token: string) =>
    request<ApiListResponse<ApiEquipment>>('/equipamentos/manutencao', token),

  createUnit: (token: string, input: UnitForm) => request('/register/unidades', token, {
    method: 'POST',
    body: JSON.stringify(input),
  }),

  createEquipment: (token: string, input: EquipmentFormValue) => request('/register/equipamentos', token, {
    method: 'POST',
    body: JSON.stringify(input),
  }),

  updateEquipment: (token: string, id: number, input: EquipmentFormValue) => request(`/equipamentos/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify({
      ...input,
      endereco_ip: input.endereco_ip || null,
      mac_address: input.mac_address || null,
    }),
  }),

  deleteEquipment: (token: string, id: number) => request(`/equipamentos/${id}`, token, {
    method: 'DELETE',
  }),

  createUser: (token: string, input: LoginForm) => request('/register', token, {
    method: 'POST',
    body: JSON.stringify(input),
  }),
};
