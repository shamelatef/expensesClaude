import { useState, useRef, useEffect } from 'react'

export default function CustomSelect({ value, onChange, options, placeholder = 'Select…' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = options.find(o => String(o.value) === String(value))

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="custom-select" ref={ref}>
      <button
        type="button"
        className={`select-trigger${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        {selected ? (
          <span className="select-selected">
            <span className="select-dot" style={{ background: selected.color }} />
            {selected.label}
          </span>
        ) : (
          <span className="select-placeholder">{placeholder}</span>
        )}
        <span className="select-arrow">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <ul className="select-dropdown">
          {options.map(opt => (
            <li
              key={opt.value}
              className={`select-option${String(opt.value) === String(value) ? ' selected' : ''}`}
              onMouseDown={() => { onChange(opt.value); setOpen(false) }}
            >
              <span className="select-dot" style={{ background: opt.color }} />
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
