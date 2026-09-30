import axios from "axios"
import { useEffect, useState } from "react"

import TransactionCard from "./TransactionCard.jsx"

const today = new Date()
const todayFormatted = today.toISOString().split('T')[0]

const formatDate = (date) => {
  let format = new Date(date)

  format = format.toISOString().split('T')[0]

  return format
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getMonth = () => {
  let date = new Date()

  let month = months[date.getMonth()]

  let year = date.getFullYear()

  return `${month} ${year}`
}

const buttonOptions = {'budget': ['Expense', 'Income'], 'saving': ['Withdrawl', 'Deposit'], 'debt': ['Charge', 'Payment']}

function Transactions () {
  const [ transactions, setTransactions ] = useState([])
  const [ newTransaction, setNewTransaction ] = useState({ name: '', amount: 0, date: todayFormatted, type: 'Expense', category: 'default', budget_id: 'default' })
  const [ typeOptions, setTypeOptions ] = useState('budget')
  const [ budgets, setBudgets ] = useState([])
  const [ savings, setSavings ] = useState([])
  const [ debts, setDebts ] = useState([])

  const refreshTransactions = () => {
    axios.get('/api/transaction?all=true')
      .then(res => {
        setTransactions(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const refreshBudgets = () => {
    axios.get('/api/summary/categories?budget=true&saving=true&debt=true')
      .then(res => {
        const {budgets, savings, debts} = res.data

        setBudgets(budgets)
        setSavings(savings)
        setDebts(debts)

        if(budgets[0]) {
          setNewTransaction(f => ({...f, budget_id: budgets[0].budget_id, category: `budget/Expense/${budgets[0].budget_id}`}))
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    refreshBudgets()
    refreshTransactions()
  }, [])


  const createNewTransaction = (e) => {
    e.preventDefault()
    const body = {...newTransaction}

    axios.post('/api/transaction', body)
      .then(res => {
        refreshTransactions()
        refreshBudgets()
      })
      .catch(err => {
        console.log(err)
      })

      setNewTransaction({ name: '', amount: 0, date: todayFormatted, type: 'Expense', budget_id: 'default' })
  }

  const updateTransaction = (updatedTransaction) => {
    axios.put('/api/transaction', updatedTransaction)
      .then(res => {
        refreshTransactions()
        refreshBudgets()
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  const deleteTransaction = (id, type) => {
    axios.delete(`/api/transaction/${id}?type=${type}`)
      .then(res => {
        refreshTransactions()
        refreshBudgets()
      })
      .catch(err => {
        console.log(err)
      })
  }


  const budgetSelects = budgets.map((budget) => {
    return (
      <option key={budget.budget_id} value={`budget/Expense/${budget.budget_id}`}>{budget.name}</option>
    )
  })

  const savingSelects = savings.map((saving) => {
    return (
      <option key={saving.saving_id} value={`saving/Withdrawl/${saving.saving_id}`} >{saving.name}</option>
    )
  })

  const debtSelects = debts.map((debt) => {
    return (
      <option key={debt.debt_id} value={`debt/Charge/${debt.debt_id}`} >{debt.name}</option>
    )
  })

  const transactionsView = transactions.map((transaction, i) => {
    return (
      <TransactionCard key={i} i={i} transaction={transaction} budgets={budgets} updateTransaction={updateTransaction} deleteTransaction={deleteTransaction} options={buttonOptions[transaction.txcat]} />
    )
  })

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Transactions - {getMonth()}</h1>
      </div>

      {/* Add form */}
      <form onSubmit={(e) => createNewTransaction(e)} className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5 mb-6 sm:mb-8">
        <h2 className="text-xs font-semibold text-[#38bdf8] uppercase tracking-widest mb-4">Add Transaction</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="sm:col-span-2">
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Name</label>
            <input
              type="text"
              value={newTransaction.name}
              onChange={e => setNewTransaction(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Grocery run"
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white placeholder-[#243a55] focus:outline-none focus:border-[#1d6dce] transition-colors"
              disabled={typeOptions !== 'budget'}
            />
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Amount ($)</label>
            <input
              type="number"
              value={newTransaction.amount}
              onChange={e => setNewTransaction(f => ({ ...f, amount: e.target.value }))}
              placeholder="0.00"
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white font-mono placeholder-[#243a55] focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Category</label>
            <select
              value={newTransaction.category}
              onChange={e => {
                const data = e.target.value.split('/')

                setNewTransaction(f => ({...f, type: data[1], budget_id: data[2], category: e.target.value}))
                setTypeOptions(data[0])

                if(data[0] !== 'budget') {
                  setNewTransaction((f) => ({...f, name: ''}))
                }
              }}
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1d6dce] transition-colors"
            >
              <option value={'default'} disabled>Select A Category</option>
              <optgroup label="Budget">
                {budgetSelects}
              </optgroup>
              <optgroup label="Saving">
                {savings.length > 0 ? savingSelects : <option disabled>No Savings Available</option>}
              </optgroup>
              <optgroup label="Debt">
                {debts.length > 0 ? debtSelects : <option disabled>No Debts Available</option>}
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={newTransaction.date}
              onChange={e => setNewTransaction(f => ({ ...f, date: e.target.value }))}
              className="w-full bg-[#050d1a] border border-[#162d55] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1d6dce] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#3a5070] mb-1.5 uppercase tracking-wider">Type</label>
            <div className="flex gap-2">
              {buttonOptions[typeOptions].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewTransaction(f => ({ ...f, type: t }))}
                  className={`flex-1 py-2 rounded text-sm font-medium capitalize transition-colors cursor-pointer ${
                    newTransaction.type === t
                      ? (t === 'Income' || t === 'Deposit' || t === 'Payment') ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white'
                      : 'bg-[#050d1a] border border-[#162d55] text-[#5a7ba0] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button type="submit" className="w-full sm:w-auto px-5 py-2 bg-[#1d6dce] hover:bg-[#2a7de0] text-white text-sm font-medium rounded transition-colors cursor-pointer">
          Add Transaction
        </button>
      </form>

      <div className="hidden sm:block bg-[#0a1628] border border-[#0f2040] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#0f2040]">
              {['Date', 'Description', 'Category', 'Type', 'Amount', ''].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold text-[#3a5070] uppercase tracking-widest px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {transactionsView}
          </tbody>
        </table>
        {transactions.length === 0 && <div className="text-center py-12 text-[#3a5070] text-sm">No transactions found</div>}
      </div>
    </div>
  );
}

export default Transactions