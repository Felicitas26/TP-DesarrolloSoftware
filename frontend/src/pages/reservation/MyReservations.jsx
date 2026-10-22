import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reservationService } from "../../services";
import FeedbackModal from "../../components/FeedbackModal";
import "./MyReservations.css";

const IconTrash = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const IconEdit = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const IconSearch = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const STATUS_OPTIONS = [
    { value: "todas", label: "Todas" },
    { value: "pendiente", label: "Pendientes" },
    { value: "aceptada", label: "Aceptadas" },
    { value: "confirmada", label: "Confirmadas" },
    { value: "cancelada", label: "Canceladas" },
    { value: "expiradas", label: "Expiradas" }
];

const normalizeText = (value) =>
    String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

function MyReservations() {

    const navigate = useNavigate();

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statusFilter, setStatusFilter] = useState("todas");
    const [searchTerm, setSearchTerm] = useState("");

    const [feedback, setFeedback] = useState(null);
    const [reservationToDeleteId, setReservationToDeleteId] = useState(null);

    useEffect(() => {

        const getReservations = async () => {

            try {

                const data = await reservationService.getMine();

                setReservations(data);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getReservations();

    }, []);

    const filteredReservations = (() => {
        let list = reservations;

        if (statusFilter === "expiradas") {
            list = list.filter((r) => r.isExpired);
        } else if (statusFilter !== "todas") {
            list = list.filter((r) => r.status === statusFilter);
        }

        const term = normalizeText(searchTerm);
        if (term) {
            list = list.filter((r) =>
                [
                    r.idReservation,
                    r.eventType,
                    r.lounge?.name,
                    r.loungeType?.nameLoungeType
                ]
                    .map(normalizeText)
                    .some((value) => value.includes(term))
            );
        }

        return list;
    })();

    const formatDate = (date) => {

        const dateOnly = date.split("T")[0];

        const [year, month, day] = dateOnly.split("-");

        return `${day}/${month}/${year}`;
    };

    const handleDeleteClick = (id) => {
        setReservationToDeleteId(id);
        setFeedback({ type: "confirm", title: "Eliminar reserva", message: "¿Estás seguro de que querés eliminar esta solicitud de reserva?", confirmLabel: "Eliminar", onConfirm: handleDeleteConfirm, onCancel: () => { setFeedback(null); setReservationToDeleteId(null); } });
    };

    const handleDeleteConfirm = async () => {

        const id = reservationToDeleteId;
        setFeedback(null);
        setReservationToDeleteId(null);

        try {

            await reservationService.remove(id);

            setReservations((prev) =>
                prev.filter(
                    (r) => r.idReservation !== id
                )
            );

            setFeedback({ type: "success", title: "Reserva eliminada", message: "La reserva se eliminó correctamente." });

        } catch (err) {
            setFeedback({ type: "error", title: "Error", message: err.message });
        }
    };

    if (loading) {
        return (
            <div className="my-reservations-container">
                <p className="my-reservations-message">
                    Cargando reservas...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-reservations-container">
                <p className="my-reservations-message">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="my-reservations-container">

            <div className="my-reservations-background">
                <div className="my-reservations-glow my-reservations-glow-purple" />
                <div className="my-reservations-glow my-reservations-glow-cyan" />
                <div className="my-reservations-grid-overlay" />
            </div>

            <div className="my-reservations-overlay" />

            <header className="my-reservations-bar">

                <div className="my-reservations-logo">
                    SALON STYLO
                </div>

                <button
                    className="my-reservations-back-button"
                    onClick={() => navigate("/client-home")}
                >
                    Volver al menú
                </button>

            </header>

            <main className="my-reservations-content">

                <div className="my-reservations-title">

                    <h1>
                        Mis reservas
                    </h1>

                </div>

                {reservations.length > 0 && (
                    <>
                        <div className="my-reservations-filters">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className={`my-reservations-filter-btn ${statusFilter === opt.value ? "active" : ""}`}
                                    onClick={() => setStatusFilter(opt.value)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <div className="my-reservations-search">
                            <span className="my-reservations-search-icon">
                                <IconSearch />
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por salón, tipo de evento o N° de reserva..."
                                aria-label="Buscar reservas"
                            />
                        </div>
                    </>
                )}

                {reservations.length === 0 ? (

                    <p className="my-reservations-empty">
                        No tenés reservas realizadas.
                    </p>

                ) : filteredReservations.length === 0 ? (

                    <p className="my-reservations-empty">
                        No se encontraron reservas con esos criterios.
                    </p>

                ) : (

                    <div className="my-reservations-list">

                        {filteredReservations.map((reservation) => (

                            <div
                                className="my-reservation-card"
                                key={reservation.idReservation}
                            >

                                <div className="my-reservation-card-header">
                                    <h2>
                                        Reserva #{reservation.idReservation}
                                    </h2>

                                    <div className="my-reservation-card-actions">
                                        {reservation.status === "pendiente" && (
                                            <button
                                                className="my-reservation-edit"
                                                onClick={() =>
                                                    navigate(
                                                        `/my-reservations/edit/${reservation.idReservation}`
                                                    )
                                                }
                                                title="Editar reserva"
                                            >
                                                <IconEdit />
                                            </button>
                                        )}

                                        {reservation.status === "pendiente" && (
                                            <button
                                                className="my-reservation-delete"
                                                onClick={() =>
                                                    handleDeleteClick(
                                                        reservation.idReservation
                                                    )
                                                }
                                                title="Eliminar solicitud"
                                            >
                                                <IconTrash />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <p>
                                    <strong>
                                        Fecha del evento:
                                    </strong>{" "}
                                    {formatDate(
                                        reservation.dateEvent
                                    )}
                                </p>

                                <p>
                                    <strong>
                                        Tipo de evento:
                                    </strong>{" "}
                                    {reservation.eventType}
                                </p>

                                <p>
                                    <strong>
                                        Salón:
                                    </strong>{" "}
                                    {reservation.lounge?.name}
                                </p>

                                <p>
                                    <strong>
                                        Tipo de salón:
                                    </strong>{" "}
                                    {reservation.loungeType?.nameLoungeType}
                                </p>

                                <p>
                                    <strong>
                                        Invitados:
                                    </strong>{" "}
                                    {reservation.maxCantInvit
                                        ? `${reservation.cantInvit} - ${reservation.maxCantInvit}`
                                        : reservation.cantInvit}
                                </p>

                                <p>
                                    <strong>
                                        Estado:
                                    </strong>{" "}
                                    <span className={`my-reservation-status ${reservation.status}`}>
                                        {reservation.statusLabel}
                                    </span>
                                    {reservation.isExpired && (
                                        <span className="my-reservation-expired">
                                            Expirada
                                        </span>
                                    )}
                                </p>

                                <p>
                                    <strong>
                                        Menú:
                                    </strong>{" "}
                                    {reservation.cardDetail
                                        ? reservation.cardDetail.menuStage
                                        : "Sin menú"}
                                </p>

                                <p>
                                    <strong>
                                        Servicios extras:
                                    </strong>{" "}

                                    {reservation.extraServices &&
                                    reservation.extraServices.length > 0 ? (

                                        reservation.extraServices
                                            .map(
                                                (service) =>
                                                    service.nameService
                                            )
                                            .join(", ")

                                    ) : (

                                        "Ninguno"

                                    )}

                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </main>

            <footer className="my-reservations-footer">

                <span>
                    © {new Date().getFullYear()} STYLO. Todos los derechos reservados.
                </span>

            </footer>

            {feedback && (
                <FeedbackModal
                    type={feedback.type}
                    title={feedback.title}
                    message={feedback.message}
                    onClose={() => { setFeedback(null); setReservationToDeleteId(null); }}
                    onConfirm={feedback.onConfirm}
                    confirmLabel={feedback.confirmLabel}
                    cancelLabel="Cancelar"
                    onCancel={feedback.onCancel}
                />
            )}

        </div>
    );
}

export default MyReservations;