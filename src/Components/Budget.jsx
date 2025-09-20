import axios from "axios"
import { useEffect, useState } from "react"


import BudgetView from "./BudgetView.jsx"

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getMonth = () => {
  let date = new Date()

  let month = months[date.getMonth()]

  let year = date.getFullYear()

  return `${month} ${year}`
}

function Budget () {
  const [expenseBudgets, setExpenseBudgets] = useState([])
  const [incomeBudgets, setIncomeBudgets] = useState([])
  const [newBudget, setNewBudget] = useState({name: '', amount: 0, type: 'default'})
  const [planned, setPlanned] = useState({expense: 0, income: 0})
  const [actuals, setActuals] = useState({expense: 0, income: 0})

  const refreshBudgets = () => {
    axios.get('/api/budget?group=true')
      .then(res => {
        const {expenses, incomes} = res.data

        setExpenseBudgets(expenses)

        setIncomeBudgets(incomes)
      })
  }

  const refreshSummaries = () => {
    axios.get('/api/summary')
      .then(res => {
        const { expensePlanned, incomePlanned, expenseActual, incomeActual } = res.data

        setPlanned({expense: expensePlanned, income: incomePlanned})
        setActuals({expense: expenseActual, income: incomeActual})
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


  const createBudget = () => {
    let body = {...newBudget}

    axios.post('/api/budget', body)
      .then(res => {
        setNewBudget({name: '', amount: 0, type: 'default'})

        refreshBudgets()
        refreshSummaries()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const budgetsView = (budgets) => budgets.map(budget => {

    return (
      <BudgetView key={budget.budget_id} budget={budget} refreshBudgets={refreshBudgets} refreshSummaries={refreshSummaries} />
    )
  })


  return (
    <div>
      <h3>Budget - {getMonth()}</h3>
      
      <div className="form-wrapper">
        <h4>New Budget</h4>

        <form>
          <div className="form-inputs">
            <label htmlFor="name">Name:</label>
            <input id="name" value={newBudget.name} onChange={(evt) => setNewBudget({...newBudget, name: evt.target.value})} placeholder="Name"/>
          </div>

          <div className="form-inputs">
            <label htmlFor="amount">Amount:</label>
            <input id="amount" value={newBudget.amount} onChange={(evt) => setNewBudget({...newBudget, amount: evt.target.value})} placeholder="Amount" type="number"/>
          </div>

          <div className="form-inputs">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              value={newBudget.type}
              onChange={evt => setNewBudget({...newBudget, type: evt.target.value})}
            >
              <option value='default' disabled>Select Type</option>
              <option value='expense'>Expense</option>
              <option value='income'>Income</option>
            </select>
          </div>

        </form>

        <button onClick={(e) => {
          e.preventDefault()
          createBudget()
        }}>Add</button>

      </div>

      <div className="split-tables">
        <div className="split-table-wrapper">
          <table>
            <caption>Expenses</caption>

            <tbody>
              <tr className="summary-table-row">
                <td className="name-td"></td>
                <td className="planned-td">Planned</td>
                <td className="actual-td">Actual</td>
                <td className="diff-td">Difference</td>
                <td className="delete-td"></td>
              </tr>
              <tr className="summary-table-row">
                <td className="name-td">Totals</td>
                <td className="planned-td">$ {planned.expense}</td>
                <td className="actual-td">$ {actuals.expense}</td>
                <td className="diff-td">$ {planned.expense - actuals.expense}</td>
                <td className="delete-td"></td>
              </tr>
            </tbody>

            <tbody>
              {expenseBudgets.length > 0 ? (
                  budgetsView(expenseBudgets)
                ) : (
                  <tr>
                    <td className="no-data-row">No budgets to show</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        <div className="split-table-wrapper">
          <table>
            <caption>Income</caption>

            <tbody>
              <tr className="summary-table-row">
                <td className="name-td"></td>
                <td className="planned-td">Planned</td>
                <td className="actual-td">Actual</td>
                <td className="diff-td">Difference</td>
                <td className="delete-td"></td>
              </tr>
              <tr className="summary-table-row">
                <td className="name-td">Totals</td>
                <td className="planned-td">$ {planned.income}</td>
                <td className="actual-td">$ {actuals.income}</td>
                <td className="diff-td">$ {planned.income - actuals.income}</td>
                <td className="delete-td"></td>
              </tr>
            </tbody>

            <tbody>
              {incomeBudgets.length > 0 ? (
                budgetsView(incomeBudgets)
              ) : (
                <tr>
                  <td className="no-data-row">No budgets to show</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}

export default Budget








