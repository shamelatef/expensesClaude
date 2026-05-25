import { useState, useEffect } from 'react'
import { supabase, isConfigured } from './lib/supabase'
import Summary from './components/Summary'
import AddExpenseForm from './components/AddExpenseForm'
import ExpenseList from './components/ExpenseList'
import CategoryManager from './components/CategoryManager'
import './App.css'

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setError(null)
    const [catsRes, expsRes] = await Promise.all([
      supabase.from('categories').select('*').order('created_at'),
      supabase
        .from('expenses')
        .select('*, categories(name, color)')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false }),
    ])
    if (catsRes.error || expsRes.error) {
      setError('Could not load data. Check your Supabase credentials.')
    } else {
      setCategories(catsRes.data || [])
      setExpenses(expsRes.data || [])
    }
    setLoading(false)
  }

  async function addExpense(expense) {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select('*, categories(name, color)')
    if (!error && data) {
      setExpenses(prev => [data[0], ...prev])
    }
  }

  async function deleteExpense(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) {
      setExpenses(prev => prev.filter(e => e.id !== id))
    }
  }

  async function addCategory(name, color) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, color }])
      .select()
    if (!error && data) {
      setCategories(prev => [...prev, data[0]])
    }
  }

  const filtered =
    activeCategory === 'All'
      ? expenses
      : expenses.filter(e => e.categories?.name === activeCategory)

  return (
    <div className="app">
      <header className="header">
        <h1>Expense Tracker</h1>
        <p className="subtitle">Food · Fun · Car · GYM · Med &amp; more</p>
      </header>

      {!isConfigured && (
        <div className="setup-banner">
          <strong>Setup required:</strong> Copy <code>.env.example</code> to{' '}
          <code>.env</code> and add your Supabase URL and anon key, then run{' '}
          <code>npm run dev</code>.
        </div>
      )}

      {error && (
        <div className="error-banner">{error}</div>
      )}

      {loading ? (
        <div className="loading">Loading…</div>
      ) : (
        <main>
          <Summary expenses={expenses} categories={categories} />
          <div className="main-grid">
            <div className="left-panel">
              <AddExpenseForm categories={categories} onAdd={addExpense} />
              <CategoryManager categories={categories} onAdd={addCategory} />
            </div>
            <div className="right-panel">
              <ExpenseList
                expenses={filtered}
                categories={categories}
                activeCategory={activeCategory}
                onFilter={setActiveCategory}
                onDelete={deleteExpense}
              />
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
