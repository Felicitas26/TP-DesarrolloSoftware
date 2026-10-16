import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contractService } from "../../services";
import FeedbackModal from "../../components/FeedbackModal";
import "./ContractEdit.css";

const IconEdit = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const IconArrowLeft = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

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

    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [contract, setContract] = useState({
        eventStartTime: "",
        eventEndTime: "",
        cantExactaInvit: ""
    });

    const [feedback, setFeedback] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteMotivo, setDeleteMotivo] = useState("");

    const getContracts = async () => {

        try {
            const data = await contractService.getAll();

            setContracts(data);

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    useEffect(() => {
        getContracts();
    }, []);

    const contractLabel = (item) => {
        const date = item.reservation?.dateEvent
            ? new Date(item.reservation.dateEvent).toLocaleDateString("es-AR")
            : "";
        const type = item.reservation?.loungeType?.nameLoungeType;

        if (!date && !type) return `Contrato #${item.idContract}`;

        return [date, type].filter(Boolean).join(" · ");
    };

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
            const data = await contractService.getById(id);

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
            await contractService.updateEdit(selectedId, {
                eventStartTime: contract.eventStartTime,
                eventEndTime: contract.eventEndTime,
                cantExactaInvit: contract.cantExactaInvit === ""
                    ? null
                    : Number(contract.cantExactaInvit)
            });

            setFeedback({ type: "success", title: "Contrato actualizado", message: "El contrato se actualizó correctamente." });

            await getContracts();

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        }
    };

    const handleDeleteClick = () => {
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {

        if (!deleteMotivo.trim()) {
            setFeedback({ type: "error", title: "Falta el motivo", message: "Escribí el motivo de la eliminación para notificarlo al cliente." });
            return;
        }

        setDeleteOpen(false);

        try {
            await contractService.remove(selectedId, { motivo: deleteMotivo.trim() });

            setFeedback({ type: "success", title: "Contrato eliminado", message: "El contrato se eliminó correctamente y el cliente fue notificado." });

            setDeleteMotivo("");

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
        <div className="page-wrapper">

            <div className="client-dashboard contract-form-dashboard">

                {/* Header */}
                <header className="dashboard-header-flex">

                    <div className="header-title-group">
                        <div className="header-icon">
                            <IconEdit />
                        </div>
                        <div>
                            <h1>Editar contrato</h1>
                            <p>Seleccioná el contrato que querés modificar. El valor final se recalcula automáticamente.</p>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button
                            className="btn-back-panel"
                            onClick={() => navigate("/contract")}
                        >
                            <IconArrowLeft /> Volver
                        </button>
                    </div>

                </header>

                {/* Formulario */}
                <div className="form-card">
                    <form onSubmit={handleUpdate} className="contract-form">

                        <div className="form-group">
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
                                        {contractLabel(item)}
                                    </option>
                                ))}

                            </select>
                        </div>

                        {selectedId && (
                            <>
                                <div className="form-group">
                                    <label>Hora de inicio</label>
                                    <input
                                        type="time"
                                        name="eventStartTime"
                                        value={contract.eventStartTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Hora de finalización</label>
                                    <input
                                        type="time"
                                        name="eventEndTime"
                                        value={contract.eventEndTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
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

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="btn-submit-cyan"
                                    >
                                        Guardar cambios
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-danger"
                                        onClick={handleDeleteClick}
                                    >
                                        Eliminar contrato
                                    </button>
                                </div>
                            </>
                        )}

                    </form>
                </div>

            </div>

            {deleteOpen && (
                <div className="edit-confirm-backdrop" onClick={() => setDeleteOpen(false)}>
                    <div className="edit-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="edit-confirm-close" onClick={() => setDeleteOpen(false)} aria-label="Cerrar">✕</button>
                        <h3>Eliminar contrato</h3>
                        <p className="edit-confirm-intro">
                            Esta acción da de baja el contrato y cancela el evento. Indicá el
                            <strong> motivo</strong> de la eliminación: se lo notificaremos al cliente.
                        </p>
                        <textarea
                            className="edit-confirm-textarea"
                            value={deleteMotivo}
                            onChange={(e) => setDeleteMotivo(e.target.value)}
                            placeholder="Motivo de la eliminación..."
                            rows="4"
                        />
                        <div className="edit-confirm-actions">
                            <button className="btn-submit-cyan" onClick={() => setDeleteOpen(false)}>
                                Volver
                            </button>
                            <button
                                className="btn-danger"
                                onClick={handleDeleteConfirm}
                            >
                                Eliminar contrato
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