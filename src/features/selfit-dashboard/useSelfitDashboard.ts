import { useCallback, useEffect, useMemo, useState } from 'react';
import { selfitApi } from './api';
import { emptyEquipmentForm, emptyUnitForm, TOKEN_KEY, USER_KEY } from './constants';
import type { ApiEquipment, EquipmentFormValue, LoginForm, ToastMessage } from './types';
import { filterEquipments, getError, getStats, getUnitNames, normalizeDate } from './utils';

export function useSelfitDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [userName, setUserName] = useState(() => localStorage.getItem(USER_KEY) || '');
  const [login, setLogin] = useState<LoginForm>({ usuario: '', senha: '' });
  const [equipments, setEquipments] = useState<ApiEquipment[]>([]);
  const [warranties, setWarranties] = useState<ApiEquipment[]>([]);
  const [maintenances, setMaintenances] = useState<ApiEquipment[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('TODAS');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage>(null);
  const [unitForm, setUnitForm] = useState(emptyUnitForm);
  const [equipmentForm, setEquipmentForm] = useState(emptyEquipmentForm);
  const [editing, setEditing] = useState<ApiEquipment | null>(null);
  const [registerUser, setRegisterUser] = useState<LoginForm>({ usuario: '', senha: '' });

  const unidades = useMemo(() => getUnitNames(equipments), [equipments]);
  const visibleEquipments = useMemo(
    () => filterEquipments(equipments, search, categoryFilter),
    [categoryFilter, equipments, search],
  );
  const stats = useMemo(() => getStats(equipments, warranties), [equipments, warranties]);

  const notify = useCallback((type: NonNullable<ToastMessage>['type'], text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 4500);
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [all, warranty, maintenance] = await Promise.all([
        selfitApi.listEquipments(token),
        selfitApi.listWarranties(token),
        selfitApi.listMaintenances(token),
      ]);
      setEquipments(all.dados || []);
      setWarranties(warranty.dados || []);
      setMaintenances(maintenance.dados || []);
    } catch (error) {
      notify('error', getError(error));
    } finally {
      setLoading(false);
    }
  }, [notify, token]);

  useEffect(() => {
    if (token) void refreshAll();
  }, [refreshAll, token]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await selfitApi.login(login);
      const cleanUser = login.usuario.trim().toUpperCase();
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, cleanUser);
      setToken(data.token);
      setUserName(cleanUser);
      notify('success', 'Login realizado com sucesso.');
    } catch (error) {
      notify('error', getError(error));
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken('');
    setUserName('');
    setEquipments([]);
    setWarranties([]);
    setMaintenances([]);
  }

  async function createUnit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await selfitApi.createUnit(token, unitForm);
      notify('success', 'Unidade cadastrada no backend.');
      setUnitForm(emptyUnitForm);
    } catch (error) {
      notify('error', getError(error));
    }
  }

  async function createEquipment(event: React.FormEvent) {
    event.preventDefault();
    try {
      await selfitApi.createEquipment(token, equipmentForm);
      notify('success', 'Equipamento cadastrado no backend.');
      setEquipmentForm(emptyEquipmentForm);
      await refreshAll();
    } catch (error) {
      notify('error', getError(error));
    }
  }

  async function updateEquipment(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;

    try {
      await selfitApi.updateEquipment(token, editing.id, equipmentFormFromEquipment(editing));
      setEditing(null);
      notify('success', 'Equipamento atualizado.');
      await refreshAll();
    } catch (error) {
      notify('error', getError(error));
    }
  }

  async function deleteEquipment(id: number) {
    if (!window.confirm('Excluir este equipamento?')) return;

    try {
      await selfitApi.deleteEquipment(token, id);
      notify('success', 'Equipamento excluido.');
      await refreshAll();
    } catch (error) {
      notify('error', getError(error));
    }
  }

  async function createUser(event: React.FormEvent) {
    event.preventDefault();
    try {
      await selfitApi.createUser(token, registerUser);
      setRegisterUser({ usuario: '', senha: '' });
      notify('success', 'Usuario cadastrado.');
    } catch (error) {
      notify('error', getError(error));
    }
  }

  return {
    token,
    userName,
    login,
    setLogin,
    equipments,
    warranties,
    maintenances,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    loading,
    toast,
    unitForm,
    setUnitForm,
    equipmentForm,
    setEquipmentForm,
    editing,
    setEditing,
    registerUser,
    setRegisterUser,
    unidades,
    visibleEquipments,
    stats,
    refreshAll,
    handleLogin,
    handleLogout,
    createUnit,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    createUser,
  };
}

export function equipmentFormFromEquipment(equipment: ApiEquipment): EquipmentFormValue {
  return {
    unidade_nome: equipment.unidade_nome,
    nome_identificacao: equipment.nome_identificacao,
    categoria: equipment.categoria,
    marca: equipment.marca,
    modelo: equipment.modelo,
    numero_serie: equipment.numero_serie,
    placa_patrimonio: equipment.placa_patrimonio,
    localizacao: equipment.localizacao,
    status: equipment.status,
    data_garantia: normalizeDate(equipment.data_garantia),
    endereco_ip: equipment.endereco_ip || '',
    mac_address: equipment.mac_address || '',
  };
}
