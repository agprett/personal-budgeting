import EdittingField from "./EdittingField.jsx";

function DebtCard( {debt, color, onUpdate, onDelete} ) {
  const remaining = debt.total - +debt.paid || 0;
  const pct = Math.min((+debt.paid / debt.total) * 100, 100);

  return (
    <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5 group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-medium text-white">
            <EdittingField value={debt.name} onSave={value => onUpdate({...debt, name: value})} className="text-white font-medium" />
          </div>
          <div className="text-xs text-[#3a5070] mt-0.5"><EdittingField value={debt.interestRate} onSave={value => onUpdate({...debt, interestRate: value})} type="number" className="text-[#3a5070]" />% APR · Due <EdittingField value={debt.dueDate} onSave={value => onUpdate({...debt, dueDate: value})} type="date" className="text-[#3a5070]" /></div>
        </div>
        <button onClick={() => onDelete(debt.debt_id)} className="opacity-0 group-hover:opacity-100 text-[#3a5070] hover:text-[#ef4444] transition-all cursor-pointer p-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <div className="text-[10px] text-[#3a5070] uppercase tracking-wider mb-0.5">Original</div>
          <div className="text-sm font-mono text-[#5a7ba0]">$<EdittingField value={debt.total} onSave={value => onUpdate({...debt, total: value})} type="number" className="text-[#5a7ba0]" /></div>
        </div>
        <div>
          <div className="text-[10px] text-[#3a5070] uppercase tracking-wider mb-0.5">Remaining</div>
          <div className="text-sm font-mono text-[#ef4444]">${remaining.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[10px] text-[#3a5070] uppercase tracking-wider mb-0.5">Min/mo</div>
          <div className="text-sm font-mono text-[#f59e0b]">$<EdittingField value={debt.minPayment} onSave={value => onUpdate({...debt, minPayment: value})} type="number" className="text-[#f59e0b]" /></div>
        </div>
      </div>
      <div className="w-full h-2 bg-[#0f2040] rounded-full overflow-hidden mb-1">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="flex justify-between text-[10px] text-[#3a5070]">
        <span>${debt.paid.toLocaleString() || 0} paid</span>
        <span>{pct.toFixed(1)}% paid off</span>
      </div>
    </div>
  );
}

export default DebtCard