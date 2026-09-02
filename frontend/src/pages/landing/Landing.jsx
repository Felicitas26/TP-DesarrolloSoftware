import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import EventsGrid from "./components/EventsGrid";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">
      <Navbar />
      <Hero />
      <EventsGrid />
      <footer className="landing-footer" id="contacto">
        <span>© {new Date().getFullYear()} STYLO. Todos los derechos reservados.</span>
      </footer>
    </div>
  );
}

export default Landing;
