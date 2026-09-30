import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { listUnidades } from '../services/inventoryService';

const FALLBACK_UNIDADES = [
  { id: 1, nome: 'SELFIT MATRIZ', cnpj: '00.000.000/0001-00', uf: 'PE', bairro: 'BOA VIAGEM' },
  { id: 2, nome: 'SELFIT RECIFE SHOPPING', cnpj: '00.000.000/0002-00', uf: 'PE', bairro: 'IMBIRIBEIRA' },
  { id: 3, nome: 'SELFIT SALVADOR', cnpj: '00.000.000/0003-00', uf: 'BA', bairro: 'PITUBA' },
];

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [unidades, setUnidades] = useState([]);
  const [selectedUnidadeId, setSelectedUnidadeId] = useState('all');
  const [loadingUnidades, setLoadingUnidades] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUnidades() {
      setLoadingUnidades(true);
      try {
        const data = await listUnidades();
        if (isMounted) {
          setUnidades(data);
        }
      } catch {
        if (isMounted) {
          setUnidades(FALLBACK_UNIDADES);
          toast.message('API de unidades indisponivel. Usando dados locais para pre-visualizacao.');
        }
      } finally {
        if (isMounted) {
          setLoadingUnidades(false);
        }
      }
    }

    loadUnidades();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedUnidade = useMemo(
    () => unidades.find((unidade) => String(unidade.id) === String(selectedUnidadeId)) || null,
    [selectedUnidadeId, unidades],
  );

  const value = useMemo(
    () => ({
      unidades,
      selectedUnidade,
      selectedUnidadeId,
      setSelectedUnidadeId,
      loadingUnidades,
      unidadeCount: unidades.length || 170,
    }),
    [loadingUnidades, selectedUnidade, selectedUnidadeId, unidades],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error('useInventory deve ser usado dentro de InventoryProvider.');
  }

  return context;
}
