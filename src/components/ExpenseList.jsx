import { useState } from 'react'

function formatDateHeader(dateStr) {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (dateStr === today) return 'Today'
  if (dateStr === yesterday) return 'Yesterday'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function groupByDate(expenses) {
  const groups = {}
  for (const exp of expenses) {
    if (!groups[exp.date]) groups[exp.date] = []
    groups[exp.date].push(exp)
  }
  // Return sorted descending by date
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
}

export default function ExpenseList({ expenses, categories, activeCategory, onFilter, onDelete }) {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const hasDateFilter = fromDate || toDate

  const filtered = expenses.filter(exp => {
    if (fromDate && exp.date < fromDate) return false
    if (toDate && exp.date > toDate) return false
    return true
  })

  const grouped = groupByDate(filtered)

  const totalFiltered = filtered.reduce((sum, e) => sum + Number(e.amount), 0)

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
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>
          <span className="date-sep">→</span>
          <div className="date-field">
            <label>To</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          {hasDateFilter && (
            <button type="button" className="btn-clear" onClick={() => { setFromDate(''); setToDate('') }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">No expenses found.</p>
      ) : (
        <div className="expense-days">
          {grouped.map(([date, dayExpenses]) => {
            const dayTotal = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
            return (
              <div key={date} className="day-group">
                <div className="day-header">
                  <span className="day-label">{formatDateHeader(date)}</span>
                  <span className="day-total">EGP {dayTotal.toFixed(2)}</span>
                </div>
                <ul className="expense-items">
                  {dayExpenses.map(exp => (
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
                        </span>
                      </div>
                      <span className="expense-amount">EGP {Number(exp.amount).toFixed(2)}</span>
                      <button
                        className="btn-delete"
                        onClick={() => onDelete(exp.id)}
                        title="Delete"
                      >×</button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}

          {/* Grand total when date filter is active */}
          {hasDateFilter && (
            <div className="range-total">
              <span>Total for period</span>
              <span>EGP {totalFiltered.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
