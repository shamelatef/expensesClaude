import { useState } from 'react'

export default function ExpenseList({ expenses, categories, activeCategory, onFilter, onDelete }) {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const hasDateFilter = fromDate || toDate

  const filtered = expenses.filter(exp => {
    if (fromDate && exp.date < fromDate) return false
    if (toDate && exp.date > toDate) return false
    return true
  })

  function clearDates() {
    setFromDate('')
    setToDate('')
  }

  return (
    <div className="card expense-list">
      <div className="list-header">
        <h2>Expenses</h2>
        <span className="count">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Category filter tabs */}
      <div className="filter-tabs">
        <button
          className={`tab${activeCategory === 'All' ? ' active' : ''}`}
          onClick={() => onFilter('All')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`tab${activeCategory === cat.name ? ' active' : ''}`}
            style={
              activeCategory === cat.name
                ? { background: cat.color, color: '#fff', borderColor: cat.color }
                : {}
            }
            onClick={() => onFilter(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Date range filter */}
      <div className="date-range">
        <div className="date-range-inputs">
          <div className="date-field">
            <label>From</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />
          </div>
          <span className="date-sep">→</span>
          <div className="date-field">
            <label>To</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
            />
          </div>
          {hasDateFilter && (
            <button type="button" className="btn-clear" onClick={clearDates}>
              Clear
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">No expenses found.</p>
      ) : (
        <ul className="expense-items">
          {filtered.map(exp => (
            <li key={exp.id} className="expense-item">
              <div
                className="category-dot"
                style={{ background: exp.categories?.color || '#94a3b8' }}
              />
              <div className="expense-info">
                <span className="expense-desc">
                  {exp.description || exp.categories?.name || 'Expense'}
                </span>
                <span className="expense-meta">
                  <span className="expense-cat" style={{ color: exp.categories?.color }}>
                    {exp.categories?.name}
                  </span>
                  {' · '}
                  {exp.date}
                </span>
              </div>
              <span className="expense-amount">EGP {Number(exp.amount).toFixed(2)}</span>
              <button
                className="btn-delete"
                onClick={() => onDelete(exp.id)}
                title="Delete expense"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
