import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "INICIO", href: "#inicio" },
  { label: "EVENTOS", href: "#eventos" },
  { label: "SALONES", href: "#salones" },
  { label: "MENÚS", href: "#menues" },
  { label: "SERVICIOS EXTRA", href: "#servicios-extra" },
  { label: "CONTACTO", href: "#contacto" }
];

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

function Navbar() {
  const [activeSection, setActiveSection] = useState("inicio");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 110;
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      if (window.innerHeight + window.scrollY >= pageHeight - 10) {
        setActiveSection("contacto");
        return;
      }

      let current = "inicio";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="navbar">
      <button type="button" className="navbar-logo" onClick={scrollToTop}>
        STYLO
      </button>

      <nav className="navbar-links">
        {NAV_LINKS.map((link) => {
          const isActive = link.href === `#${activeSection}`;
          return (
            <a
              key={link.label}
              href={link.href}
              className={`navbar-link ${isActive ? "is-active" : ""}`}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      <Link to="/login" className="navbar-cta">
        INICIAR SESION
      </Link>
    </header>
  );
}

export default Navbar;
