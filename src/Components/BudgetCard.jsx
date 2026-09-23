import axios from "axios"
import { useState } from "react"

import ProgressBar from './ProgressBar.jsx'
import EdittingField from "./EdittingField.jsx"

function BudgetCard({ budget, remaining, over, color, refreshBudgets, refreshSummaries }) {
  const [actual, setActual] = useState(budget.actual || 0)


  const updateBudget = (updatedItem) => {
    const updatedBudget = {...budget, ...updatedItem}

    axios.put('/api/budget', updatedBudget)
      .then(res => {
        console.log(res.data)

        refreshBudgets()
        refreshSummaries()
      })
      .catch(err => {
        console.log(err)
      })
  }
    
  const deleteBudget = (id) => {
    axios.delete(`/api/budget/${id}`)
      .then(res => {
        
        refreshBudgets()
        refreshSummaries()
      })
      .catch(err => {
        console.log(err)
      })
  }
  

  return (
    // {/* Categories */}
    <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 group">
      <div className="flex items-start sm:items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <EdittingField editKey={'name'} value={budget.name} type={'text'} onSave={(value) => updateBudget({name: value})} className={'text-sm font-medium text-white'} />
          {over && <span className="text-[10px] bg-[#ef4444]/20 text-[#ef4444] px-1.5 py-0.5 rounded font-medium flex-shrink-0">OVER</span>}
        </div>
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          {/* On mobile show just spent/budget, full on desktop */}
          <div className="hidden sm:block text-right">
            <div className="text-[10px] text-[#3a5070] uppercase tracking-wider">Spent</div>
            <div className="text-sm font-mono text-white">${Math.abs(actual).toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#3a5070] uppercase tracking-wider">Budget</div>
            <div className="text-sm font-mono text-[#38bdf8]">
              $<EdittingField value={budget.amount} onSave={(value) => updateBudget({amount: value})} type="number" className="text-[#38bdf8]" />
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#3a5070] uppercase tracking-wider">Left</div>
            <div className={`text-sm font-mono ${over ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
              {over ? '-' : ''}${Math.abs(remaining).toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => deleteBudget(budget.budget_id)}
            className="opacity-0 group-hover:opacity-100 text-[#3a5070] hover:text-[#ef4444] transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile: show spent inline */}
      <div className="sm:hidden text-xs text-[#3a5070] mb-2">Spent: <span className="text-white font-mono">${actual.toLocaleString()}</span></div>
      <ProgressBar value={actual} max={budget.amount} color={color} />
      <div className="mt-1 text-[10px] text-[#3a5070] text-right">{Math.round((actual / budget.amount) * 100)}% used</div>
    </div>
  )
}

export default BudgetCard