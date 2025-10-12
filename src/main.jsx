import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import './reset.css'
import './index.css'

import App from './App.jsx'
import Dashboard from './Components/Dashboard.jsx'
import Budget from './Components/Budget.jsx'
import Transactions from './Components/Transactions.jsx'
import Savings from './Components/Savings.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'budget',
        element: <Budget />
      },
      {
        path: 'transactions',
        element: <Transactions />
      },
      {
        path: 'savings',
        element: <Savings />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
