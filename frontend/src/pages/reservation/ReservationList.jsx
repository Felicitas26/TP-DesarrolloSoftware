import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReservationList.css";
import FeedbackModal from "../../components/FeedbackModal.jsx";

const IconEye = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const STATUS_OPTIONS = [
    { value: "todas", label: "Todas" },
    { value: "pendiente", label: "Pendientes" },
    { value: "aceptada", label: "Aceptadas" },
    { value: "confirmada", label: "Confirmadas" },
    { value: "cancelada", label: "Canceladas" }
];

function ReservationList() {

    const navigate = useNavigate();

    const [reservations, setReservations] = useState([]);
    const [statusFilter, setStatusFilter] = useState("pendiente");
    const [clientToDetail, setClientToDetail] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [reservationToCancelId, setReservationToCancelId] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("sty_token");

    const showFeedback = (type, title, message) => {
        setFeedback({ type, title, message });
    };

    const getReservations = async () => {

        try {
            const response = await fetch(
                "http://localhost:3000/api/reservation",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setReservations(data);

        } catch (error) {
            console.error(error);
            showFeedback("error", "Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            showFeedback("error", "Error", "No estás autenticado. Volvé a iniciar sesión.");
            setLoading(false);
            return;
        }
        getReservations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredReservations = statusFilter === "todas"
        ? reservations
        : reservations.filter(r => r.status === statusFilter);

    const acceptReservation = async (id) => {

        try {

            const response = await fetch(
                `http://localhost:3000/api/reservation/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: "aceptada"
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            showFeedback("success", "Reserva aceptada", "Reserva aceptada correctamente.");

            getReservations();

        } catch (error) {

            console.error(error);
            showFeedback("error", "Error", error.message);

        }
    };

    const handleCancelClick = (id) => {
        setReservationToCancelId(id);
        setFeedback({
            type: "confirm",
            title: "Cancelar reserva",
            message: "¿Estás seguro de que querés cancelar esta reserva?",
            confirmLabel: "Cancelar reserva"
        });
    };

    const performCancel = async () => {

        const id = reservationToCancelId;
        setReservationToCancelId(null);
        setFeedback(null);

        try {

            const response = await fetch(
                `http://localhost:3000/api/reservation/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            showFeedback("success", "Reserva cancelada", "Reserva cancelada correctamente.");

            getReservations();

        } catch (error) {

            console.error(error);
            showFeedback("error", "Error", error.message);

        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("es-AR");
    };

    return (
        <div className="reservation-list-container">

            <div className="reservation-list-header">

                <div>
                    <h1>Gestión de Reservas</h1>
                    <p>Administrá las reservas del salón.</p>
                </div>

                <div className="reservation-list-header-actions">
                    <button
                        className="reservation-btn-back"
                        onClick={() => navigate("/admin-home")}
                    >
                        Volver al menú
                    </button>
                    <span>{filteredReservations.length}</span>
                </div>

            </div>

            <div className="reservation-list-filters">
                {STATUS_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        className={`reservation-filter-btn ${statusFilter === opt.value ? "active" : ""}`}
                        onClick={() => setStatusFilter(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="reservation-list-empty">Cargando reservas...</p>
            ) : filteredReservations.length === 0 ? (

                <p className="reservation-list-empty">
                    No hay reservas en este estado.
                </p>

            ) : (

                <div className="reservation-list-table-container">

                    <table className="reservation-list-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha reserva</th>
                                <th>Fecha evento</th>
                                <th>Tipo de evento</th>
                                <th>Estado</th>
                                <th>Invitados</th>
                                <th>Cliente</th>
                                <th>Salón</th>
                                <th>Tipo de salón</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredReservations.map((reservation) => (

                                <tr key={reservation.idReservation}>

                                    <td>
                                        {reservation.idReservation}
                                    </td>

                                    <td>
                                        {formatDate(reservation.dateReservation)}
                                    </td>

                                    <td>
                                        {formatDate(reservation.dateEvent)}
                                    </td>

                                    <td>
                                        {reservation.eventType}
                                    </td>

                                    <td>
                                        {reservation.status}
                                    </td>

                                    <td>
                                        {reservation.maxCantInvit
                                            ? `${reservation.cantInvit} - ${reservation.maxCantInvit}`
                                            : reservation.cantInvit}
                                    </td>

                                    <td>
                                        {reservation.client?.nameCli}{" "}
                                        {reservation.client?.surnameCli}
                                    </td>

                                    <td>
                                        {reservation.lounge?.name}
                                    </td>

                                    <td>
                                        {reservation.loungeType?.nameLoungeType}
                                    </td>

                                    <td>

                                        <div className="reservation-actions">

                                            <button
                                                className="btn-action-view"
                                                onClick={() =>
                                                    setClientToDetail(
                                                        reservation.client
                                                    )
                                                }
                                                title="Ver cliente"
                                            >
                                                <IconEye />
                                            </button>

                                            {reservation.status === "pendiente" && (
                                                <button
                                                    className="reservation-btn-accept"
                                                    onClick={() =>
                                                        acceptReservation(
                                                            reservation.idReservation
                                                        )
                                                    }
                                                >
                                                    Aceptar
                                                </button>
                                            )}

                                            {reservation.status === "pendiente" && (
                                                <button
                                                    className="reservation-btn-cancel"
                                                    onClick={() =>
                                                        handleCancelClick(
                                                            reservation.idReservation
                                                        )
                                                    }
                                                >
                                                    Cancelar
                                                </button>
                                            )}

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            {clientToDetail && (
                <div className="modal-backdrop">
                    <div className="modal-card-form">
                        <div className="modal-header-styled">
                            <h2>Detalles del Cliente</h2>
                            <button
                                className="btn-close"
                                onClick={() => setClientToDetail(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-detail-grid">
                            <div className="detail-item">
                                <label>Nombre:</label>
                                <span>{clientToDetail.nameCli}</span>
                            </div>
                            <div className="detail-item">
                                <label>Apellido:</label>
                                <span>{clientToDetail.surnameCli}</span>
                            </div>
                            <div className="detail-item">
                                <label>DNI:</label>
                                <span>{clientToDetail.dniCli}</span>
                            </div>
                            <div className="detail-item">
                                <label>Teléfono:</label>
                                <span>{clientToDetail.phoneCli}</span>
                            </div>
                            <div className="detail-item">
                                <label>Email:</label>
                                <span>{clientToDetail.emailCli}</span>
                            </div>
                            <div className="detail-item">
                                <label>Dirección:</label>
                                <span>{clientToDetail.addressCli}</span>
                            </div>
                            <div className="detail-item">
                                <label>Ciudad:</label>
                                <span>{clientToDetail.location?.city}</span>
                            </div>
                            <div className="detail-item">
                                <label>Código Postal:</label>
                                <span>{clientToDetail.location?.zipCode}</span>
                            </div>
                        </div>
                        <div className="modal-footer-right">
                            <button
                                className="btn-j-primary"
                                onClick={() => setClientToDetail(null)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {feedback && (
                <FeedbackModal
                    type={feedback.type}
                    title={feedback.title}
                    message={feedback.message}
                    confirmLabel={feedback.confirmLabel}
                    cancelLabel="Volver"
                    onConfirm={feedback.type === "confirm" ? performCancel : undefined}
                    onCancel={() => { setFeedback(null); setReservationToCancelId(null); }}
                    onClose={() => setFeedback(null)}
                />
            )}

        </div>
    );
}

export default ReservationList;
