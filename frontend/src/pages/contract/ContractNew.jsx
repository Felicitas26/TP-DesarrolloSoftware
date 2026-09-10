import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "../../components/FeedbackModal";
import "./ContractNew.css";

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
        <div className="contract-new-container">

            <h1>Nuevo contrato</h1>
            <p>Generá el contrato a partir de una reserva aceptada.</p>

            <form onSubmit={handleSubmit}>

                <div className="contract-new-field">
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

                <button type="submit" disabled={submitting}>
                    {submitting ? "Generando..." : "Crear contrato"}
                </button>

            </form>

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