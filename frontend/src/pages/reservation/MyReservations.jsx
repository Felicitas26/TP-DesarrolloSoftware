import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyReservations.css";

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

                                <h2>
                                    Reserva #{reservation.idReservation}
                                </h2>

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
                                    {reservation.menuStage}
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