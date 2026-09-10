import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContractList.css";
import FeedbackModal from "../../components/FeedbackModal.jsx";

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
                    c.modificationStatus === "aprobada" ||
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
        <div className="page-wrapper">

            <div className="client-dashboard table-list-dashboard">

                {/* Header */}
                <header className="dashboard-header-flex">

                    <div className="header-title-group">
                        <div className="header-icon">
                            <IconContract />
                        </div>
                        <div>
                            <h1>Gestión de Contratos</h1>
                            <p>Revisá y gestioná los contratos generados.</p>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button
                            className="btn-back-panel"
                            onClick={() => navigate("/admin-home")}
                        >
                            <IconArrowLeft /> Volver al Panel
                        </button>
                        <button
                            className="btn-submit-cyan"
                            onClick={() => navigate("/contract/edit")}
                        >
                            Editar contrato
                        </button>
                        <div className="count-pill">
                            {filteredContracts.length}
                        </div>
                    </div>

                </header>

                {/* Filtros */}
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

                {/* Tabla */}
                <div className="form-card full-width">

                    <div className="card-body-table">

                        {loading ? (
                            <p className="loading-text">Cargando contratos...</p>
                        ) : filteredContracts.length === 0 ? (
                            <p className="contract-list-empty">No hay contratos en este estado.</p>
                        ) : (
                            <table className="contract-list-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Cliente</th>
                                        <th>Fecha evento</th>
                                        <th>Invitados</th>
                                        <th>Valor final</th>
                                        <th>Estado</th>
                                        <th style={{ textAlign: "center" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredContracts.map((contract) => (
                                        <tr key={contract.idContract}>
                                            <td>{contract.idContract}</td>
                                            <td className="font-semibold">
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
                                                    {contract.modificationStatus === "aprobada" && (
                                                        <span className="contract-list-modbadge approved">
                                                            Modif. aplicada
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions-cell">
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
                        )}

                    </div>

                </div>

            </div>

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