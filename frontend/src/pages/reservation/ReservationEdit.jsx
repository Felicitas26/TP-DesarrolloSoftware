import { useEffect, useState } from "react";
import FeedbackModal from "../../components/FeedbackModal";
import "./ReservationEdit.css";

function ReservationEdit() {

    const [reservations, setReservations] = useState([]);
    const [selectedId, setSelectedId] = useState("");

    const [reservation, setReservation] = useState({
        dateEvent: "",
        status: "",
        cantInvit: "",
        idCli: "",
        idLounge: "",
        idLoungeType: ""
    });

    const [feedback, setFeedback] = useState(null);

    const getReservations = async () => {

        try {
            const response = await fetch(
                "http://localhost:3000/api/reservation"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setReservations(data);

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    useEffect(() => {
        getReservations();
    }, []);

    const handleSelect = async (e) => {

        const id = e.target.value;

        setSelectedId(id);

        if (!id) {
            setReservation({
                dateEvent: "",
                status: "",
                cantInvit: "",
                idCli: "",
                idLounge: "",
                idLoungeType: ""
            });

            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/api/reservation/${id}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setReservation({
                dateEvent: data.dateEvent,
                status: data.status,
                cantInvit: data.cantInvit,
                idCli: data.idCli,
                idLounge: data.idLounge,
                idLoungeType: data.idLoungeType
            });

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    const handleChange = (e) => {

        setReservation({
            ...reservation,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:3000/api/reservation/${selectedId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        dateEvent: reservation.dateEvent,
                        status: reservation.status,
                        cantInvit: Number(reservation.cantInvit),
                        idCli: Number(reservation.idCli),
                        idLounge: Number(reservation.idLounge),
                        idLoungeType: Number(reservation.idLoungeType)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setFeedback({ type: "success", title: "Reserva actualizada", message: "La reserva se actualizó correctamente." });

            await getReservations();

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    const handleDeleteClick = () => {
        setFeedback({ type: "confirm", title: "Eliminar reserva", message: "¿Está seguro de que desea eliminar esta reserva?", confirmLabel: "Eliminar", onConfirm: handleDeleteConfirm, onCancel: () => setFeedback(null) });
    };

    const handleDeleteConfirm = async () => {

        setFeedback(null);

        try {
            const response = await fetch(
                `http://localhost:3000/api/reservation/${selectedId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setFeedback({ type: "success", title: "Reserva eliminada", message: "La reserva se eliminó correctamente." });

            setSelectedId("");

            setReservation({
                dateEvent: "",
                status: "",
                cantInvit: "",
                idCli: "",
                idLounge: "",
                idLoungeType: ""
            });

            await getReservations();

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    return (
        <div className="reservation-edit-container">

            <h1>Editar reserva</h1>
            <p>Seleccioná la reserva que querés modificar.</p>

            <div className="reservation-edit-field">

                <label>Reserva</label>

                <select
                    value={selectedId}
                    onChange={handleSelect}
                >
                    <option value="">
                        Seleccionar reserva
                    </option>

                    {reservations.map((item) => (

                        <option
                            key={item.idReservation}
                            value={item.idReservation}
                        >
                            Reserva #{item.idReservation}
                        </option>

                    ))}

                </select>

            </div>

            {selectedId && (

                <form onSubmit={handleUpdate}>

                    <div className="reservation-edit-field">

                        <label>Fecha del evento</label>

                        <input
                            type="date"
                            name="dateEvent"
                            value={reservation.dateEvent}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="reservation-edit-field">

                        <label>Estado</label>

                        <select
                            name="status"
                            value={reservation.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Seleccionar estado
                            </option>

                            <option value="pendiente">
                                Pendiente
                            </option>

                            <option value="confirmada">
                                Confirmada
                            </option>

                            <option value="cancelada">
                                Cancelada
                            </option>

                        </select>

                    </div>

                    <div className="reservation-edit-field">

                        <label>Cantidad de invitados</label>

                        <input
                            type="number"
                            name="cantInvit"
                            value={reservation.cantInvit}
                            onChange={handleChange}
                            min="1"
                            required
                        />

                    </div>

                    <div className="reservation-edit-field">

                        <label>ID del cliente</label>

                        <input
                            type="number"
                            name="idCli"
                            value={reservation.idCli}
                            onChange={handleChange}
                            min="1"
                            required
                        />

                    </div>

                    <div className="reservation-edit-field">

                        <label>ID del salón</label>

                        <input
                            type="number"
                            name="idLounge"
                            value={reservation.idLounge}
                            onChange={handleChange}
                            min="1"
                            required
                        />

                    </div>

                    <div className="reservation-edit-field">

                        <label>ID del tipo de salón</label>

                        <input
                            type="number"
                            name="idLoungeType"
                            value={reservation.idLoungeType}
                            onChange={handleChange}
                            min="1"
                            required
                        />

                    </div>

                    <div className="reservation-edit-buttons">

                        <button
                            type="submit"
                            className="reservation-update-button"
                        >
                            Guardar cambios
                        </button>

                        <button
                            type="button"
                            className="reservation-delete-button"
                            onClick={handleDeleteClick}
                        >
                            Eliminar reserva
                        </button>

                    </div>

                </form>

            )}

            {feedback && (
                <FeedbackModal
                    type={feedback.type}
                    title={feedback.title}
                    message={feedback.message}
                    onClose={() => setFeedback(null)}
                    onConfirm={feedback.onConfirm}
                    confirmLabel={feedback.confirmLabel}
                    cancelLabel="Cancelar"
                    onCancel={feedback.onCancel}
                />
            )}

        </div>
    );
}

export default ReservationEdit;