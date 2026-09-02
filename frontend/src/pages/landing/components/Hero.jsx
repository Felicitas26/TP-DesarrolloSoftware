import "./Hero.css";

function Hero() {
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
        <p className="hero-subtitle">CELEBRA TUS MOMENTOS INOLVIDABLES</p>
        <a href="#reservas" className="hero-cta">
          EMPIEZA TU RESERVA
        </a>
      </div>
    </section>
  );
}

export default Hero;
