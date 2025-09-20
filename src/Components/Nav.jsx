import { NavLink } from "react-router"

function Nav () {

  return (
    <nav>
      <NavLink to={'/'}>Home</NavLink>
      <NavLink to={'/budget'}>Budget</NavLink>
      <NavLink to={'/transactions'}>Transactions</NavLink>
    </nav>
  )
}

export default Nav