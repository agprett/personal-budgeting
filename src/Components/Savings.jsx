import { useEffect, useState } from "react";
import axios from "axios";

import SavingsView from "./SavingsView.jsx";
import SavingsTransactionView from "./SavingsTransactionView.jsx";

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

function Savings () {
  const [savings, setSavings] = useState([])
  const [savingsTransactions, setSavingsTransactins] = useState([])
  const [savingsSummary, setSavingsSummary] = useState(0)
  const [transactionSummary, setTransactionsSummary] = useState(0)
  const [newSavings, setNewSavings] = useState({name: '', amount: 0})
  const [newSavingsTransaction, setNewSavingsTransaction] = useState({saving_id: 'default', amount: 0, type: 'default', date: todayFormatted})

  const refreshSavings = () => {
    ('fired savings')
    axios.get('/api/saving')
      .then(res => {
          setSavings(res.data)
        })
        .catch(err => {
          console.log(err)
        })
  }

  const refreshTransactions = () => {
    ('fired transactions')
    axios.get('/api/saving/transaction')
      .then(res => {
        setSavingsTransactins(res.data)
      })
      .catch(err => {
        console.log(err)
      })

    axios.get('/api/saving/summary')
      .then(res => {
        const {savingsTotal, savingsTransactionsTotal} = res.data

        setSavingsSummary(savingsTotal)
        setTransactionsSummary(savingsTransactionsTotal)
      })
  }

  useEffect(() => {
    refreshSavings()
  }, [])

  useEffect(() => {
    refreshTransactions()
  }, [])

  useEffect(() => {
    axios.get('/api/saving/summary')
      .then(res => {
        const {savingsTotal, savingsTransactionsTotal} = res.data

        setSavingsSummary(savingsTotal)
        setTransactionsSummary(savingsTransactionsTotal)
      })
  }, [])


  const createNewSavings = () => {
    const body = {...newSavings}

    axios.post('/api/saving', body)
      .then(res => {
        refreshSavings()
        refreshTransactions()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const createSavingsTransaction = () => {
    const body = {...newSavingsTransaction}

    axios.post('/api/saving/transaction', body)
      .then(res => {
        refreshSavings()
        refreshTransactions()
      })
      .catch(err => {
        console.log(err)
      })
  }


  const accountSelects = savings.map((account) => {
    return (
      <option key={account.saving_id} value={account.saving_id}>{account.name}</option>
    )
  })

  const savingsView = savings.map(saving => {
    return (
      <SavingsView key={saving.saving_id} saving={saving} refreshSavings={refreshSavings} refreshTransactions={refreshTransactions}/>
    )
  })

  const savingTransactionsView = savingsTransactions.map(transaction => {
    return (
      <SavingsTransactionView key={transaction.saving_transaction_id} transaction={transaction} accounts={savings} refreshSavings={refreshSavings} refreshTransactions={refreshTransactions}/>
    )
  })

  return (
    <div>
      
      <h3>Savings - {getMonth()}</h3>
      
      <div className="split-form-wrapper">

        <div className="form-wrapper new-savings">
          <h4>New Savings</h4>

          <form>
            <div className="form-inputs">
              <label htmlFor="name">Name:</label>
              <input id="name" value={newSavings.name} onChange={(evt) => setNewSavings({...newSavings, name: evt.target.value})} placeholder="Name"/>
            </div>

            <div className="form-inputs">
              <label htmlFor="amount">Amount:</label>
              <input id="amount" value={newSavings.amount} onChange={(evt) => setNewSavings({...newSavings, amount: evt.target.value})} placeholder="Amount" type="number"/>
            </div>

          </form>

          <button onClick={(e) => {
            e.preventDefault()
            createNewSavings()
          }}>Add</button>

        </div>

        <div className="form-wrapper new-savings-transaction-form">
          <h4>New Savings Transaction</h4>

          <form>
            <div className="form-inputs">
              <label htmlFor="account">Account:</label>
              <select
                id="account"
                value={newSavingsTransaction.saving_id}
                onChange={evt => setNewSavingsTransaction({...newSavingsTransaction, saving_id: evt.target.value})}
              >
                <option value='default' disabled>Select Account</option>
                {accountSelects}
              </select>
            </div>

            <div className="form-inputs">
              <label htmlFor="amount">Amount:</label>
              <input id="amount" value={newSavingsTransaction.amount} onChange={(evt) => setNewSavingsTransaction({...newSavingsTransaction, amount: evt.target.value})} placeholder="Amount" type="number"/>
            </div>

            <div className="form-inputs">
              <label htmlFor="type">Type:</label>
              <select
                id="type"
                value={newSavingsTransaction.type}
                onChange={evt => setNewSavingsTransaction({...newSavingsTransaction, type: evt.target.value})}
              >
                <option value='default' disabled>Select Type</option>
                <option value='Deposit'>Deposit</option>
                <option value='Withdrawl'>Withdrawl</option>
              </select>
            </div>

            <div className="form-inputs">
              <label htmlFor="date">Date:</label>
              <input
                id="date"
                placeholder="Date"
                type="date"
                value={newSavingsTransaction.date}
                onChange={(evt) =>
                  setNewSavingsTransaction({
                    ...newSavingsTransaction,
                    date: formatDate(evt.target.value),
                  })
                }
              />
            </div>

          </form>

          <button onClick={(e) => {
            e.preventDefault()
            createSavingsTransaction()
          }}>Add</button>

        </div>

      </div>

      <div className="split-tables">

        <div className="split-table-wrapper">
          <table>
            <caption>Savings</caption>

            <tbody>
              <tr className="summary-table-row">
                <td className="name-td savings-name-td"></td>
                <td className="savings-amount-td">Amount</td>
                <td className="change-td">Change</td>
                <td className="delete-td"></td>
              </tr>
              <tr className="summary-table-row">
                <td className="name-td savings-name-td">Totals</td>
                <td className="savings-amount-td">$ {savingsSummary}</td>
                <td className="change-td">$ {transactionSummary}</td>
                <td className="delete-td"></td>
              </tr>
            </tbody>

            <tbody>
              {savings.length > 0 ? (
                  savingsView
                ) : (
                  <tr>
                    <td className="no-data-row">No Savings to show</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        <div className="split-table-wrapper">
          <table>
            <caption>Transactions</caption>

            <tbody>
              {savingsTransactions.length > 0 ? (
                  savingTransactionsView
                ) : (
                  <tr>
                    <td className="no-data-row">No Savings to show</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default Savings