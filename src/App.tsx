import React from 'react'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Code Dript</h1>
      </header>

      <main className="app-main">
        <p>Welcome to the fresh Code Dript starter app.</p>
      </main>

      <footer className="app-footer">
        <small>© {new Date().getFullYear()} Code Dript</small>
      </footer>
    </div>
  )
}
