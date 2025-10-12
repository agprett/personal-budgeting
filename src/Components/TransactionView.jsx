import axios from "axios"
import { useEffect, useRef, useState } from "react"

const formatDate = (date) => {
  let objDate = new Date(date)

  let splitDate = objDate.toISOString().split('T')[0].split('-')

  let formattedDate = `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`

  return formattedDate
}

const today = new Date()

function ExpenseView({ transaction, budgets, refreshTransactions, refreshBudgets }) {
  const nameRef = useRef(null)
  const [editName, setEditName] = useState(false)

  const amountRef = useRef(null)
  const [editAmount, setEditAmount] = useState(false)

  const dateRef = useRef(null)
  const [editDate, setEditDate] = useState(false)

  const [editBudget, setEditBudget] = useState(false)

  const [name, setName] = useState(transaction.name || '')
  const [amount, setAmount] = useState(transaction.amount || 0)
  const [date, setDate] = useState(transaction.date || formatDate(today))
  const [budget, setBudget] = useState(transaction.Budget.budget_id || 'default')


  useEffect(() => {
    if (editName && nameRef.current) {
      setTimeout(() => {
        nameRef.current.focus();
      }, 0)
    }
  }, [editName])


  useEffect(() => {
    if (editAmount && amountRef.current) {
      setTimeout(() => {
        amountRef.current.focus();
      }, 0)
    }
  }, [editAmount])


  useEffect(() => {
    if (editDate && dateRef.current) {
      setTimeout(() => {
        dateRef.current.focus();
      }, 0)
    }
  }, [editDate])

  const updateTransaction = (updatedTransaction) => {
    axios.put('/api/transaction', {transaction_id: transaction.transaction_id, ...updatedTransaction})
      .then(res => {
        refreshTransactions()
        refreshBudgets()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const deleteTransaction = () => {
    axios.delete(`/api/transaction/${transaction.transaction_id}`)
      .then(res => {
        refreshTransactions()
        refreshBudgets()
      })
      .catch(err => {
        console.log(err)
      })
  }


  const expensesSelects = budgets.expenses.map((budget) => {
    return (
      <option key={budget.budget_id} value={budget.budget_id}>{budget.name}</option>
    )
  })

  const incomesSelects = budgets.incomes.map((budget) => {
    return (
      <option key={budget.budget_id} value={budget.budget_id}>{budget.name}</option>
    )
  })

  return (
    <tr>
      <td className="name-td">
        {
          editName ? (
            <input 
              value={name}
              ref={nameRef}
              onChange={evt => setName(evt.target.value)}
              onKeyDown={(evt) => {
                if(evt.key === 'Enter') {
                  setEditName(false)
                  updateTransaction({name: evt.target.value})
                }
              }}
              onBlur={(evt) => {
                setEditName(false)
                updateTransaction({name: evt.target})
              }}
            />
          ) : (
            <p onClick={() => setEditName(true)}>{name}</p>
          )
        }
      </td>

      <td className="amount-td">
        {
          editAmount ? (
            <input
              value={amount}
              ref={amountRef}
              type="number"
              onChange={(evt) => {
                setAmount(evt.target.value)
              }} 
              onKeyDown={(evt) => {
                if(evt.key === 'Enter') {
                  setEditAmount(false)
                  updateTransaction({amount: evt.target.value})
                }
              }}
              onBlur={(evt) => {
                setEditAmount(false)
                updateTransaction({amount: evt.target.value})
              }}
            />
          ) : (
            <p onClick={() => setEditAmount(true)}>$ {amount}</p>
          )
        }
      </td>

      <td className="date-td">
        {
          editDate ? (
            <input
              value={date}
              ref={dateRef}
              type="date"
              onChange={evt => setDate(evt.target.value)}
              onKeyDown={evt => {
                if(evt.key === 'Enter') {
                  updateTransaction({date: evt.target.value})
                  setEditDate(false)
                }
              }}
              onBlur={() => setEditDate(false)}
            />
          ) : (
            <p onClick={() => setEditDate(true)}>{formatDate(date)}</p>
          )
        }
      </td>
    
      <td className="category-td">
        {editBudget ? (
          <select
            value={budget}
            autoFocus
            onBlur={() => setEditBudget(false)}
            onChange={evt => {
              setBudget(evt.target.value)
              updateTransaction({budget: evt.target.value})
              setEditBudget(false)
            }}
          >
            <option value='default' disabled>Select Budget</option>
            <optgroup label="Expenses">{expensesSelects}</optgroup>
            <optgroup label="Incomes">{incomesSelects}</optgroup>
          </select>
        ) : (
          <p onClick={() => setEditBudget(true)}>{transaction.Budget.name}</p>
        )}
      </td>
      
      <td className="delete-td">
        <button onClick={deleteTransaction}>Delete</button>
      </td>
    </tr>
  )
}

export default ExpenseView