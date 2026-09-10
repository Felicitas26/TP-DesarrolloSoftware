import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "../../components/FeedbackModal";
import "./ContractNew.css";

const IconContract = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const IconArrowLeft = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

function ContractNew() {

    const [idReservation, setIdReservation] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("sty_token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);

        try {
            const response = await fetch("http://localhost:3000/api/contract", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    idReservation: Number(idReservation)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setFeedback({
                type: "success",
                title: "Contrato creado",
                message: `El contrato #${data.contract.idContract} se generó correctamente a partir de la reserva.`,
                onClose: () => navigate("/contract")
            });

            setIdReservation("");

        } catch (error) {
            console.error(error);
            setFeedback({ type: "error", title: "Error", message: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-wrapper">

            <div className="client-dashboard contract-form-dashboard">

                {/* Header */}
                <header className="dashboard-header-flex">

                    <div className="header-title-group">
                        <div className="header-icon">
                            <IconContract />
                        </div>
                        <div>
                            <h1>Nuevo contrato</h1>
                            <p>Generá el contrato a partir de una reserva aceptada.</p>
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
                    <form onSubmit={handleSubmit} className="contract-form">

                        <div className="form-group">
                            <label>ID de reserva</label>
                            <input
                                type="number"
                                name="idReservation"
                                value={idReservation}
                                onChange={(e) => setIdReservation(e.target.value)}
                                min="1"
                                required
                                placeholder="Ingresá el ID de la reserva"
                            />
                        </div>

                        <button type="submit" className="btn-submit-cyan" disabled={submitting}>
                            {submitting ? "Generando..." : "Crear contrato"}
                        </button>

                    </form>
                </div>

            </div>

            {feedback && (
                <FeedbackModal
                    type={feedback.type}
                    title={feedback.title}
                    message={feedback.message}
                    onClose={feedback.onClose || (() => setFeedback(null))}
                />
            )}

        </div>
    );
}

export default ContractNew;