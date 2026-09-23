import { NavLink, useLocation } from "react-router"

const navItems = [
  { id: '', label: 'Dashboard' },
  { id: 'budget', label: 'Budget' },
  { id: 'savings', label: 'Savings' },
  { id: 'debts', label: 'Debts' },
  { id: 'transactions', label: 'Transactions' },
]

function Nav () {
  const location = useLocation()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-[#030a15] border-r border-[#0f2040] flex-shrink-0">
        <div className="px-6 py-6 border-b border-[#0f2040]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#1d6dce] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">Budgeting</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(item => {
            const active = location.pathname === `/${item.id}`
            
            return (
              <NavLink
                key={item.id}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer ${
                  active
                    ? 'bg-[#1d3a6a] text-white'
                    : 'text-[#5a7ba0] hover:text-[#93c5fd] hover:bg-[#0a1628]'
                }`}
                to={`/${item.id}`}
              >
                {/* <span className={active ? 'text-[#38bdf8]' : ''}>{item.icon}</span> */}
                {item.label}
                {active && <span className="ml-auto w-1 h-4 rounded-full bg-[#38bdf8]" />}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#030a15] border-b border-[#0f2040] px-4 py-3 flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-[#1d6dce] flex items-center justify-center flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>
        <span className="text-white font-semibold text-sm tracking-wide">Budget</span>
        <span className="ml-auto text-xs text-[#38bdf8] font-medium capitalize">{location.pathname.split('/')[1] || 'Dashboard'}</span>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#030a15] border-t border-[#0f2040] flex">
        {navItems.map(item => {
          const active = location.pathname === `/${item.id}`;
          return (
            <NavLink
              key={item.id}
              to={`/${item.id}`}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors cursor-pointer ${
                active ? 'text-[#38bdf8]' : 'text-[#3a5070]'
              }`}
            >
              {/* {item.icon} */}
              <span className="text-[9px] font-medium uppercase tracking-wider leading-none">
                {item.label === 'Transactions' ? 'Txns' : item.label}
              </span></NavLink>
          );
        })}
      </nav>
    </>
  );
}

export default Nav