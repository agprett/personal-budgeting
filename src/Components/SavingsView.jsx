import axios from "axios"
import { useEffect, useRef, useState } from "react"

function SavingsView ({saving, refreshSavings, refreshTransactions}) {
  const nameRef = useRef(null)
  const [editName, setEditName] = useState(false)
  const [name, setName] = useState(saving.name || '')

  const amountRef = useRef(null)
  const [editAmount, setEditAmount] = useState(false)
  const [amount, setAmount ] = useState(saving.amount || 0)

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

  return (
    <tr>
      <td className="name-td savings-name-td">
        {editName ? (
          <input
            value={name}
            ref={nameRef}
            onChange={evt => setName(evt.target.value)}
            onKeyDown={(evt) => {
              if(evt.key ==='Enter'){
                setEditName(false)
                updateSaving({...saving, name: evt.target.value})
              }
            }}
            onBlur={(evt) => {
              setEditName(false)
              updateSaving({...saving, name: evt.target.value})
            }}
          />
        ) : (
          <p className="budget-name" onClick={() => setEditName(true)}>{name}</p>
        )}
      </td>

      <td className="savings-amount-td">
        {editAmount ? (
          <input
            value={amount}
            type="number"
            ref={amountRef}
            onChange={evt => setAmount(evt.target.value)}
            onKeyDown={(evt) => {
              if(evt.key ==='Enter'){
                setEditAmount(false)
                updateSaving({...saving, amount: evt.target.value})
              }
            }}
            onBlur={(evt) => {
              setEditAmount(false)
              updateSaving({...saving, amount: evt.target.value})
            }}
          />
        ) : (
          <p onClick={() => setEditAmount(true)}>$ {amount}</p>
        )}
      </td>


      <td className="change-td">$ {saving.change || 0}</td>


      <td className="delete-td">
        <button onClick={() => deleteSaving(saving.saving_id)}>Delete</button>
      </td>
    </tr>
  )
}

export default SavingsView