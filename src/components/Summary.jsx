export default function Summary({ expenses, categories }) {
  const today = new Date().toISOString().split('T')[0]

  const todayExpenses = expenses.filter(e => e.date === today)
  const todayTotal = todayExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const byCategory = categories.map(cat => ({
    ...cat,
    todayTotal: todayExpenses
      .filter(e => e.category_id === cat.id)
      .reduce((sum, e) => sum + Number(e.amount), 0),
  }))

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="summary">
      <div className="total-card">
        <div>
          <div className="total-label">Today · {todayLabel}</div>
          <div className="total-amount">EGP {todayTotal.toFixed(2)}</div>
        </div>
        <div className="total-count">{todayExpenses.length} expense{todayExpenses.length !== 1 ? 's' : ''} today</div>
      </div>
      <div className="category-cards">
        {byCategory.map(cat => (
          <div key={cat.id} className="cat-card" style={{ borderTopColor: cat.color }}>
            <span className="cat-name">{cat.name}</span>
            <span className="cat-total">EGP {cat.todayTotal.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
