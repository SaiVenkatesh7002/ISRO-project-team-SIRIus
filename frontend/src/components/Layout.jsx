import { Link, NavLink } from 'react-router-dom';
import { Satellite } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="nav">
        <Link className="brand" to="/">
          <Satellite size={24} />
          <span>Team SIRIus</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/upload">Upload</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">Built for ISRO BAH 2026 · Cloud removal for LISS-IV imagery</footer>
    </div>
  );
}
