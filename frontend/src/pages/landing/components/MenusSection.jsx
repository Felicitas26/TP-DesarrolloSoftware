import { useEffect, useState } from "react";
import "./MenusSection.css";

function MenusSection() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMenus = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/cardDetail"
                );

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

    if (loading) {
        return (
            <section id="menues" className="menus-section">
                <h2>MENÚES</h2>
                <p className="menus-loading">Cargando menús...</p>
            </section>
        );
    }

    return (
        <section id="menues" className="menus-section">
            <div className="menus-header">
                <span className="menus-eyebrow">NUESTRA PROPUESTA</span>

                <h2>MENÚES</h2>

                <p>
                    Elegí la propuesta gastronómica ideal para acompañar
                    tu celebración.
                </p>
            </div>

            <div className="menus-grid">
                {menus.map((menu) => (
                    <article
                        className="menu-card"
                        key={menu.idCardDetail}
                    >
                        <span className="menu-number">
                            0{menu.idCardDetail}
                        </span>

                        <h3>{menu.menuStage}</h3>

                        <p className="menu-detail">
                            {menu.detail}
                        </p>

                        <div className="menu-price">
                            <span>DESDE</span>
                            <strong>
                                ${Number(menu.budget).toLocaleString("es-AR")}
                            </strong>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default MenusSection;