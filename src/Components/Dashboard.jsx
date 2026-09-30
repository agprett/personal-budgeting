import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts';

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#d4c4f8', '#4d495b', '#f5effd', '#0b6696', '#494657', '#086a07',  '#1b0c31', '#604469']

const tooltipStyle = {
  backgroundColor: '#0a1628',
  border: '1px solid #162d55',
  borderRadius: '6px',
  color: '#e2e8f0',
  fontSize: '12px',
  fontFamily: 'JetBrains Mono, monospace',
};

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4">
      <div className="text-[10px] text-[#3a5070] uppercase tracking-widest mb-2">{label}</div>
      <div className="text-xl sm:text-2xl font-mono font-medium" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-[#3a5070] mt-1">{sub}</div>}
    </div>
  );
}

function Dashboard () {
  const [data, setData] = useState({cashFlow: {total: 0, breakdown: {income: [], expense: []}}, budgetUsed: {used: 0, budgeted: 0}, totalSaved: 0, activeGoals: 0, totalDebt: 0, debtAccounts: 0, budgets: [], savings: [], debts: [], transactions: []})

  useEffect(() => {
    axios.get('/api/summary/dashboard')
      .then(res => {
        setData(res.data)
      })
  }, [])

  const debtBar = data.debts.map(d => ({
    name: d.name.length > 12 ? d.name.slice(0, 12) + '…' : d.name,
    remaining: d.remaining,
    paid: d.paid,
  }));

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#3a5070] mt-1">September 2026</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Net Cash Flow This Month" value={`${data.cashFlow.total >= 0 ? '+' : '-'}$${Math.abs(data.cashFlow.total).toLocaleString()}`} sub="Income minus expenses" color={data.cashFlow.total >= 0 ? '#10b981' : '#ef4444'} />
        <StatCard label="Budget Used" value={`${data.budgetUsed.budgeted > 0 ? Math.round((data.budgetUsed.used / data.budgetUsed.budgeted) * 100) : 0}%`} sub={`$${data.budgetUsed.used.toLocaleString()} of $${data.budgetUsed.budgeted.toLocaleString()}`} color="#38bdf8" />
        <StatCard label="Total Saved" value={`$${data.totalSaved.toLocaleString()}`} sub={`${data.activeGoals} active goals`} color="#10b981" />
        <StatCard label="Total Debt" value={`$${data.totalDebt.toLocaleString()}`} sub={`${data.debtAccounts} accounts`} color="#ef4444" />
      </div>

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
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => `$${v.toLocaleString()}`} />
            <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#incGrad)" name="Income" />
            <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expGrad)" name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div> */}

      {/* Budget + Savings row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Budget pie */}
        <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-[#38bdf8] uppercase tracking-widest font-semibold mb-0.5">Budget</div>
              <div className="text-sm text-white">Spent vs. Allocated</div>
            </div>
            {/* <button onClick={() => onNavigate('budget')} className="text-[10px] text-[#3a5070] hover:text-[#38bdf8] transition-colors cursor-pointer uppercase tracking-wider">Manage →</button> */}
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={data.budgets.map((c, i) => ({ name: c.name.length > 8 ? c.name.slice(0, 8) + '…' : c.name, Spent: Math.abs(c.spent), Remaining: Math.max(c.allocated + c.spent, 0), color: colors[i % (colors.length - 1)] }))} barSize={18}>
              <XAxis dataKey="name" tick={{ fill: '#3a5070', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#3a5070', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={32} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `$${v.toLocaleString()}`} />
              <Bar dataKey="Spent" stackId="a" radius={[0, 0, 0, 0]}>
                {data.budgets.map((c, i) => <Cell key={i} fill={colors[i % (colors.length - 1)]} />)}
              </Bar>
              <Bar dataKey="Remaining" stackId="a" fill="#0f2040" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Savings pie */}
        <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-[#38bdf8] uppercase tracking-widest font-semibold mb-0.5">Savings</div>
              <div className="text-sm text-white">Total Saved</div>
            </div>
            {/* <button onClick={() => onNavigate('savings')} className="text-[10px] text-[#3a5070] hover:text-[#38bdf8] transition-colors cursor-pointer uppercase tracking-wider">View →</button> */}
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={data.savings.map((g, i) => ({ name: g.name, value: +g.amount, color: colors[i % (colors.length - 1)] }))} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                {data.savings.map((g, i) => <Cell key={i} fill={colors[i % (colors.length - 1)]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `$${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
            {data.savings.slice(0, 4).map((g, i) => (
              <div key={g.saving_id} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i % (colors.length - 1)] }} />
                <span className="text-[10px] text-[#5a7ba0] truncate">{g.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

     {/* Debt bar */}
      <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-[#38bdf8] uppercase tracking-widest font-semibold mb-0.5">Debts</div>
            <div className="text-sm text-white">Remaining vs. Paid Off</div>
          </div>
          {/* <button onClick={() => onNavigate('debts')} className="text-[10px] text-[#3a5070] hover:text-[#38bdf8] transition-colors cursor-pointer uppercase tracking-wider">Manage →</button> */}
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={debtBar} layout="vertical">
            <XAxis type="number" tick={{ fill: '#3a5070', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#5a7ba0', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => `$${v.toLocaleString()}`} />
            <Bar dataKey="paid" stackId="a" fill="#3b82f6" name="Paid" />
            <Bar dataKey="remaining" stackId="a" fill="#ef4444" name="Remaining" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent transactions */}
      <div className="bg-[#0a1628] border border-[#0f2040] rounded-lg p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-[#38bdf8] uppercase tracking-widest font-semibold mb-0.5">Transactions</div>
            <div className="text-sm text-white">Recent Activity</div>
          </div>
          {/* <button onClick={() => onNavigate('transactions')} className="text-[10px] text-[#3a5070] hover:text-[#38bdf8] transition-colors cursor-pointer uppercase tracking-wider">View All →</button> */}
        </div>
        <div className="space-y-0">
          {data.transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-[#0f2040] last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-7 h-7 rounded flex-shrink-0 flex items-center justify-center text-xs ${tx.type === 'Income' || tx.type === 'Payment' || tx.type === 'Deposit' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
                  {tx.type === 'Income' || tx.type === 'Payment' || tx.type === 'Deposit' ? '↑' : '↓'}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-white truncate">{tx.name}</div>
                  <div className="text-[10px] text-[#3a5070]">{tx.category} · {tx.date}</div>
                </div>
              </div>
              <div className={`text-sm font-mono font-medium flex-shrink-0 ml-3 ${tx.type === 'Income' || tx.type === 'Payment' || tx.type === 'Deposit' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard