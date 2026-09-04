import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cardDetailList.css";

const IconMenu = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
    </svg>
);

const IconPlus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconArrowLeft = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const IconEye = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconEdit = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

function CardDetailList() {

    const navigate = useNavigate();

    const [cardDetails, setCardDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cardDetailToView, setCardDetailToView] = useState(null);

    const fetchCardDetails = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:3000/api/cardDetail"
            );

            if (!response.ok) {
                throw new Error("No se pudieron cargar los menúes.");
            }

            const data = await response.json();

            setCardDetails(data);

        } catch (error) {

            console.error("Error al cargar menúes:", error);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchCardDetails();
    }, []);

    return (
        <div className="page-wrapper">

            <div className="client-dashboard">

                <header className="dashboard-header-flex">

                    <div className="header-title-group">

                        <div className="header-icon">
                            <IconMenu />
                        </div>

                        <div>
                            <h1>Menúes</h1>
                            <p>
                                Gestión y administración de los menúes de STYLO
                            </p>
                        </div>

                    </div>

                    <div className="header-actions">

                        <button
                            className="btn-back-panel"
                            onClick={() => navigate("/admin-home")}
                        >
                            <IconArrowLeft />
                            Volver al Panel
                        </button>

                        <button
                            className="btn-submit-cyan"
                            onClick={() => navigate("/cardDetail/new")}
                        >
                            <IconPlus />
                            Nuevo Menú
                        </button>

                    </div>

                </header>

                <div className="form-card full-width">

                    <div className="card-body-table">

                        {loading ? (

                            <p className="loading-text">
                                Cargando menúes...
                            </p>

                        ) : (

                            <table className="clients-table">

                                <thead>

                                    <tr>
                                        <th>Imagen</th>
                                        <th>Menú</th>
                                        <th>Detalle</th>
                                        <th>Presupuesto</th>
                                        <th style={{ textAlign: "center" }}>
                                            Acciones
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {cardDetails.length > 0 ? (

                                        cardDetails.map((cardDetail) => (

                                            <tr key={cardDetail.idCardDetail}>

                                                <td>
                                                    {cardDetail.imageUrl ? (
                                                        <img
                                                            className="menu-table-thumb"
                                                            src={`http://localhost:3000${cardDetail.imageUrl}`}
                                                            alt={cardDetail.menuStage}
                                                        />
                                                    ) : (
                                                        <span className="menu-table-noimage">
                                                            Sin imagen
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="font-semibold">
                                                    {cardDetail.menuStage}
                                                </td>

                                                <td>
                                                    {cardDetail.detail}
                                                </td>

                                                <td>
                                                    $
                                                    {Number(
                                                        cardDetail.budget
                                                    ).toLocaleString("es-AR")}
                                                </td>

                                                <td>

                                                    <div className="actions-cell">

                                                        <button
                                                            type="button"
                                                            className="btn-action-view"
                                                            onClick={() =>
                                                                setCardDetailToView(
                                                                    cardDetail
                                                                )
                                                            }
                                                            title="Ver Detalle"
                                                        >
                                                            <IconEye />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn-action-edit"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/cardDetail/edit/${cardDetail.idCardDetail}`
                                                                )
                                                            }
                                                            title="Editar"
                                                        >
                                                            <IconEdit />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="empty-table"
                                            >
                                                No hay menúes registrados.
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        )}

                    </div>

                </div>

            </div>

            {cardDetailToView && (

                <div className="modal-backdrop">

                    <div className="modal-card-form">

                        <div className="modal-header-styled">

                            <h2>Detalles del Menú</h2>

                            <button
                                className="btn-close"
                                onClick={() =>
                                    setCardDetailToView(null)
                                }
                            >
                                ✕
                            </button>

                        </div>

                        <div className="modal-detail-grid">

                            {cardDetailToView.imageUrl && (
                                <div className="detail-item detail-image-item">
                                    <img
                                        src={`http://localhost:3000${cardDetailToView.imageUrl}`}
                                        alt={cardDetailToView.menuStage}
                                    />
                                </div>
                            )}

                            <div className="detail-item">
                                <label>Menú:</label>
                                <span>
                                    {cardDetailToView.menuStage}
                                </span>
                            </div>

                            <div className="detail-item">
                                <label>Detalle:</label>
                                <span>
                                    {cardDetailToView.detail}
                                </span>
                            </div>

                            <div className="detail-item">
                                <label>Presupuesto:</label>
                                <span>
                                    $
                                    {Number(
                                        cardDetailToView.budget
                                    ).toLocaleString("es-AR")}
                                </span>
                            </div>

                            {cardDetailToView.entrada && (
                                <div className="detail-item">
                                    <label>Entrada:</label>
                                    <span>
                                        {cardDetailToView.entrada}
                                    </span>
                                </div>
                            )}

                            {cardDetailToView.platoPrincipal && (
                                <div className="detail-item">
                                    <label>Plato Principal:</label>
                                    <span>
                                        {cardDetailToView.platoPrincipal}
                                    </span>
                                </div>
                            )}

                            {cardDetailToView.postre && (
                                <div className="detail-item">
                                    <label>Postre:</label>
                                    <span>
                                        {cardDetailToView.postre}
                                    </span>
                                </div>
                            )}

                        </div>

                        <div className="modal-footer-right">

                            <button
                                className="btn-j-primary"
                                onClick={() =>
                                    setCardDetailToView(null)
                                }
                            >
                                Cerrar
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default CardDetailList;