import { Link, useLocation } from 'react-router-dom';
import { FaRocket, FaCameraRetro, FaMeteor } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <h1 className="logo"><FaRocket /> NASA Explorer</h1>
      <ul className="nav-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            📷 Imagem do Dia
          </Link>
        </li>
        <li>
          <Link to="/marte" className={location.pathname === '/marte' ? 'active' : ''}>
            <FaCameraRetro /> Marte
          </Link>
        </li>
        <li>
          <Link to="/asteroides" className={location.pathname === '/asteroides' ? 'active' : ''}>
            <FaMeteor /> Asteroides
          </Link>
        </li>
      </ul>
    </nav>
  );
}
