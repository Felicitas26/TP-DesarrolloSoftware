import { useNavigate } from "react-router-dom";
import "./Home.css";

const IconUser = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconLounge = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l1.5-5h15L21 9"/>
    <path d="M3 9h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/>
    <path d="M7 15v3m10-3v3"/>
  </svg>
);

const IconLayers = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

function Home() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Clientes",
      description: "Administración de clientes registrados",
      route: "/client",
      icon: <IconUser />,
      accent: "cyan"
    },
    {
      title: "Salones",
      description: "Administración de salones (lounges)",
      route: "/lounge",
      icon: <IconLounge />,
      accent: "blue"
    },
    {
      title: "Tipos de Salón",
      description: "Administración de tipos de salón (loungetypes)",
      route: "/loungeType",
      icon: <IconLayers />,
      accent: "indigo"
    }
  ];

  return (
    <div className="home-wrapper">
      <div className="home-dashboard">
        <header className="home-header">
          <div className="home-brand">
            <div className="home-logo">STYLO</div>
            <div>
              <h1>Panel de Administración</h1>
              <p>Seleccioná una sección para comenzar a gestionar</p>
            </div>
          </div>
        </header>

        <div className="home-grid">
          {sections.map((section) => (
            <button
              key={section.route}
              type="button"
              className="home-card"
              onClick={() => navigate(section.route)}
            >
              <div className={`home-card-icon accent-${section.accent}`}>
                {section.icon}
              </div>
              <div className="home-card-content">
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>
              <div className="home-card-arrow">
                <IconArrowRight />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
