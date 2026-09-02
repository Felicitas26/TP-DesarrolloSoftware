import { Link } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "INICIO", href: "#inicio", active: true },
  { label: "EVENTOS", href: "#eventos", active: false },
  { label: "RESERVAS", href: "#reservas", active: false },
  { label: "CONTACTO", href: "#contacto", active: false }
];

function Navbar() {
  return (
    <header className="navbar">
      <a href="#inicio" className="navbar-logo">
        STYLO
      </a>

      <nav className="navbar-links">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`navbar-link ${link.active ? "is-active" : ""}`}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <Link to="/login" className="navbar-cta">
        INICIAR SESION
      </Link>
    </header>
  );
}

export default Navbar;
