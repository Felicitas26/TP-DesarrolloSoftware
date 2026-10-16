import { buildAssetUrl } from "../../../services";
import "./MenusSection.css";

/**
 * Tarjeta presentacional de un menú.
 * Input property: `menu` (datos que recibe del componente contenedor).
 * Output property: `onConsultar` (callback que emite el evento al contenedor).
 *
 * @param {Object} props
 * @param {import("../../../models").CardDetail} props.menu
 * @param {(idCardDetail: number) => void} props.onConsultar
 */
function MenuCard({ menu, onConsultar }) {

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
        <article className="menu-card">

            {menu.imageUrl && (
                <div className="menu-image">
                    <img
                        src={buildAssetUrl(menu.imageUrl)}
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
                onClick={() => onConsultar?.(menu.idCardDetail)}
            >
                Consultar por este Menú
            </button>

        </article>
    );
}

export default MenuCard;
