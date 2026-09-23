import { Outlet } from 'react-router'

import Nav from './Components/Nav.jsx'

function App() {

  return (
    <div className="flex min-h-screen bg-[#050d1a]">
      <Nav />
      <main className="flex-1 overflow-auto pt-14 pb-16 md:pt-0 md:pb-0">
        <Outlet />
      </main>
    </div>
  )
}

export default App
