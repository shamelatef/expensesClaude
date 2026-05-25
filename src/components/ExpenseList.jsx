export default function ExpenseList({ expenses, categories, activeCategory, onFilter, onDelete }) {
  return (
    <div className="card expense-list">
      <div className="list-header">
        <h2>Expenses</h2>
        <span className="count">{expenses.length} item{expenses.length !== 1 ? 's' : ''}</span>
      </div>

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

      {expenses.length === 0 ? (
        <p className="empty">No expenses yet — add one!</p>
      ) : (
        <ul className="expense-items">
          {expenses.map(exp => (
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
