import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cardDetailService } from "../../../services";
import MenuCard from "./MenuCard";
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
                const data = await cardDetailService.getAll();
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

                {menusToShow.map((menu) => (
                    <MenuCard
                        key={menu.idCardDetail ?? menu.id}
                        menu={menu}
                        onConsultar={handleConsultarMenu}
                    />
                ))}

            </div>

        </section>
    );
}

export default MenusSection;