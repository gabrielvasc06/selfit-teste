function LogoMark({ size = 'md', label = true, panelLabel = 'PAINEL EQUIPAMENTOS', icon: Icon }) {
  const sizes = {
    sm: 'h-11 w-11 text-xl',
    md: 'h-[50px] w-[50px] text-2xl',
    lg: 'h-[90px] w-[90px] text-[28px]',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-[13px] bg-[#ed0016] text-white shadow-[0_10px_24px_rgba(237,0,22,0.28)]`}>
        {Icon ? <Icon size={size === 'lg' ? 36 : 25} strokeWidth={2.45} /> : <span className="font-black italic tracking-[-0.04em]">selfit</span>}
      </div>
      {label ? (
        <div className="min-w-0">
          <p className="text-[21px] font-black leading-none tracking-[-0.02em] text-[#ff0018]">SELFIT</p>
          <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#bfdbfe]">{panelLabel}</p>
        </div>
      ) : null}
    </div>
  );
}

export default LogoMark;
