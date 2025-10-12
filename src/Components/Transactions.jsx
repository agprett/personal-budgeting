import axios from "axios"
import { useEffect, useState } from "react"

import TransactionView from "./TransactionView.jsx"

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

function Transactions () {

  const [ expenseTransactions, setExpenseTransactions ] = useState([])
  const [ incomeTransactions, setIncomeTransactions ] = useState([])
  const [ newTransaction, setNewTransaction ] = useState({ name: '', amount: 0, date: todayFormatted, budget_id: 'default' })
  const [ budgets, setBudget ] = useState({expenses: [], incomes: []})

  const refreshTransactions = () => {
    axios.get('/api/transaction')
      .then(res => {
        const { expenses, incomes } = res.data

        setExpenseTransactions(expenses)
        setIncomeTransactions(incomes)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const refreshBudgets = () => {
    axios.get('/api/budget?group=type')
      .then((res) => {
        setBudget(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    refreshTransactions()
  }, [])

  useEffect(() => {
    refreshBudgets()
    }, [])


  const createNewTransaction = () => {
    const body = {...newTransaction}

    axios.post('/api/transaction', body)
      .then(res => {
        refreshTransactions()
        refreshBudgets()
      })
      .catch(err => {
        console.log(err)
      })

      setNewTransaction({ name: '', amount: 0, date: todayFormatted, budget_id: 'default' })
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

  const transactionsView = (transactions) => transactions.map(transaction => {
    return (
      <TransactionView key={transaction.transaction_id} transaction={transaction} budgets={budgets} refreshBudgets={refreshBudgets} refreshTransactions={refreshTransactions} />
    )
  })

  return (
    <div>
      <h3>Transactions - {getMonth()}</h3>
      <div className="form-wrapper">
        <h4>New Transaction</h4>

        <form>
          <div className="form-inputs">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              placeholder="Name"
              value={newTransaction.name}
              onChange={(evt) =>
                setNewTransaction({ ...newTransaction, name: evt.target.value })
              }
            />
          </div>

          <div className="form-inputs">
            <label htmlFor="amount">Amount:</label>
            <input
              id="amount"
              placeholder="Amount"
              type="number"
              value={newTransaction.amount}
              onChange={(evt) =>
                setNewTransaction({
                  ...newTransaction,
                  amount: evt.target.value,
                })
              }
            />
          </div>

          <div className="form-inputs">
            <label htmlFor="date">Date:</label>
            <input
              id="date"
              placeholder="Date"
              type="date"
              value={newTransaction.date}
              onChange={(evt) =>
                setNewTransaction({
                  ...newTransaction,
                  date: formatDate(evt.target.value),
                })
              }
            />
          </div>

          <div className="form-inputs">
            <label htmlFor="budget">Budget:</label>
            <select
              id="budget"
              value={newTransaction.budget_id}
              onChange={(evt) =>
                setNewTransaction({
                  ...newTransaction,
                  budget_id: evt.target.value,
                })
              }
            >
              <option value="default" disabled>
                Select Budget
              </option>
              <optgroup label="Expenses">{expensesSelects}</optgroup>
              <optgroup label="Incomes">{incomesSelects}</optgroup>
            </select>
          </div>
        </form>

        <button onClick={createNewTransaction}>Add Transaction</button>
      </div>

      <div className="split-tables">
        <div className="split-table-wrapper">
          <table>
            <caption>Expenses</caption>
            <tbody>
              {expenseTransactions.length > 0 ? (
                transactionsView(expenseTransactions)
              ) : (
                <tr className="no-data-row">
                  <td>No expenses to show</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="split-table-wrapper">
          <table>
            <caption>Income</caption>
            <tbody>
              {incomeTransactions.length > 0 ? (
                transactionsView(incomeTransactions)
              ) : (
                <tr className="no-data-row">
                  <td>
                    No income to show
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions