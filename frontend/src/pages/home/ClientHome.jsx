import { useNavigate } from "react-router-dom";
import "./ClientHome.css";

const IconCalendar = () => (
    <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const IconClipboard = () => (
    <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M9 3V2h6v1" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
);

const IconUser = () => (
    <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconArrowRight = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const IconLogout = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

function ClientHome() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("sty_token");
        localStorage.removeItem("sty_rol");
        localStorage.removeItem("sty_idUsuario");
        localStorage.removeItem("sty_idCli");

        navigate("/");
    };

    const sections = [
        {
            title: "Nueva Reserva",
            description: "Realizá una nueva reserva para tu evento",
            route: "/reservation/new",
            icon: <IconCalendar />
        },
        {
            title: "Mis Reservas",
            description: "Consultá las reservas que realizaste",
            route: "/my-reservations",
            icon: <IconClipboard />
        },
        {
            title: "Mi Perfil",
            description: "Consultá y gestioná tus datos personales",
            route: "/my-profile",
            icon: <IconUser />
        }
    ];

    return (
        <div className="client-landing">

            <div className="client-background" aria-hidden="true">
                <div className="client-glow client-glow-purple" />
                <div className="client-glow client-glow-cyan" />
                <div className="client-grid-overlay" />
            </div>

            <div className="client-overlay" />

            <header className="client-bar">

                <a className="client-logo">
                    SALON STYLO
                </a>

                <button
                    type="button"
                    className="client-logout"
                    onClick={handleLogout}
                >
                    <IconLogout />
                    Cerrar Sesión
                </button>

            </header>

            <main className="client-content">

                <div className="client-panel">

                    <h1 className="client-panel-title">
                        BIENVENIDO A STYLO
                    </h1>

                    <p className="client-panel-subtitle">
                        GESTIONÁ TU EVENTO
                    </p>

                </div>

                <div className="client-grid">

                    {sections.map((section) => (

                        <button
                            key={section.title}
                            type="button"
                            className="client-card"
                            onClick={() => navigate(section.route)}
                        >

                            <div className="client-card-icon">
                                {section.icon}
                            </div>

                            <div className="client-card-content">

                                <h2>
                                    {section.title}
                                </h2>

                                <p>
                                    {section.description}
                                </p>

                            </div>

                            <div className="client-card-arrow">
                                <IconArrowRight />
                            </div>

                        </button>

                    ))}

                </div>

            </main>

            <footer className="client-footer">

                <span>
                    © {new Date().getFullYear()} STYLO. Todos los derechos reservados.
                </span>

            </footer>

        </div>
    );
}

export default ClientHome;