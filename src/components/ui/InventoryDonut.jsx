function InventoryDonut({ total, label }) {
  return (
    <article className="card flex min-h-[416px] flex-col px-7 py-8">
      <h2 className="text-xl font-black tracking-[-0.015em] text-slate-900">Distribuicao do Inventario</h2>
      <div className="flex flex-1 flex-col items-center justify-center py-6">
        <div className="relative flex h-52 w-52 items-center justify-center rounded-full bg-slate-100">
          <div className="absolute right-[44px] top-1 h-8 w-8 rounded-full bg-amber-500 shadow-sm" />
          <div className="flex h-[148px] w-[148px] flex-col items-center justify-center rounded-full bg-white">
            <p className="text-4xl font-black tracking-[-0.025em] text-slate-950">{total}</p>
            <p className="text-sm font-medium text-[#64748b]">{label}</p>
          </div>
        </div>
        <p className="mt-6 text-center text-base font-medium text-[#64748b]">Resumo atual do modulo selecionado</p>
      </div>
    </article>
  );
}

export default InventoryDonut;
