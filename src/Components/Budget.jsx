import axios from "axios"
import { useEffect, useState } from "react"


import BudgetCard from "./BudgetCard.jsx"

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#d4c4f8', '#4d495b', '#f5effd', '#0b6696', '#494657', '#086a07',  '#1b0c31', '#604469']

const getMonth = () => {
  let date = new Date()

  let month = months[date.getMonth()]

  let year = date.getFullYear()

  return `${month} ${year}`
}

function Budget () {
  const [budgets, setBudgets] = useState([])
  const [newBudget, setNewBudget] = useState({name: '', amount: 0})
  const [planned, setPlanned] = useState(0)
  const [actual, setActual] = useState(0)

  const refreshBudgets = () => {
    axios.get('/api/budget?group=true')
      .then(res => {
        if(res.data[0]) {
          setBudgets(res.data[0])
        }
      })
  }

  const refreshSummaries = () => {
    axios.get('/api/summary')
      .then(res => {
        const { planned, actual } = res.data

        setPlanned(planned || 0)
        setActual(actual || 0)
      })
      .catch(err => {
        console.log(err)
      })
  }


  useEffect(() => {
    refreshBudgets()
  }, [])

  useEffect(() => {
    refreshSummaries()
  }, [])


  const createBudget = (e) => {
    e.preventDefault()

    let body = {...newBudget}

    axios.post('/api/budget', body)
      .then(res => {
        setNewBudget({name: '', amount: 0})

        refreshBudgets()
        refreshSummaries()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const budgetCards = budgets.map((budget, i) => {
    const remaining = budget.amount - budget.actual
    const over = remaining < 0
    const color = colors[i % (colors.length -1)]
    return (
      <BudgetCard key={budget.budget_id} budget={budget} remaining={remaining} over={over} color={color} refreshBudgets={refreshBudgets} refreshSummaries={refreshSummaries} />
    )
  })


  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Budget - {getMonth()}</h1>
        {/* <p className="text-sm text-[#3a5070] mt-1">Monthly allocation vs. spending</p> */}
      </div>

      <form onSubmit={(e) => createBudget(e)} className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5 mb-6 sm:mb-8">
        <h2 className="text-xs font-semibold text-[#38bdf8] uppercase tracking-widest mb-4">Add Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Category Name</label>
            <input
              type="text"
              value={newBudget.name}
              onChange={(evt) => setNewBudget({...newBudget, name: evt.target.value})}
              placeholder="e.g. "
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white placeholder-[#243a55] focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Allocated ($)</label>
            <input
              type="number"
              value={newBudget.amount}
              onChange={(evt) => setNewBudget({...newBudget, amount: evt.target.value})}
              placeholder="0.00"
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white font-mono placeholder-[#243a55] focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
        </div>

        <button type="submit" className="mt-4 w-full sm:w-auto px-5 py-2 bg-[#1d6dce] hover:bg-[#2a7de0] text-white text-sm font-medium rounded transition-colors cursor-pointer">
          Add Category
        </button>

      </form>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Allocated', value: planned, color: 'text-[#38bdf8]' },
          { label: 'Spent', value: actual, color: 'text-[#f59e0b]' },
          { label: 'Remaining', value: planned - actual, color: planned - actual >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]' },
        ].map(s => (
          <div key={s.label} className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-3 sm:p-4">
            <div className="text-[10px] text-[#3a5070] uppercase tracking-wider mb-1">{s.label}</div>
            <div className={`text-lg sm:text-2xl font-mono font-medium ${s.color}`}>
              ${Math.abs(s.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {budgetCards}
      </div>

    </div>
  )
}

export default Budget