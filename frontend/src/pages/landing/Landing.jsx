import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import EventsGrid from "./components/EventsGrid";
import LoungesSection from "./components/LoungesSection";
import MenusSection from "./components/MenusSection";
import ExtraServicesSection from "./components/ExtraServicesSection";
import "./Landing.css";

const IconInstagram = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const IconMail = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <polyline points="3 7 12 13 21 7" />
  </svg>
);

const IconLocation = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

function Landing() {
  return (
    <div className="landing">
      <Navbar />

      <Hero />

      <EventsGrid />

      <LoungesSection />

      <MenusSection />

      <ExtraServicesSection />

      <footer className="landing-footer" id="contacto">
        <h2>CONTACTO</h2>

        <div className="landing-contact">
          <a
            href="https://www.instagram.com/salon.stylo.rosario"
            target="_blank"
            rel="noreferrer"
          >
            <IconInstagram />
            <span>@salon.stylo.rosario</span>
          </a>

          <a href="mailto:contacto@salonstylo.com.ar">
            <IconMail />
            <span>contacto@salonstylo.com.ar</span>
          </a>

          <div>
            <IconLocation />
            <span>Av. Pellegrini 3135, Rosario</span>
          </div>
        </div>

        <span className="landing-footer-copy">
          © {new Date().getFullYear()} STYLO. Todos los derechos reservados.
        </span>
      </footer>
    </div>
  );
}

export default Landing;