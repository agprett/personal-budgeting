import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts';

function Dashboard () {

  // return (
  //   <div>
  //     Dashboard page
  //   </div>
  // )


  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#3a5070] mt-1">September 2026 — Financial Overview</p>
      </div>

      {/* KPI row */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Net Cash Flow" value={`${net >= 0 ? '+' : ''}$${net.toLocaleString()}`} sub="Income minus expenses" color={net >= 0 ? '#10b981' : '#ef4444'} />
        <StatCard label="Budget Used" value={`${totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0}%`} sub={`$${totalSpent.toLocaleString()} of $${totalBudgeted.toLocaleString()}`} color="#38bdf8" />
        <StatCard label="Total Saved" value={`$${totalSaved.toLocaleString()}`} sub={`${savings.length} active goals`} color="#10b981" />
        <StatCard label="Total Debt" value={`$${totalDebt.toLocaleString()}`} sub={`${debts.length} accounts`} color="#ef4444" />
      </div> */}

      {/* Income vs Expenses */}
      {/* <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-[#38bdf8] uppercase tracking-widest font-semibold mb-0.5">Cash Flow</div>
            <div className="text-sm text-white">Income vs. Expenses — Last 6 Months</div>
          </div>
          <button onClick={() => onNavigate('transactions')} className="text-[10px] text-[#3a5070] hover:text-[#38bdf8] transition-colors cursor-pointer uppercase tracking-wider">View →</button>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: '#3a5070', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#3a5070', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
            <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#incGrad)" name="Income" />
            <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expGrad)" name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div> */}

      {/* Budget + Savings row */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        
        <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-[#38bdf8] uppercase tracking-widest font-semibold mb-0.5">Budget</div>
              <div className="text-sm text-white">Allocation</div>
            </div>
            <button onClick={() => onNavigate('budget')} className="text-[10px] text-[#3a5070] hover:text-[#38bdf8] transition-colors cursor-pointer uppercase tracking-wider">Manage →</button>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={budgetPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                {budgetPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
            {budget.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-[10px] text-[#5a7ba0] truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div> */}

        {/* Savings radial */}
        {/* <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-[#38bdf8] uppercase tracking-widest font-semibold mb-0.5">Savings</div>
              <div className="text-sm text-white">Goal Progress</div>
            </div>
            <button onClick={() => onNavigate('savings')} className="text-[10px] text-[#3a5070] hover:text-[#38bdf8] transition-colors cursor-pointer uppercase tracking-wider">View →</button>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={65} data={savingsRadial} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={3} background />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-1">
            {savings.slice(0, 3).map(g => (
              <div key={g.id} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                  <span className="text-[10px] text-[#5a7ba0] truncate max-w-[100px]">{g.name}</span>
                </div>
                <span className="text-[10px] font-mono text-[#3a5070]">{Math.round((g.current / g.target) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Debt bar */}
      {/* <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-[#38bdf8] uppercase tracking-widest font-semibold mb-0.5">Debts</div>
            <div className="text-sm text-white">Remaining vs. Paid Off</div>
          </div>
          <button onClick={() => onNavigate('debts')} className="text-[10px] text-[#3a5070] hover:text-[#38bdf8] transition-colors cursor-pointer uppercase tracking-wider">Manage →</button>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={debtBar} layout="vertical">
            <XAxis type="number" tick={{ fill: '#3a5070', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#5a7ba0', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
            <Bar dataKey="paid" stackId="a" fill="#3b82f6" name="Paid" />
            <Bar dataKey="remaining" stackId="a" fill="#ef4444" name="Remaining" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      {/* Recent transactions */}
      {/* <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-[#38bdf8] uppercase tracking-widest font-semibold mb-0.5">Transactions</div>
            <div className="text-sm text-white">Recent Activity</div>
          </div>
          <button onClick={() => onNavigate('transactions')} className="text-[10px] text-[#3a5070] hover:text-[#38bdf8] transition-colors cursor-pointer uppercase tracking-wider">View All →</button>
        </div>
        <div className="space-y-0">
          {recentTx.map(tx => (
            <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-[#0f2040] last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-7 h-7 rounded flex-shrink-0 flex items-center justify-center text-xs ${tx.type === 'income' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
                  {tx.type === 'income' ? '↑' : '↓'}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-white truncate">{tx.description}</div>
                  <div className="text-[10px] text-[#3a5070]">{tx.category} · {tx.date}</div>
                </div>
              </div>
              <div className={`text-sm font-mono font-medium flex-shrink-0 ml-3 ${tx.type === 'income' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default Dashboard