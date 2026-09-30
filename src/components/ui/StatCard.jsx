function StatCard({ label, value, icon: Icon, accent = 'red' }) {
  const accentClass = accent === 'green' ? 'border-l-emerald-500' : 'border-l-selfit-red';

  return (
    <article className={`card flex min-h-[110px] items-center justify-between border-l-4 ${accentClass} px-6 py-5`}>
      <div>
        <p className="text-base font-bold text-[#64748b]">{label}</p>
        <p className="mt-2 text-[29px] font-black leading-none tracking-[-0.025em] text-[#0f172a]">{value}</p>
      </div>
      {Icon ? <Icon size={36} strokeWidth={2.2} className="text-[#dce4ef]" /> : null}
    </article>
  );
}

export default StatCard;
