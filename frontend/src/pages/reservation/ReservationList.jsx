import { useEffect, useState } from "react";
import "./ReservationList.css";

function ReservationList() {

    const [reservations, setReservations] = useState([]);

    const getReservations = async () => {

        try {
            const response = await fetch(
                "http://localhost:3000/api/reservation"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setReservations(
                data.filter(
                    (reservation) => reservation.status === "pendiente"
                )
            );

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    useEffect(() => {
        getReservations();
    }, []);

    const acceptReservation = async (id) => {

        try {

            const response = await fetch(
                `http://localhost:3000/api/reservation/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
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

            alert("Reserva aceptada correctamente.");

            getReservations();

        } catch (error) {

            console.error(error);
            alert(error.message);

        }
    };

    const cancelReservation = async (id) => {

        const confirmCancel = window.confirm(
            "¿Está seguro de que desea cancelar esta reserva?"
        );

        if (!confirmCancel) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:3000/api/reservation/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            alert("Reserva cancelada correctamente.");

            getReservations();

        } catch (error) {

            console.error(error);
            alert(error.message);

        }
    };

    return (
        <div className="reservation-list-container">

            <div className="reservation-list-header">

                <div>
                    <h1>Gestión de Reservas</h1>
                    <p>Reservas pendientes de aprobación.</p>
                </div>

                <span>{reservations.length}</span>

            </div>

            {reservations.length === 0 ? (

                <p className="reservation-list-empty">
                    No hay reservas pendientes.
                </p>

            ) : (

                <div className="reservation-list-table-container">

                    <table className="reservation-list-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha reserva</th>
                                <th>Fecha evento</th>
                                <th>Estado</th>
                                <th>Invitados</th>
                                <th>Cliente</th>
                                <th>Salón</th>
                                <th>Tipo de salón</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            {reservations.map((reservation) => (

                                <tr key={reservation.idReservation}>

                                    <td>
                                        {reservation.idReservation}
                                    </td>

                                    <td>
                                        {reservation.dateReservation}
                                    </td>

                                    <td>
                                        {reservation.dateEvent}
                                    </td>

                                    <td>
                                        {reservation.status}
                                    </td>

                                    <td>
                                        {reservation.cantInvit}
                                    </td>

                                    <td>
                                        {reservation.nameCli}{" "}
                                        {reservation.surnameCli}
                                    </td>

                                    <td>
                                        {reservation.loungeName}
                                    </td>

                                    <td>
                                        {reservation.nameLoungeType}
                                    </td>

                                    <td>

                                        <div className="reservation-actions">

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

                                            <button
                                                className="reservation-btn-cancel"
                                                onClick={() =>
                                                    cancelReservation(
                                                        reservation.idReservation
                                                    )
                                                }
                                            >
                                                Cancelar
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default ReservationList;