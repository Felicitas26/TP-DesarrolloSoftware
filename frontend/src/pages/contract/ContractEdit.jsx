import { useEffect, useState } from "react";
import FeedbackModal from "../../components/FeedbackModal";
import "./ContractEdit.css";

function ContractEdit() {

    const [contracts, setContracts] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [contract, setContract] = useState({
        eventStartTime: "",
        eventEndTime: "",
        finalValue: "",
        idReservation: ""
    });

    const [feedback, setFeedback] = useState(null);

    const getContracts = async () => {

        try {
            const response = await fetch(
                "http://localhost:3000/api/contract"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setContracts(data);

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    useEffect(() => {
        getContracts();
    }, []);

    const handleSelect = async (e) => {

        const id = e.target.value;

        setSelectedId(id);

        if (!id) {
            setContract({
                eventStartTime: "",
                eventEndTime: "",
                finalValue: "",
                idReservation: ""
            });

            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/api/contract/${id}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setContract({
                eventStartTime: data.eventStartTime,
                eventEndTime: data.eventEndTime,
                finalValue: data.finalValue,
                idReservation: data.idReservation
            });

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    const handleChange = (e) => {
        setContract({
            ...contract,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:3000/api/contract/${selectedId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        eventStartTime: contract.eventStartTime,
                        eventEndTime: contract.eventEndTime,
                        finalValue: Number(contract.finalValue),
                        idReservation: Number(contract.idReservation)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setFeedback({ type: "success", title: "Contrato actualizado", message: "El contrato se actualizó correctamente." });

            await getContracts();

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    const handleDeleteClick = () => {
        setFeedback({ type: "confirm", title: "Eliminar contrato", message: "¿Está seguro de que desea eliminar este contrato?", confirmLabel: "Eliminar", onConfirm: handleDeleteConfirm, onCancel: () => setFeedback(null) });
    };

    const handleDeleteConfirm = async () => {

        setFeedback(null);

        try {
            const response = await fetch(
                `http://localhost:3000/api/contract/${selectedId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setFeedback({ type: "success", title: "Contrato eliminado", message: "El contrato se eliminó correctamente." });

            setSelectedId("");

            setContract({
                eventStartTime: "",
                eventEndTime: "",
                finalValue: "",
                idReservation: ""
            });

            await getContracts();

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    return (
        <div className="contract-edit-container">

            <h1>Editar contrato</h1>
            <p>Seleccioná el contrato que querés modificar.</p>

            <div className="contract-edit-field">

                <label>Contrato</label>

                <select
                    value={selectedId}
                    onChange={handleSelect}
                >
                    <option value="">
                        Seleccionar contrato
                    </option>

                    {contracts.map((item) => (
                        <option
                            key={item.idContract}
                            value={item.idContract}
                        >
                            Contrato #{item.idContract}
                        </option>
                    ))}

                </select>

            </div>

            {selectedId && (

                <form onSubmit={handleUpdate}>

                    <div className="contract-edit-field">
                        <label>Hora de inicio</label>

                        <input
                            type="time"
                            name="eventStartTime"
                            value={contract.eventStartTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="contract-edit-field">
                        <label>Hora de finalización</label>

                        <input
                            type="time"
                            name="eventEndTime"
                            value={contract.eventEndTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="contract-edit-field">
                        <label>Valor final</label>

                        <input
                            type="number"
                            name="finalValue"
                            value={contract.finalValue}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="contract-edit-field">
                        <label>ID de reserva</label>

                        <input
                            type="number"
                            name="idReservation"
                            value={contract.idReservation}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>

                    <div className="contract-edit-buttons">

                        <button
                            type="submit"
                            className="contract-update-button"
                        >
                            Guardar cambios
                        </button>

                        <button
                            type="button"
                            className="contract-delete-button"
                            onClick={handleDeleteClick}
                        >
                            Eliminar contrato
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

export default ContractEdit;