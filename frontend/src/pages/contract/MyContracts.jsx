import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contractService } from "../../services";
import FeedbackModal from "../../components/FeedbackModal";
import "./MyContracts.css";

function MyContracts() {

    const navigate = useNavigate();

    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const getContracts = async () => {
            try {
                const data = await contractService.getMine();

                setContracts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getContracts();
    }, []);

    const formatDate = (date) => {
        if (!date) return "";
        const dateOnly = date.split("T")[0];
        const [year, month, day] = dateOnly.split("-");
        return `${day}/${month}/${year}`;
    };

    const currency = (value) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS"
        }).format(Number(value) || 0);
    };

    if (loading) {
        return (
            <div className="my-contracts-container">
                <p className="my-contracts-message">Cargando contratos...</p>
            </div>
        );
    }

    return (
        <div className="my-contracts-container">

            <header className="my-contracts-bar">
                <div className="my-contracts-logo">SALON STYLO</div>
                <button className="my-contracts-back-button" onClick={() => navigate("/client-home")}>
                    Volver al menú
                </button>
            </header>

            <main className="my-contracts-content">

                <div className="my-contracts-title">
                    <h1>Mis contratos</h1>
                    <p>Acá podés completar, enviar y firmar los contratos de tus reservas aceptadas.</p>
                </div>

                {error ? (
                    <p className="my-contracts-message">{error}</p>
                ) : contracts.length === 0 ? (
                    <p className="my-contracts-empty">No tenés contratos generados.</p>
                ) : (
                    <div className="my-contracts-list">
                        {contracts.map((contract) => (
                            <div className="my-contract-card" key={contract.idContract}>
                                <div className="my-contract-card-header">
                                    <h2>Contrato #{contract.idContract}</h2>
                                    <button
                                        className="my-contract-view"
                                        onClick={() => navigate(`/contract/${contract.idContract}`)}
                                    >
                                        Ver contrato
                                    </button>
                                </div>

                                <p>
                                    <strong>Fecha del evento:</strong>{" "}
                                    {formatDate(contract.reservation?.dateEvent)}
                                </p>
                                <p>
                                    <strong>Tipo de evento:</strong>{" "}
                                    {contract.reservation?.eventType}
                                </p>
                                <p>
                                    <strong>Salón:</strong>{" "}
                                    {contract.reservation?.lounge?.name} —{" "}
                                    {contract.reservation?.loungeType?.nameLoungeType}
                                </p>
                                <p>
                                    <strong>Cantidad exacta de invitados:</strong>{" "}
                                    {contract.cantExactaInvit ?? "Sin cargar"}
                                </p>
                                <p>
                                    <strong>Valor final:</strong> {currency(contract.finalValue)}
                                </p>
                                <p>
                                    <strong>Estado:</strong>{" "}
                                    <span className={`my-contract-status ${contract.status}`}>
                                        {contract.statusDescription}
                                    </span>
                                    {contract.modificationStatus === "pendiente" && (
                                        <span className="my-contract-modbadge">
                                            Modificación pendiente
                                        </span>
                                    )}
                                    {contract.modificationStatus === "aprobada" && (
                                        <span className="my-contract-modbadge approved">
                                            Modificación aprobada — firmá de nuevo
                                        </span>
                                    )}
                                    {contract.modificationStatus === "rechazada" && (
                                        <span className="my-contract-rejbadge">
                                            Modificación rechazada — decidí cómo continuar
                                        </span>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

            </main>

            <footer className="my-contracts-footer">
                <span>© {new Date().getFullYear()} STYLO. Todos los derechos reservados.</span>
            </footer>

            {feedback && (
                <FeedbackModal
                    type={feedback.type}
                    title={feedback.title}
                    message={feedback.message}
                    onClose={() => setFeedback(null)}
                />
            )}

        </div>
    );
}

export default MyContracts;
