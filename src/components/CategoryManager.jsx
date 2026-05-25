import { useState } from 'react'

const COLOR_PALETTE = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e',
]

export default function CategoryManager({ categories, onAdd }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLOR_PALETTE[6])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Category already exists')
      return
    }
    setError('')
    setLoading(true)
    await onAdd(trimmed, color)
    setName('')
    setColor(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)])
    setLoading(false)
    setOpen(false)
  }

  return (
    <div className="card category-manager">
      <div className="category-header" onClick={() => setOpen(o => !o)}>
        <h2>Categories</h2>
        <button type="button" className="btn-icon" aria-label="Toggle">
          {open ? '−' : '+'}
        </button>
      </div>

      <div className="category-chips">
        {categories.map(cat => (
          <span
            key={cat.id}
            className="chip"
            style={{ background: cat.color + '20', color: cat.color, borderColor: cat.color + '60' }}
          >
            {cat.name}
          </span>
        ))}
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="add-category-form">
          <input
            type="text"
            placeholder="New category name"
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            required
          />
          {error && <span className="form-error">{error}</span>}
          <div className="color-picker">
            {COLOR_PALETTE.map(c => (
              <button
                key={c}
                type="button"
                className={`color-dot${color === c ? ' selected' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                title={c}
              />
            ))}
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding…' : 'Add Category'}
          </button>
        </form>
      )}
    </div>
  )
}
