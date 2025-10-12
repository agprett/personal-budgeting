import axios from "axios"
import { useEffect, useRef, useState } from "react"

const formatDate = (date) => {
  let objDate = new Date(date)

  let splitDate = objDate.toISOString().split('T')[0].split('-')

  let formattedDate = `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`

  return formattedDate
}

const today = new Date()

function SavingsTransactionView ({transaction, accounts, refreshSavings, refreshTransactions}) {
  const accountRef = useRef(null)
  const [editAccount, setEditAccount] = useState(false)

  const amountRef = useRef(null)
  const [editAmount, setEditAmount] = useState(false)
  
  const dateRef = useRef(null)
  const [editDate, setEditDate] = useState(false)
  
  const typeRef = useRef(null)
  const [editType, setEditType] = useState(false)

  const [saving, setSaving] = useState(transaction.Saving.saving_id || 'default')
  const [amount, setAmount] = useState(transaction.amount || 0)
  const [date, setDate] = useState(transaction.date || formatDate(today))
  const [type, setType] = useState(transaction.type || 'None?')

  useEffect(() => {
    if (editAccount && accountRef.current) {
      setTimeout(() => {
        accountRef.current.focus();
      }, 0)
    }
  }, [editAccount])

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
  

  useEffect(() => {
    if (editType && typeRef.current) {
      setTimeout(() => {
        typeRef.current.focus();
      }, 0)
    }
  }, [editType])

  const updateTransaction = (updatedTransaction) => {
    axios.put('/api/saving/transaction', {saving_transaction_id: transaction.saving_transaction_id, saving_id: transaction.Saving.saving_id, ...updatedTransaction})
      .then(res => {
        refreshSavings()
        refreshTransactions()
      })
      .catch(err => {
        console.log(err)
      })
  }
  

  const deleteSavingsTransaction = (id) => {
    axios.delete(`/api/saving/transaction/${id}`)
      .then(res => {
        refreshSavings()
        refreshTransactions()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const accountSelects = accounts.map((account) => {
    return (
      <option key={account.saving_id} value={account.saving_id}>{account.name}</option>
    )
  })

  return (
    <tr>
      <td className="name-td account-td">
        {editAccount ? (
          <select
            id="account"
            autoFocus
            value={saving}
            onChange={evt => {
              setSaving(evt.target.value)
              updateTransaction({saving: evt.target.value})
              setEditAccount(false)
            }}
            onBlur={() => setEditAccount(false)}
          >
            <option value='default' disabled>Select Account</option>
            {accountSelects}
          </select>
        ) : (
          <p onClick={() => setEditAccount(true)}>{transaction.Saving.name}</p>
        )}
      </td>

      <td className="savings-amount-td">
        {editAmount ? (
          <input
            value={amount}
            placeholder="Amount"
            type="number"
            ref={amountRef}
            onChange={(evt) => setAmount(+evt.target.value)}
            onKeyDown={(evt) => {
              if(evt.key === 'Enter') {
                setEditAmount(false)
                updateTransaction({amount})
              }
            }}
            onBlur={() => {
              setEditAmount(false)
              updateTransaction({amount})
            }}
          />
        ) : (
          <p onClick={() => setEditAmount(true)}>$ {amount}</p>
        )}
      </td>

      <td className="savings-date-td">
        {editDate ? (
          <input
            placeholder="Date"
            type="date"
            value={date}
            ref={dateRef}
            onChange={(evt) => {
              setDate(evt.target.value)
            }}
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

      <td className="savings-type-td">
        {editType ? (
          <select
            id="type"
            value={type}
            ref={typeRef}
            onChange={evt => {
              setType(evt.target.value)
              updateTransaction({type: evt.target.value})
              setEditType(false)
            }}
          >
            <option value='default' disabled>Select Type</option>
            <option value='Deposit'>Deposit</option>
            <option value='Withdrawl'>Withdrawl</option>
          </select>
        ) : (
          <p onClick={() => setEditType(true)}>{transaction.type}</p>
        )}
      </td>


      {/* 
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
      */}

      <td className="delete-td">
        <button onClick={() => deleteSavingsTransaction(transaction.saving_transaction_id)}>Delete</button>
      </td>
    </tr>
  )
}

export default SavingsTransactionView