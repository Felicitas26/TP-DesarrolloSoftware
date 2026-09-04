import { useNavigate } from "react-router-dom";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section id="inicio" className="hero">
      <div className="hero-background" aria-hidden="true">
        <div className="hero-glow hero-glow-purple" />
        <div className="hero-glow hero-glow-cyan" />
        <div className="hero-grid-overlay" />
      </div>

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="hero-title">BIENVENIDOS A STYLO</h1>

        <p className="hero-subtitle">
          CELEBRA TUS MOMENTOS INOLVIDABLES
        </p>

        <button
          type="button"
          className="hero-cta"
          onClick={() => navigate("/login")}
        >
          EMPIEZA TU RESERVA
        </button>
      </div>
    </section>
  );
}

export default Hero;

