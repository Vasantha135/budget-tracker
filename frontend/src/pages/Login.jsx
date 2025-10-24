import React, { useState } from 'react'

export default function Login({ setToken }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else setError('Invalid credentials')
    } catch {
      setError('Server error')
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>

      {/* ✅ Inline CSS Styling */}
      <style>{`
        .login-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #74ABE2, #5563DE);
          font-family: 'Segoe UI', sans-serif;
        }

        form {
          background: #fff;
          padding: 2rem 3rem;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          width: 320px;
          text-align: center;
        }

        h2 {
          margin-bottom: 1.5rem;
          color: #333;
          letter-spacing: 0.5px;
        }

        input {
          display: block;
          width: 100%;
          padding: 10px 12px;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 15px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        input:focus {
          outline: none;
          border-color: #5563DE;
          box-shadow: 0 0 4px rgba(85, 99, 222, 0.3);
        }

        button {
          width: 100%;
          padding: 10px 0;
          border: none;
          background-color: #5563DE;
          color: #fff;
          font-size: 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s;
        }

        button:hover {
          background-color: #3e4bbd;
        }

        .error {
          color: #d9534f;
          font-size: 14px;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  )
}
