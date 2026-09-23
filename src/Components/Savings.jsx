import { useEffect, useState } from "react";
import axios from "axios";

import GoalCard from "./GoalCard.jsx";

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

function Savings () {
  const [savings, setSavings] = useState([])
  const [totalSaved, setTotalSaved] = useState(0)
  const [totalTarget, setTotalTarget] = useState(0)
  const [newSavings, setNewSavings] = useState({name: '', target: '', current: '', deadline: ''})

  const refreshSavings = () => {
    // ('fired savings')
    axios.get('/api/saving')
      .then(res => {
          if(res.data[0]) {
            setSavings(res.data)
          } else {
            setSavings([])
          }
        })
        .catch(err => {
          console.log(err)
        })
  }

  const refreshTransactions = () => {
    axios.get('/api/saving/summary')
      .then(res => {
        const {savingsTarget, savingsTotal} = res.data

        if(savingsTarget) {
          setTotalTarget(savingsTarget)
        } else {
          setTotalTarget(0)
        }

        if(savingsTotal) {
          setTotalSaved(savingsTotal)
        } else {
          setTotalSaved(0)
        }

      })
  }

  useEffect(() => {
    refreshSavings()
  }, [])


  useEffect(() => {
    axios.get('/api/saving/summary')
      .then(res => {
        const {savingsTarget, savingsTotal, savingsTransactionsTotal} = res.data

        if(savingsTarget) {
          setTotalTarget(savingsTarget)
        } else {
          setTotalTarget(0)
        }

        if(savingsTotal) {
          setTotalSaved(savingsTotal)
        } else {
          setTotalSaved(0)
        }

      })
  }, [])


  const createNewSavings = (e) => {
    e.preventDefault()
    const body = {...newSavings}

    axios.post('/api/saving', body)
      .then(res => {
        refreshSavings()
        refreshTransactions()

        setNewSavings({name: '', target: '', current: '', deadline: ''})
      })
      .catch(err => {
        console.log(err)
      })
  }

  const updateSaving = (updatedSaving) => {
    axios.put('/api/saving', updatedSaving)
      .then(res => {
        refreshSavings()
        refreshTransactions()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const deleteSaving = (id) => {
    axios.delete(`/api/saving/${id}`)
      .then(res => {
        refreshSavings()
        refreshTransactions()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const goalCards = savings.map((saving, i) => {
    const color = colors[i % (colors.length - 1)]

    return (
      <GoalCard key={saving.saving_id} saving={saving} color={color} updateSaving={updateSaving} deleteSaving={deleteSaving}/>
    )
  })


  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Savings Goals - {getMonth()}</h1>
      </div>

      {/* Main savings balance */}
      <div className="bg-[#0a1628] border border-[#162d55] rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1d3a6a]/30 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-0">
            <div>
              <div className="text-xs text-[#38bdf8] uppercase tracking-widest font-semibold mb-1">Main Savings Balance</div>
              <div className="text-3xl sm:text-4xl font-mono font-medium text-white">
                $ 5000
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <div className="text-xs text-[#3a5070] uppercase tracking-wider">Total incl. goals</div>
              <div className="text-xl font-mono text-[#38bdf8]">${totalSaved.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add form */}
      <form onSubmit={e => createNewSavings(e)} className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5 mb-6 sm:mb-8">
        <h2 className="text-xs font-semibold text-[#38bdf8] uppercase tracking-widest mb-4">New Savings Goal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Goal Name</label>
            <input
              type="text"
              value={newSavings.name}
              onChange={e => setNewSavings(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. New Car"
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white placeholder-[#243a55] focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Target Amount ($)</label>
            <input
              type="number"
              value={newSavings.target}
              onChange={e => setNewSavings(f => ({ ...f, target: e.target.value }))}
              placeholder="0.00"
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white font-mono placeholder-[#243a55] focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Amount Saved ($)</label>
            <input
              type="number"
              value={newSavings.current}
              onChange={e => setNewSavings(f => ({ ...f, current: e.target.value }))}
              placeholder="0.00"
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white font-mono placeholder-[#243a55] focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Target Date</label>
            <input
              type="date"
              value={newSavings.deadline}
              onChange={e => setNewSavings(f => ({ ...f, deadline: e.target.value }))}
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 w-full sm:w-auto px-5 py-2 bg-[#1d6dce] hover:bg-[#2a7de0] text-white text-sm font-medium rounded transition-colors cursor-pointer">
          Add Goal
        </button>
      </form>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-3 sm:p-4">
          <div className="text-[10px] text-[#3a5070] uppercase tracking-wider mb-1">Total Saved</div>
          <div className="text-lg sm:text-2xl font-mono font-medium text-[#10b981]">${totalSaved.toLocaleString()}</div>
        </div>
        <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-3 sm:p-4">
          <div className="text-[10px] text-[#3a5070] uppercase tracking-wider mb-1">Target</div>
          <div className="text-lg sm:text-2xl font-mono font-medium text-[#38bdf8]">${totalTarget.toLocaleString()}</div>
        </div>
        <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-3 sm:p-4">
          <div className="text-[10px] text-[#3a5070] uppercase tracking-wider mb-1">Progress</div>
          <div className="text-lg sm:text-2xl font-mono font-medium text-[#f59e0b]">
            {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : '0.0'}%
          </div>
        </div>
      </div>

      {/* Goals grid — 1 col mobile, 2 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goalCards}
      </div>

    </div>
  )
}

export default Savings