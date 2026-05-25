export default function Summary({ expenses, categories }) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  const byCategory = categories.map(cat => ({
    ...cat,
    total: expenses
      .filter(e => e.category_id === cat.id)
      .reduce((sum, e) => sum + Number(e.amount), 0),
  }))

  return (
    <div className="summary">
      <div className="total-card">
        <div>
          <div className="total-label">Total Spent</div>
          <div className="total-amount">EGP {total.toFixed(2)}</div>
        </div>
        <div className="total-count">{expenses.length} expenses</div>
      </div>
      <div className="category-cards">
        {byCategory.map(cat => (
          <div key={cat.id} className="cat-card" style={{ borderTopColor: cat.color }}>
            <span className="cat-name">{cat.name}</span>
            <span className="cat-total">EGP {cat.total.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
