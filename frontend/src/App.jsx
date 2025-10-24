import React, { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  if (!token) return <Login setToken={setToken} />
  return (
    <div>
      <header className="header">
        <h1>Budget Tracker</h1>
        <button onClick={() => { localStorage.removeItem('token'); setToken(null); }}>Logout</button>
      </header>
      <Dashboard token={token} />
    </div>
  )
}
