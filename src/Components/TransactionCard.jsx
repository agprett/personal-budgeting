import axios from "axios"
import { useEffect, useRef, useState } from "react"

import EdittingField from "./EdittingField"

const formatDate = (date) => {
  let objDate = new Date(date)

  let splitDate = objDate.toISOString().split('T')[0].split('-')

  let formattedDate = `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`

  return formattedDate
}

const today = new Date()

function TransactionCard({ transaction, deleteTransaction, options = [], i, updateTransaction }) {
  return (  
    <tr key={transaction.transaction_id} className={`border-b border-[#0a1628] hover:bg-[#0f2040]/50 transition-colors group ${i % 2 !== 0 ? 'bg-[#050d1a]/30' : ''}`}>
      <td className="px-4 py-3 text-xs font-mono text-[#3a5070]">
        <EdittingField value={transaction.date} onSave={value => updateTransaction({...transaction, date: value})} type="date" className="text-[#3a5070]" />
      </td>
      <td className="px-4 py-3 text-sm text-white">
        {
          transaction.txcat === 'budget' ? (
            <EdittingField value={transaction.name} onSave={value => updateTransaction({...transaction, name: value})} className="text-white" />
          ) : (
            transaction.name
          )
        }
      </td>
      <td className="px-4 py-3">
        <span className="text-xs bg-[#0f2040] text-[#5a7ba0] px-2 py-0.5 rounded">
          {transaction.category}
        </span>
      </td>
      <td className="px-4 py-3">
        <EdittingField value={transaction.type} onSave={value => updateTransaction({...transaction, type: value})} type="select" options={options} className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${transaction.type === 'Income' || transaction.type === 'Payment' || transaction.type === 'Deposit' ? 'bg-[#10b981]/15 text-[#10b981]' : 'bg-[#ef4444]/15 text-[#ef4444]'}`} />
      </td>
      <td className={`px-4 py-3 text-sm font-mono font-medium ${transaction.type === 'Income' || transaction.type === 'Payment' || transaction.type === 'Deposit' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
        {transaction.type === 'Income' || transaction.type === 'Payment' || transaction.type === 'Deposit' ? '+' : '-'}$<EdittingField value={Math.abs(transaction.amount)} onSave={value => updateTransaction({...transaction, amount: value})} type="number" className={transaction.type === 'Income' || transaction.type === 'Payment' || transaction.type === 'Deposit' ? 'text-[#10b981]' : 'text-[#ef4444]'} />
      </td>
      <td className="px-4 py-3">
        <button onClick={() => deleteTransaction(transaction.transaction_id, transaction.txcat)} className="opacity-0 group-hover:opacity-100 text-[#3a5070] hover:text-[#ef4444] transition-all cursor-pointer">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </td>
    </tr>
  )
}

export default TransactionCard