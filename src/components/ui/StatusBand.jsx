function StatusBand({ icon: Icon, title, subtitle, value, percent, tone = 'green' }) {
  const tones = {
    green: {
      card: 'border-emerald-200 bg-emerald-50',
      text: 'text-emerald-700',
      icon: 'text-emerald-700',
      bar: 'bg-emerald-100',
      fill: 'bg-emerald-600',
    },
    red: {
      card: 'border-red-200 bg-red-50',
      text: 'text-red-700',
      icon: 'text-red-700',
      bar: 'bg-red-100',
      fill: 'bg-red-600',
    },
    amber: {
      card: 'border-amber-200 bg-amber-50',
      text: 'text-amber-800',
      icon: 'text-amber-800',
      bar: 'bg-amber-100',
      fill: 'bg-amber-600',
    },
  };
  const current = tones[tone];

  return (
    <article className={`rounded-[8px] border ${current.card} px-6 py-[26px]`}>
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          {Icon ? <Icon size={24} strokeWidth={2.25} className={current.icon} /> : null}
          <div>
            <p className={`text-lg font-black ${current.text}`}>{title}</p>
            <p className="text-base font-medium text-[#475569]">{subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-black leading-none ${current.text}`}>{value}</p>
          <p className="mt-2 text-base font-medium text-[#64748b]">{percent}%</p>
        </div>
      </div>
      <div className={`mt-4 h-1.5 rounded-full ${current.bar}`}>
        <div className={`h-full rounded-full ${current.fill}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
    </article>
  );
}

export default StatusBand;
