import EdittingField from "./EdittingField";

function GoalCard ({saving, color, updateSaving, deleteSaving}) {
  const pct = Math.min((saving.current / saving.target) * 100, 100);
  const remaining = saving.target - saving.current;
  const daysLeft = Math.max(0, Math.ceil((new Date(saving.deadline).getTime() - Date.now()) / 86400000));

  return (
    <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5 group">
      <div className="flex items-start justify-between mb-4">
        <div>
            <div className="text-sm font-medium text-">
            <EdittingField value={saving.name} onSave={value => updateSaving({...saving, name: value})} type={'text'} className="text-white font-medium" />
          </div>
          <div className="text-xs text-[#3a5070] mt-0.5">By <EdittingField value={saving.deadline} type={'date'} onSave={(value) => updateSaving({...saving, deadline: value})} className="text-white font-medium" /> · {daysLeft} days left</div>
        </div>
        <button onClick={() => deleteSaving(saving.saving_id)} className="opacity-0 group-hover:opacity-100 text-[#3a5070] hover:text-[#ef4444] transition-all cursor-pointer p-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-xl sm:text-2xl font-mono font-medium" style={{ color: color }}>${saving.current.toLocaleString()}</div>
          <div className="text-xs text-[#3a5070]">
            of $<EdittingField value={saving.target} onSave={value => updateSaving({...saving, target: value})} type="number" className="text-[#3a5070]" />
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#3a5070] uppercase tracking-wider">Remaining</div>
          <div className="text-sm font-mono text-[#5a7ba0]">${remaining.toLocaleString()}</div>
        </div>
      </div>
      <div className="w-full h-2 bg-[#0f2040] rounded-full overflow-hidden mb-1">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="text-[10px] text-[#3a5070] text-right">{pct.toFixed(1)}% complete</div>
    </div>
  );
}

export default GoalCard