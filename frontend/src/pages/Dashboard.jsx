import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

export default function Dashboard({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    amount: '',
    note: '',
    transaction_type: 'EX',
    category: '',
    date: '',
  });

  const loadTransactions = () => {
    fetch('http://127.0.0.1:8000/api/transactions/', {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data.results || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadTransactions();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://127.0.0.1:8000/api/transactions/${editingId}/`
      : 'http://127.0.0.1:8000/api/transactions/';
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to save');
        return res.json();
      })
      .then(() => {
        alert(editingId ? 'Updated successfully!' : 'Added successfully!');
        setForm({ amount: '', note: '', transaction_type: 'EX', category: '', date: '' });
        setEditingId(null);
        loadTransactions();
      })
      .catch((err) => alert(err.message));
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setForm({
      amount: t.amount,
      note: t.note,
      transaction_type: t.transaction_type,
      category: t.category_name || t.category || '',
      date: t.date,
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    fetch(`http://127.0.0.1:8000/api/transactions/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          alert('Deleted successfully!');
          loadTransactions();
        } else {
          alert('Failed to delete.');
        }
      })
      .catch((err) => alert(err.message));
  };

  useEffect(() => {
    const svg = d3.select('#chart').attr('width', 500).attr('height', 250);
    svg.selectAll('*').remove();

    if (!transactions.length) return;

    const x = d3.scaleBand()
      .domain(transactions.map((d) => d.note))
      .range([0, 500])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(transactions, (d) => d.amount)])
      .range([250, 0]);

    svg
      .selectAll('rect')
      .data(transactions)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.note))
      .attr('y', (d) => y(d.amount))
      .attr('width', x.bandwidth())
      .attr('height', (d) => 250 - y(d.amount))
      .attr('rx', 5)
      .attr('fill', (d) => (d.transaction_type === 'IN' ? '#4CAF50' : '#E53935'))
      .append('title')
      .text((d) => `${d.note}: ₹${d.amount}`);
  }, [transactions]);

  return (
    <div className="dashboard">
      <h2>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>

      <form className="tx-form" onSubmit={handleSubmit}>
        <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <select name="transaction_type" value={form.transaction_type} onChange={handleChange}>
          <option value="EX">Expense</option>
          <option value="IN">Income</option>
        </select>
        <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input type="text" name="note" placeholder="Note" value={form.note} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && (
          <button
            type="button"
            className="cancel"
            onClick={() => {
              setEditingId(null);
              setForm({ amount: '', note: '', transaction_type: 'EX', category: '', date: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Your Transactions</h2>
      <table className="tx-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.category_name || t.category}</td>
              <td className={t.transaction_type === 'IN' ? 'income' : 'expense'}>
                {t.transaction_type === 'IN' ? 'Income' : 'Expense'}
              </td>
              <td>₹{t.amount}</td>
              <td>{t.note}</td>
              <td>
                <button onClick={() => handleEdit(t)}>✏️</button>
                <button onClick={() => handleDelete(t.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Chart View</h3>
      <svg id="chart"></svg>

      {/* ✅ Elegant built-in CSS */}
      <style>{`
        .dashboard {
          max-width: 900px;
          margin: 30px auto;
          padding: 20px;
          background: #f9f9ff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          font-family: 'Segoe UI', sans-serif;
        }

        h2, h3 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }

        .tx-form {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: 25px;
        }

        .tx-form input, .tx-form select {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          min-width: 130px;
          transition: 0.2s;
        }

        .tx-form input:focus, .tx-form select:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
          outline: none;
        }

        .tx-form button {
          background: #5563DE;
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s;
        }

        .tx-form button:hover {
          background: #3948b8;
        }

        .tx-form .cancel {
          background: #d9534f;
        }

        .tx-form .cancel:hover {
          background: #b52b27;
        }

        .tx-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
        }

        .tx-table th, .tx-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
          text-align: center;
          font-size: 15px;
        }

        .tx-table th {
          background-color: #5563DE;
          color: #fff;
        }

        .tx-table tr:hover {
          background: #f1f3ff;
        }

        .tx-table .income {
          color: #4CAF50;
          font-weight: bold;
        }

        .tx-table .expense {
          color: #E53935;
          font-weight: bold;
        }

        button {
          cursor: pointer;
        }

        #chart {
          display: block;
          margin: 20px auto;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
