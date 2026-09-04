import { useEffect, useState } from "react";
import "./MenusSection.css";

const fallbackMenus = [
    {
        idCardDetail: 1,
        menuStage: "Stylo Clásico",
        detail: "Ideal para eventos cálidos, familiares y divertidos.",
        budget: 85000,
        imageUrl: null,
        courses: [
            { label: "Entrada", text: "Picada de fiambres artesanales de la región con selección de quesos duros y blandos, pan de campo y dips caseros." },
            { label: "Plato Principal", text: "Pollo relleno de jamón, queso y morrón acompañada de puré rústico o papas españolas." },
            { label: "Postre", text: "Clásico brownie tibio de chocolate amargo coronado con bocha de helado de americana y hilos de frutos rojos." }
        ]
    },
    {
        idCardDetail: 2,
        menuStage: "Stylo Elegante",
        detail: "Perfecto para bodas de noche o eventos formales.",
        budget: 120000,
        imageUrl: null,
        courses: [
            { label: "Entrada", text: "Bruschettas de pan de masa madre con salmón ahumado, queso crema alimonado y alcaparras." },
            { label: "Plato Principal", text: "Sorrentinos caseros de calabaza y mozzarella con una sutil salsa de crema al verdeo y crocante de almendras tostadas." },
            { label: "Postre", text: "Copa helada de autor con capas de helado de maracuyá, crumble crujiente de almendras y reducción de frutos tropicales." }
        ]
    },
    {
        idCardDetail: 3,
        menuStage: "Stylo Fest",
        detail: "Pensado especialmente para Fiestas de 15 o celebraciones jóvenes.",
        budget: 95000,
        imageUrl: null,
        courses: [
            { label: "Entrada", text: "Cazuelitas de rabas crocantes con rodajas de limón y emulsión de alioli suave." },
            { label: "Plato Principal", text: "Milanesa napolitana individual de ternera acompañada de una torre de papas fritas rústicas doradas al horno." },
            { label: "Postre", text: "Bombón suizo bañado en chocolate semiamargo con corazón de dulce de leche granizado y lluvia de nueces." }
        ]
    }
];

const defaultCourses = {
    "Stylo Clásico": fallbackMenus[0].courses,
    "Stylo Elegante": fallbackMenus[1].courses,
    "Stylo Fest": fallbackMenus[2].courses
};

function MenusSection() {

    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const menusToShow = menus.length > 0 ? menus : fallbackMenus;

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
                        (menu.entrada && menu.platoPrincipal && menu.postre
                            ? [
                                { label: "Entrada", text: menu.entrada },
                                { label: "Plato Principal", text: menu.platoPrincipal },
                                { label: "Postre", text: menu.postre }
                            ]
                            : defaultCourses[menu.menuStage] || [
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

                            <button className="menu-cta-button">
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