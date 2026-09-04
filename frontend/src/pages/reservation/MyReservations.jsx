import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyReservations.css";

const IconTrash = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

function MyReservations() {

    const navigate = useNavigate();

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const getReservations = async () => {

            const token = localStorage.getItem("sty_token");

            try {

                const response = await fetch(
                    "http://localhost:3000/api/reservation/mis-reservas",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "No se pudieron obtener las reservas."
                    );
                }

                setReservations(data);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getReservations();

    }, []);

    const formatDate = (date) => {

        const dateOnly = date.split("T")[0];

        const [year, month, day] = dateOnly.split("-");

        return `${day}/${month}/${year}`;
    };

    const getGuestRange = (cantInvit) => {

        if (cantInvit === 1) {
            return "70 - 90 invitados";
        }

        if (cantInvit === 2) {
            return "90 - 130 invitados";
        }

        return "Cantidad no especificada";
    };

    const deleteReservation = async (id) => {

        const confirmDelete = window.confirm(
            "¿Estás seguro de que querés eliminar esta solicitud de reserva?"
        );

        if (!confirmDelete) {
            return;
        }

        const token = localStorage.getItem("sty_token");

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
                throw new Error(
                    data.error || "No se pudo eliminar la reserva."
                );
            }

            setReservations((prev) =>
                prev.filter(
                    (r) => r.idReservation !== id
                )
            );

        } catch (err) {
            alert(err.message);
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

                {reservations.length === 0 ? (

                    <p className="my-reservations-empty">
                        No tenés reservas realizadas.
                    </p>

                ) : (

                    <div className="my-reservations-list">

                        {reservations.map((reservation) => (

                            <div
                                className="my-reservation-card"
                                key={reservation.idReservation}
                            >

                                <div className="my-reservation-card-header">
                                    <h2>
                                        Reserva #{reservation.idReservation}
                                    </h2>

                                    {reservation.status === "pendiente" && (
                                        <button
                                            className="my-reservation-delete"
                                            onClick={() =>
                                                deleteReservation(
                                                    reservation.idReservation
                                                )
                                            }
                                            title="Eliminar solicitud"
                                        >
                                            <IconTrash />
                                        </button>
                                    )}
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
                                    {getGuestRange(
                                        reservation.cantInvit
                                    )}
                                </p>

                                <p>
                                    <strong>
                                        Estado:
                                    </strong>{" "}
                                    {reservation.status}
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

        </div>
    );
}

export default MyReservations;