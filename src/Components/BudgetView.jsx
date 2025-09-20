import axios from "axios"
import { useEffect, useRef, useState } from "react"

function BudgetView({ budget, refreshBudgets, refreshSummaries }) {
  const nameRef = useRef(null)
  const [editName, setEditName] = useState(false)
  const [name, setName] = useState(budget.name || '')

  const amountRef = useRef(null)
  const [editAmount, setEditAmount] = useState(false)
  const [amount, setAmount ] = useState(budget.amount || 0)

  const typeRef = useRef(null)
  const [editType, setEditType] = useState(false)
  const [type, setType] = useState(budget.type || 'expense')

  const [actual, setActual] = useState(budget.actual || 0)

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

  const updateBudget = (updatedBudget) => {
    axios.put('http://localhost:6789/api/budget', updatedBudget)
      .then(res => {
        console.log(res.data)

        refreshBudgets()
        refreshSummaries()
      })
      .catch(err => {
        console.log(err)
      })
    }
    
    const deleteBudget = (id) => {
      axios.delete(`http://localhost:6789/api/budget/${id}`)
      .then(res => {
        console.log(res.data)
        
        refreshBudgets()
        refreshSummaries()
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <tr>
      <td className="name-td">
        {editName ? (
          <input
            value={name}
            ref={nameRef}
            onChange={evt => setName(evt.target.value)}
            onKeyDown={(evt) => {
              if(evt.key ==='Enter')
                setEditName(false)
              updateBudget({...budget, name: evt.target.value})
            }}
            onBlur={(evt) => {
              setEditName(false)
              updateBudget({...budget, name: evt.target.value})
            }}
            />
          ) : (
            <p className="budget-name" onClick={() => setEditName(true)}>{name}</p>
        )}
    </td>

      <td className="amount-td">
        {editAmount ? (
          <input
          value={amount}
          type="number"
          ref={amountRef}
          onChange={evt => setAmount(evt.target.value)}
          onKeyDown={(evt) => {
            if(evt.key ==='Enter')
              setEditAmount(false)
            updateBudget({...budget, amount: evt.target.value})
          }}
          onBlur={(evt) => {
            setEditAmount(false)
            updateBudget({...budget, amount: evt.target.value})
          }}
          />
        ) : (
          <p onClick={() => setEditAmount(true)}>$ {amount}</p>
        )}
      </td>

      <td className="planned-td">$ {actual}</td>

      <td className="actual-td">$ {amount - actual}</td>

      {/* <td>
        {editType ? (
          <select
          value={type}
          ref={typeRef}
          autoFocus
          onLoad={() => typeRef.current.focus()}
          onChange={evt => {
            setType(evt.target.value)
            setEditType(false)
            updateBudget({...budget, type: evt.target.value})
          }}
          onBlur={() => {
            setEditType(false)
          }}
          >
            <option value='default' disabled>Select Option</option>
            <option value='expense'>Expense</option>
            <option value='income'>Income</option>
          </select>
        ) : (
          <h4 onClick={() => {
            setEditType(true)
          }}>{type}</h4>
        )}
      </td> */}

      <td className="delete-td">
        <button onClick={() => deleteBudget(budget.budget_id)}>Delete</button>
      </td>
    </tr>
  )
}

export default BudgetView