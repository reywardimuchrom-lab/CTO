import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to MyApp</h1>
      <p>This is the home page of the monorepo application.</p>
      <nav style={{ marginTop: '2rem' }}>
        <Link to="/login" style={{ marginRight: '1rem' }}>
          Login
        </Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
    </div>
  )
}
