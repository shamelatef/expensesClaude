import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import AuthPage from './components/AuthPage'
import Summary from './components/Summary'
import AddExpenseForm from './components/AddExpenseForm'
import ExpenseList from './components/ExpenseList'
import CategoryManager from './components/CategoryManager'
import './App.css'

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load data once logged in
  useEffect(() => {
    if (session) fetchData()
  }, [session])

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
      setError('Could not load data. Check your Supabase setup.')
    } else {
      setCategories(catsRes.data || [])
      setExpenses(expsRes.data || [])
    }
    setLoading(false)
  }

  async function addExpense(expense) {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expense, user_id: session.user.id }])
      .select('*, categories(name, color)')
    if (!error && data) setExpenses(prev => [data[0], ...prev])
  }

  async function deleteExpense(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) setExpenses(prev => prev.filter(e => e.id !== id))
  }

  async function addCategory(name, color) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, color }])
      .select()
    if (!error && data) setCategories(prev => [...prev, data[0]])
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  const filtered =
    activeCategory === 'All'
      ? expenses
      : expenses.filter(e => e.categories?.name === activeCategory)

  if (authLoading) return <div className="loading">Loading…</div>
  if (!session) return <AuthPage />

  const user = session.user

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div />
          <div className="user-info">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                className="user-avatar"
              />
            )}
            <span className="user-name">
              {user.user_metadata?.full_name || user.email}
            </span>
            <button className="btn-signout" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
        <h1>Expense Tracker</h1>
        <p className="subtitle">Food · Fun · Car · GYM · Med &amp; more</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

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
