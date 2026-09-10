import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MenusSection.css";

function MenusSection() {

    const navigate = useNavigate();
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleConsultarMenu = (idCardDetail) => {
        const token = localStorage.getItem("sty_token");

        if (!token) {
            localStorage.setItem(
                "sty_pending_menu",
                String(idCardDetail)
            );
            navigate("/login");
            return;
        }

        navigate("/reservation/new", { state: { idCardDetail } });
    };

    useEffect(() => {
        const loadMenus = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/cardDetail");
                const data = await response.json();
                setMenus(data);
            } catch (error) {
                console.error("Error al cargar los menús:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMenus();
    }, []);

    const menusToShow = menus;

    if (loading) {
        return (
            <section id="menues" className="menus-section">
                <div className="menus-header">
                    <span className="menus-eyebrow">NUESTRA PROPUESTA</span>
                    <h2>MENÚES</h2>
                </div>
                <p className="menus-loading">Cargando menús...</p>
            </section>
        );
    }

    return (
        <section id="menues" className="menus-section">

            <div className="menus-header">
                <span className="menus-eyebrow">NUESTRA PROPUESTA</span>
                <h2>MENÚES</h2>
                <p>Elegí la propuesta gastronómica ideal para acompañar tu celebración.</p>
            </div>

            <div className="menus-grid">

                {menusToShow.map((menu) => {

                    const courses = menu.courses ||
                        (menu.starter && menu.mainCourse && menu.dessert
                            ? [
                                { label: "Entrada", text: menu.starter },
                                { label: "Plato Principal", text: menu.mainCourse },
                                { label: "Postre", text: menu.dessert }
                            ]
                            : [
                                { label: "Entrada", text: "A confirmar con el equipo de STYLO." },
                                { label: "Plato Principal", text: "A confirmar con el equipo de STYLO." },
                                { label: "Postre", text: "A confirmar con el equipo de STYLO." }
                            ]);

                    return (
                        <article className="menu-card" key={menu.idCardDetail ?? menu.id}>

                            {menu.imageUrl && (
                                <div className="menu-image">
                                    <img
                                        src={`http://localhost:3000${menu.imageUrl}`}
                                        alt={menu.menuStage}
                                    />
                                </div>
                            )}

                            <span className="menu-number">0{menu.idCardDetail ?? menu.id}</span>

                            <div className="menu-header-block">

                                <h3 className="menu-name">{menu.menuStage}</h3>

                                {menu.budget > 0 && (
                                    <div className="menu-budget">
                                        <span>DESDE</span>
                                        <strong>
                                            ${Number(menu.budget).toLocaleString("es-AR")}
                                        </strong>
                                    </div>
                                )}

                            </div>

                            <p className="menu-description">{menu.detail}</p>

                            <div className="menu-courses">

                                {courses.map((course) => (
                                    <div className="menu-course" key={course.label}>

                                        <span className="menu-course-label">
                                            {course.label}
                                        </span>

                                        <p className="menu-course-text">
                                            {course.text}
                                        </p>

                                    </div>
                                ))}

                            </div>

                            <button
                                className="menu-cta-button"
onClick={() =>
                                                    handleConsultarMenu(
                                                        menu.idCardDetail
                                                    )
                                                }
                            >
                                Consultar por este Menú
                            </button>

                        </article>
                    );
                })}

            </div>

        </section>
    );
}

export default MenusSection;