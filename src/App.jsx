import { Outlet } from 'react-router'

import Nav from './Components/Nav.jsx'

function App() {

  return (
    <>
      <Nav />
      <Outlet />
    </>
  )
}

export default App
