export function sanitizeUppercase(value) {
  return String(value || '').toUpperCase();
}

export function normalizeUpperText(value) {
  return sanitizeUppercase(value).trim();
}

export function hasRequiredText(value) {
  return normalizeUpperText(value).length > 0;
}

export function calculatePercent(value, total) {
  if (!total) {
    return 0;
  }

  return Math.round((Number(value) / Number(total)) * 100);
}

export function formatDate(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(`${value}`.includes('T') ? value : `${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}

export function getWarrantyState(value) {
  if (!value) {
    return {
      label: 'SEM DATA',
      tone: 'neutral',
      className: 'bg-slate-100 text-slate-600',
    };
  }

  const today = new Date();
  const expiration = new Date(`${value}`.includes('T') ? value : `${value}T00:00:00`);
  const days = Math.ceil((expiration.getTime() - today.getTime()) / 86400000);

  if (Number.isNaN(expiration.getTime())) {
    return {
      label: 'INVALIDA',
      tone: 'neutral',
      className: 'bg-slate-100 text-slate-600',
    };
  }

  if (days < 0) {
    return {
      label: 'VENCIDA',
      tone: 'red',
      className: 'bg-red-100 text-red-700',
    };
  }

  if (days <= 30) {
    return {
      label: `${days} DIAS`,
      tone: 'amber',
      className: 'bg-amber-100 text-amber-800',
    };
  }

  return {
    label: formatDate(value),
    tone: 'green',
    className: 'bg-emerald-100 text-emerald-700',
  };
}
