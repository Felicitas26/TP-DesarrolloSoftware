import { useEffect, useState } from "react";
import FeedbackModal from "../../components/FeedbackModal";
import "./ContractEdit.css";

const fmtTime = (value) => {
    if (!value) return "";
    const str = String(value);
    if (/^\d{2}:\d{2}/.test(str)) return str.slice(0, 5);
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
};

function ContractEdit() {

    const [contracts, setContracts] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [contract, setContract] = useState({
        eventStartTime: "",
        eventEndTime: "",
        cantExactaInvit: ""
    });

    const [feedback, setFeedback] = useState(null);

    const token = localStorage.getItem("sty_token");

    const authHeaders = (withBody = false) => ({
        ...(withBody ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    const getContracts = async () => {

        try {
            const response = await fetch(
                "http://localhost:3000/api/contract",
                {
                    headers: authHeaders()
                }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelect = async (e) => {

        const id = e.target.value;

        setSelectedId(id);

        if (!id) {
            setContract({
                eventStartTime: "",
                eventEndTime: "",
                cantExactaInvit: ""
            });

            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/api/contract/${id}`,
                {
                    headers: authHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setContract({
                eventStartTime: fmtTime(data.eventStartTime),
                eventEndTime: fmtTime(data.eventEndTime),
                cantExactaInvit: data.cantExactaInvit ?? ""
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
                `http://localhost:3000/api/contract/${selectedId}/edit`,
                {
                    method: "PUT",
                    headers: authHeaders(true),
                    body: JSON.stringify({
                        eventStartTime: contract.eventStartTime,
                        eventEndTime: contract.eventEndTime,
                        cantExactaInvit: contract.cantExactaInvit === ""
                            ? null
                            : Number(contract.cantExactaInvit)
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
        setFeedback({ type: "confirm", title: "Eliminar contrato", message: "¿Está seguro de que desea eliminar este contrato? El evento asociado quedará dado de baja.", confirmLabel: "Eliminar", onConfirm: handleDeleteConfirm, onCancel: () => setFeedback(null) });
    };

    const handleDeleteConfirm = async () => {

        setFeedback(null);

        try {
            const response = await fetch(
                `http://localhost:3000/api/contract/${selectedId}`,
                {
                    method: "DELETE",
                    headers: authHeaders()
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
                cantExactaInvit: ""
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
            <p>Seleccioná el contrato que querés modificar. El valor final se recalcula automáticamente.</p>

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
                        <label>Cantidad exacta de invitados</label>

                        <input
                            type="number"
                            name="cantExactaInvit"
                            value={contract.cantExactaInvit}
                            onChange={handleChange}
                            min="0"
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