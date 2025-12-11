import { Link } from 'react-router-dom'

export default function DashboardPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <nav style={{ marginTop: '2rem' }}>
        <Link to="/">Back to Home</Link>
      </nav>
    </div>
  )
}
