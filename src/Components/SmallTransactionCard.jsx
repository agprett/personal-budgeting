import EdittingField from "./EdittingField.jsx"

function SmallTransactionCard({ transaction, deleteTransaction, options = [], i, updateTransaction}) {
  return (
    <div key={transaction.id} className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-3.5">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded flex-shrink-0 flex items-center justify-center text-sm ${transaction.type === 'Income' || transaction.type === 'Payment' || transaction.type === 'Deposit' ? 'bg-[#10b981]/20 text-[rgb(16,185,129)]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
            {transaction.type === 'Income' || transaction.type === 'Payment' || transaction.type === 'Deposit' ? '↑' : '↓'}
          </div>
          <div className="min-w-0">
            <div className="text-sm text-white">
              {
                transaction.txcat === 'budget' ? (
                  <EdittingField value={transaction.name} onSave={value => updateTransaction({...transaction, name: value})} className="text-white" />
                ) : (
                  transaction.name
                )
              }
            </div>
            <div className="text-[10px] text-[#3a5070] mt-0.5">{transaction.category}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={`text-sm font-mono font-medium ${transaction.type === 'Income' || transaction.type === 'Payment' || transaction.type === 'Deposit' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {transaction.type === 'Income' || transaction.type === 'Payment' || transaction.type === 'Deposit' ? '+' : '-'}$<EdittingField value={Math.abs(transaction.amount)} onSave={value => updateTransaction({...transaction, amount: value})} type="number" className={transaction.type === 'Income' || transaction.type === 'Payment' || transaction.type === 'Deposit' ? 'text-[#10b981]' : 'text-[#ef4444]'} />
          </div>
          <button onClick={() => deleteTransaction(transaction.transaction_id, transaction.txcat)} className="text-[#3a5070] hover:text-[#ef4444] transition-colors cursor-pointer p-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      <div className="pl-11">
        <EdittingField value={transaction.type} onSave={value => updateTransaction({...transaction, type: value})} type="select" options={options} className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${transaction.type === 'Income' || transaction.type === 'Payment' || transaction.type === 'Deposit' ? 'bg-[#10b981]/15 text-[#10b981]' : 'bg-[#ef4444]/15 text-[#ef4444]'}`} />
      </div>
    </div>
  )
}

export default SmallTransactionCard