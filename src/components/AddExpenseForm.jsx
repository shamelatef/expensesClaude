import { useState } from 'react'
import CustomSelect from './CustomSelect'

export default function AddExpenseForm({ categories, onAdd }) {
  const today = new Date().toISOString().split('T')[0]
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(today)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const categoryOptions = categories.map(c => ({
    value: c.id,
    label: c.name,
    color: c.color,
  }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!amount || !categoryId) return
    setLoading(true)
    await onAdd({
      amount: parseFloat(amount),
      description: description.trim() || null,
      category_id: parseInt(categoryId),
      date,
    })
    setAmount('')
    setDescription('')
    setCategoryId('')
    setDate(today)
    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <form className="card add-form" onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      <div className="form-row">
        <label>Amount (EGP)</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label>Category</label>
        <CustomSelect
          value={categoryId}
          onChange={setCategoryId}
          options={categoryOptions}
          placeholder="Select category…"
        />
      </div>

      <div className="form-row">
        <label>Description</label>
        <input
          type="text"
          placeholder="What was this for?"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn-primary" disabled={loading || !categoryId}>
        {loading ? 'Adding…' : success ? '✓ Added!' : 'Add Expense'}
      </button>
    </form>
  )
}
