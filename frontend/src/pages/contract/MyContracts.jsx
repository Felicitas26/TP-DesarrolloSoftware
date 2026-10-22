import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contractService } from "../../services";
import FeedbackModal from "../../components/FeedbackModal";
import "./MyContracts.css";

const IconSearch = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const STATUS_OPTIONS = [
    { value: "todas", label: "Todos" },
    { value: "generado", label: "Generados" },
    { value: "en_revision", label: "En revisión" },
    { value: "aprobado", label: "Aprobados" },
    { value: "rechazado", label: "Rechazados" },
    { value: "firmado", label: "Firmados" },
    { value: "con_modificacion", label: "Con modificación" },
    { value: "expirados", label: "Expirados" }
];

const normalizeText = (value) =>
    String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

function MyContracts() {

    const navigate = useNavigate();

    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statusFilter, setStatusFilter] = useState("todas");
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredContracts = (() => {
        let list = contracts;

        if (statusFilter === "expirados") {
            list = list.filter((c) => c.isExpired);
        } else if (statusFilter === "con_modificacion") {
            list = list.filter(
                (c) =>
                    c.modificationStatus === "pendiente" ||
                    c.modificationStatus === "aprobada" ||
                    c.status === "modificacion_en_curso"
            );
        } else if (statusFilter !== "todas") {
            list = list.filter((c) => c.status === statusFilter);
        }

        const term = normalizeText(searchTerm);
        if (term) {
            list = list.filter((c) =>
                [
                    c.idContract,
                    c.reservation?.eventType,
                    c.reservation?.lounge?.name,
                    c.reservation?.loungeType?.nameLoungeType
                ]
                    .map(normalizeText)
                    .some((value) => value.includes(term))
            );
        }

        return list;
    })();

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
                    <>
                        <div className="my-contracts-filters">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className={`my-contracts-filter-btn ${statusFilter === opt.value ? "active" : ""}`}
                                    onClick={() => setStatusFilter(opt.value)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <div className="my-contracts-search">
                            <span className="my-contracts-search-icon">
                                <IconSearch />
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por salón, tipo de evento o N° de contrato..."
                                aria-label="Buscar contratos"
                            />
                        </div>

                        {filteredContracts.length === 0 ? (
                            <p className="my-contracts-empty">
                                No se encontraron contratos con esos criterios.
                            </p>
                        ) : (
                            <div className="my-contracts-list">
                                {filteredContracts.map((contract) => (
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
                                            {contract.isExpired && (
                                                <span className="my-contract-expired">
                                                    Expirado
                                                </span>
                                            )}
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
                    </>
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
