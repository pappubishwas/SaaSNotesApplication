import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header({ me, handleLogout }) {
  const navigate = useNavigate()

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          SaaS <span className="text-indigo-600">Notes</span>
        </h1>
        <div>
          {me ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {me.email} • {me.role}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 rounded-xl border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  )
}