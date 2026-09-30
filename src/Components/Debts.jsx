import { useEffect, useState } from "react";
import axios from "axios";

import DebtCard from "./DebtCard.jsx";

const today = new Date()
const todayFormatted = today.toISOString().split('T')[0]

const formatDate = (date) => {
  let format = new Date(date)

  format = format.toISOString().split('T')[0]

  return format
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#38bdf8', '#f97316', '#ec4899']

const getMonth = () => {
  let date = new Date()

  let month = months[date.getMonth()]

  let year = date.getFullYear()

  return `${month} ${year}`
}

function Debts () {
  const [debts, setDebts] = useState([])
  const [debtRemaining, setDebtRemaining] = useState(0)
  const [debtPaid, setDebtPaid] = useState(0)
  const [monthlyMin, setMonthlyMin] = useState(0)
  const [newDebt, setNewDebt] = useState({name: '', total: 0, remaining: 0, interestRate: 0, minPayment: 0, dueDate: ''})

  const refreshDebts = () => {
    ('fired savings')
    axios.get('/api/debt')
      .then(res => {
          if(res.data[0]) {
            setDebts(res.data)
          }
        })
        .catch(err => {
          console.log(err)
        })

    axios.get('/api/debt/summary')
      .then(res => {
        const {debtRemaining, debtPaid, minPayment} = res.data

        if(debtRemaining) {
          setDebtRemaining(debtRemaining)
        }

        if(debtPaid) {
          setDebtPaid(debtPaid)
        }

        if(minPayment) {
          setMonthlyMin(minPayment)
        }

      })
  }

  useEffect(() => {
    refreshDebts()
  }, [])


  const createNewDebt = (e) => {
    e.preventDefault()
    const body = {...newDebt}

    axios.post('/api/debt', body)
      .then(res => {
        refreshDebts()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const updateDebt = (updatedDebt) => {
    axios.put('/api/debt', updatedDebt)
      .then(res => {
        refreshDebts()
        setNewDebt({name: '', total: 0, remaining: 0, interestRate: 0, minPayment: 0, dueDate: ''})
      })
      .catch(err => {
        console.log(err)
      })
  }

  const deleteDebt = (id) => {
    axios.delete(`/api/debt/${id}`)
      .then(res => {
        console.log('Deleted')
        refreshDebts()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const debtViews = debts.map((debt, i) => {
    const color = colors[i % (colors.length -1)]

    return <DebtCard key={debt.id} debt={debt} color={color} onUpdate={updateDebt} onDelete={deleteDebt} />
  })

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Debts - {getMonth()}</h1>
      </div>
      
      <form onSubmit={(e) => createNewDebt(e)} className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5 mb-6 sm:mb-8">
        <h2 className="text-xs font-semibold text-[#38bdf8] uppercase tracking-widest mb-4">Add Debt</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Debt Name</label>
            <input
              type="text"
              value={newDebt.name}
              onChange={e => setNewDebt(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Credit Card"
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white placeholder-[#243a55] focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Original Amount ($)</label>
            <input
              type="number"
              value={newDebt.total}
              onChange={e => setNewDebt(f => ({ ...f, total: e.target.value }))}
              placeholder="0.00"
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white font-mono placeholder-[#243a55] focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Remaining ($)</label>
            <input
              type="number"
              value={newDebt.remaining}
              onChange={e => setNewDebt(f => ({ ...f, remaining: e.target.value }))}
              placeholder="0.00"
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white font-mono placeholder-[#243a55] focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Interest Rate (%)</label>
            <input
              type="number"
              value={newDebt.interestRate}
              onChange={e => setNewDebt(f => ({ ...f, interestRate: e.target.value }))}
              placeholder="0.00"
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white font-mono placeholder-[#243a55] focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Min. Payment ($/mo)</label>
            <input
              type="number"
              value={newDebt.minPayment}
              onChange={e => setNewDebt(f => ({ ...f, minPayment: e.target.value }))}
              placeholder="0.00"
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white font-mono placeholder-[#243a55] focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Next Due Date</label>
            <input
              type="date"
              value={newDebt.dueDate}
              onChange={e => setNewDebt(f => ({ ...f, dueDate: e.target.value }))}
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 w-full sm:w-auto px-5 py-2 bg-[#1d6dce] hover:bg-[#2a7de0] text-white text-sm font-medium rounded transition-colors cursor-pointer">
          Add Debt
        </button>
      </form>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-3 sm:p-4">
          <div className="text-[10px] text-[#3a5070] uppercase tracking-wider mb-1">Remaining</div>
          <div className="text-lg sm:text-2xl font-mono font-medium text-[#ef4444]">${debtRemaining.toLocaleString()}</div>
        </div>
        <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-3 sm:p-4">
          <div className="text-[10px] text-[#3a5070] uppercase tracking-wider mb-1">Paid Off</div>
          <div className="text-lg sm:text-2xl font-mono font-medium text-[#10b981]">${(debtPaid).toLocaleString()}</div>
        </div>
        <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-3 sm:p-4">
          <div className="text-[10px] text-[#3a5070] uppercase tracking-wider mb-1">Monthly Min</div>
          <div className="text-lg sm:text-2xl font-mono font-medium text-[#f59e0b]">${monthlyMin}/mo</div>
        </div>
      </div>

      {/* Debt cards — 1 col mobile, 2 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {debtViews}
      </div>

    </div>
  )
}

export default Debts