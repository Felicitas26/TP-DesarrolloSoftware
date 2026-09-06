import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContractList.css";
import FeedbackModal from "../../components/FeedbackModal.jsx";

const STATUS_OPTIONS = [
    { value: "todas", label: "Todas" },
    { value: "en_revision", label: "En revisión" },
    { value: "generado", label: "Generados" },
    { value: "aprobado", label: "Aprobados" },
    { value: "rechazado", label: "Rechazados" },
    { value: "firmado", label: "Firmados" },
    { value: "con_modificacion", label: "Con modificación" },
    { value: "mod_pendiente", label: "Solicitudes pendientes" }
];

const STATUS_LABEL = {
    generado: "Generado",
    en_revision: "En revisión",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
    firmado: "Firmado",
    modificacion_en_curso: "Modificación en curso"
};

function ContractList() {

    const navigate = useNavigate();
    const token = localStorage.getItem("sty_token");

    const [contracts, setContracts] = useState([]);
    const [statusFilter, setStatusFilter] = useState("en_revision");
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);

    const showFeedback = (type, title, message) => {
        setFeedback({ type, title, message });
    };

    const getContracts = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/api/contract",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setContracts(data);
        } catch (error) {
            console.error(error);
            showFeedback("error", "Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            showFeedback("error", "Error", "No estás autenticado. Volvé a iniciar sesión.");
            setLoading(false);
            return;
        }
        getContracts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredContracts = (() => {
        if (statusFilter === "todas") return contracts;

        if (statusFilter === "con_modificacion") {
            return contracts.filter(
                (c) =>
                    c.modificationStatus === "pendiente" ||
                    c.status === "modificacion_en_curso"
            );
        }

        if (statusFilter === "mod_pendiente") {
            return contracts.filter((c) => c.modificationStatus === "pendiente");
        }

        return contracts.filter((c) => c.status === statusFilter);
    })();

    const review = async (id, decision) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/contract/${id}/revision`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ decision })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            showFeedback(
                "success",
                decision === "aprobar" ? "Revisión aprobada" : "Revisión rechazada",
                data.message
            );

            getContracts();
        } catch (error) {
            console.error(error);
            showFeedback("error", "Error", error.message);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("es-AR");
    };

    const currency = (value) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS"
        }).format(Number(value) || 0);
    };

    return (
        <div className="contract-list-container">

            <main className="contract-list-panel">

                <div className="contract-list-header">

                    <div>
                        <h1>Gestión de Contratos</h1>
                        <p>Revisá y gestioná los contratos generados.</p>
                    </div>

                    <div className="contract-list-header-actions">
                        <button
                            className="contract-btn-back"
                            onClick={() => navigate("/admin-home")}
                        >
                            Volver al menú
                        </button>
                        <span>{filteredContracts.length}</span>
                    </div>

                </div>

                <div className="contract-list-filters">
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            className={`contract-filter-btn ${statusFilter === opt.value ? "active" : ""}`}
                            onClick={() => setStatusFilter(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="contract-list-empty">Cargando contratos...</p>
                ) : filteredContracts.length === 0 ? (
                    <p className="contract-list-empty">No hay contratos en este estado.</p>
                ) : (
                    <div className="contract-list-table-container">
                        <table className="contract-list-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Fecha evento</th>
                                    <th>Invitados</th>
                                    <th>Valor final</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContracts.map((contract) => (
                                    <tr key={contract.idContract}>
                                        <td>{contract.idContract}</td>
                                        <td>
                                            {contract.reservation?.client?.nameCli}{" "}
                                            {contract.reservation?.client?.surnameCli}
                                        </td>
                                        <td>{formatDate(contract.reservation?.dateEvent)}</td>
                                        <td>
                                            {contract.reservation
                                                ? `${contract.reservation.cantInvit} - ${contract.reservation.maxCantInvit}`
                                                : ""}
                                        </td>
                                        <td>{currency(contract.finalValue)}</td>
                                        <td>
                                            <div className="contract-list-status-wrap">
                                                <span className={`contract-list-status ${contract.status}`}>
                                                    {STATUS_LABEL[contract.status] || contract.status}
                                                </span>
                                                {contract.modificationStatus === "pendiente" && (
                                                    <span className="contract-list-modbadge">
                                                        Modif. pendiente
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contract-actions-row">
                                                <button
                                                    className="contract-action-view"
                                                    onClick={() => navigate(`/contract/${contract.idContract}`)}
                                                >
                                                    Ver
                                                </button>

                                                {contract.status === "en_revision" && (
                                                    <>
                                                        <button
                                                            className="contract-action-approve"
                                                            onClick={() => review(contract.idContract, "aprobar")}
                                                        >
                                                            Aprobar
                                                        </button>
                                                        <button
                                                            className="contract-action-reject"
                                                            onClick={() => review(contract.idContract, "rechazar")}
                                                        >
                                                            Rechazar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </main>

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

export default ContractList;
