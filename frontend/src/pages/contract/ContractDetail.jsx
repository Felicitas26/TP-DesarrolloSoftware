import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FeedbackModal from "../../components/FeedbackModal";
import "./ContractDetail.css";

const LEGAL_CLAUSES = [
    {
        title: "1. OBJETO",
        text: "El presente contrato regula la prestación del servicio de alquiler del salón de eventos y servicios conexos por parte de SALON STYLO en favor del CLIENTE, para la realización del evento detallado en la reserva."
    },
    {
        title: "2. PRECIO Y SEÑA",
        text: "El precio total del servicio es el detallado en el apartado de 'Desglose de precios' del presente contrato. El CLIENTE abonará una seña equivalente al porcentaje estipulado por SALON STYLO a la firma de este contrato, y el saldo restante conforme a las condiciones de pago acordadas. El monto de la seña será imputado al precio final."
    },
    {
        title: "3. HORARIOS",
        text: "El evento se desarrollará en el horario indicado en el presente contrato. El CLIENTE se compromete a respetar los horarios de ingreso y egreso acordados, así como los tiempos de montaje y desmontaje fijados por SALON STYLO."
    },
    {
        title: "4. CANTIDAD DE INVITADOS",
        text: "La cantidad exacta de invitados queda fijada en el presente contrato y deberá encontrarse dentro del rango de cantidades prestablecidas en la reserva. El precio del servicio puede variar en función de la cantidad de invitados informada."
    },
    {
        title: "5. OBLIGACIONES DEL CLIENTE",
        text: "El CLIENTE deberá concurrir en tiempo y forma, respetar las normas del establecimiento, no introducir elementos dañinos ni realizar modificaciones no autorizadas. Todo servicio extra solicitado deberá ser abonado según su valor."
    },
    {
        title: "6. DAÑOS Y RESPONSABILIDAD",
        text: "El CLIENTE será responsable por los daños ocasionados en las instalaciones, mobiliario y/o equipamiento durante el evento. SALON STYLO no se responsabiliza por objetos personales dejados en las instalaciones."
    },
    {
        title: "7. CANCELACIÓN Y RESOLUCIÓN",
        text: "En caso de cancelación, se aplicarán las penalidades establecidas por SALON STYLO. SALON STYLO podrá resolver el contrato si el CLIENTE incumple las obligaciones establecidas, sin perjuicio de las acciones legales correspondientes."
    },
    {
        title: "8. JURISDICCIÓN",
        text: "Las partes se someten a la jurisdicción de los tribunales ordinarios de la ciudad donde se encuentra el salón, renunciando a cualquier otro fuero que pudiera corresponder."
    }
];

const STATUS_LABEL = {
    generado: "Generado (pendiente de completar)",
    en_revision: "En revisión",
    aprobado: "Aprobado — listo para firma",
    rechazado: "Rechazado (requiere correcciones)",
    firmado: "Firmado"
};

function ContractDetail() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [contract, setContract] = useState(null);
    const [mountData, setMountData] = useState({
        lounges: [],
        loungeTypes: [],
        cardDetails: [],
        extraServices: []
    });

    const [form, setForm] = useState({
        dateEvent: "",
        eventType: "",
        idCardDetail: "",
        idServices: [],
        cantExactaInvit: "",
        eventStartTime: "",
        eventEndTime: ""
    });

    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const rol = localStorage.getItem("sty_rol");
    const token = localStorage.getItem("sty_token");

    const EVENT_TYPES = [
        "Casamiento",
        "Cumpleaños",
        "Cumpleaños +40",
        "Fiesta de 15",
        "Empresa / Corporativo",
        "Otro"
    ];

    const canEdit = contract && ["generado", "rechazado"].includes(contract.status);

    const showMessage = (type, title, text) => {
        setMessage({ type, title, text });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const dateOnly = String(dateStr).split("T")[0];
        const [year, month, day] = dateOnly.split("-");
        if (!year || !month || !day) return dateOnly;
        return `${day}/${month}/${year}`;
    };

    const formatTime = (t) => {
        if (!t) return "";
        if (typeof t === "string" && !t.includes("T")) return t;
        const d = new Date(t);
        if (Number.isNaN(d.getTime())) return "";
        const hh = String(d.getUTCHours()).padStart(2, "0");
        const mm = String(d.getUTCMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
    };

    const currency = (value) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS"
        }).format(Number(value) || 0);
    };

    useEffect(() => {
        const getCatalog = async () => {
            try {
                const res = await Promise.all([
                    fetch("http://localhost:3000/api/lounge"),
                    fetch("http://localhost:3000/api/loungeType"),
                    fetch("http://localhost:3000/api/cardDetail"),
                    fetch("http://localhost:3000/api/extraservice")
                ]);
                const data = await Promise.all(res.map((r) => r.json()));
                setMountData({
                    lounges: data[0],
                    loungeTypes: data[1],
                    cardDetails: data[2],
                    extraServices: data[3]
                });
            } catch (error) {
                console.error("Error al obtener el catálogo:", error);
            }
        };
        getCatalog();
    }, []);

    useEffect(() => {
        const getContract = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/contract/${id}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "No se pudo cargar el contrato.");
                }

                setContract(data);

                setForm({
                    dateEvent: data.reservation?.dateEvent
                        ? data.reservation.dateEvent.split("T")[0]
                        : "",
                    eventType: data.reservation?.eventType || "",
                    idCardDetail: data.reservation?.idCardDetail
                        ? String(data.reservation.idCardDetail)
                        : "",
                    idServices:
                        (data.extraServices || []).map(
                            (s) => s.idService
                        ) || [],
                    cantExactaInvit:
                        data.cantExactaInvit !== null &&
                            data.cantExactaInvit !== undefined
                            ? String(data.cantExactaInvit)
                            : "",
                    eventStartTime: formatTime(data.eventStartTime),
                    eventEndTime: formatTime(data.eventEndTime)
                });

            } catch (error) {
                showMessage("error", "Error", error.message);
            } finally {
                setLoading(false);
            }
        };
        getContract();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const guestRanges = mountData.loungeTypes
        .filter(
            (type) =>
                String(type.idLounge) ===
                String(contract?.reservation?.idLounge)
        )
        .map((type) => ({
            min: type.minQuantity,
            max: type.maxQuantity,
            label: `${type.minQuantity} - ${type.maxQuantity} invitados`
        }));

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleServiceChange = (idService) => {
        let updated = [...form.idServices];
        if (updated.includes(idService)) {
            updated = updated.filter((sid) => sid !== idService);
        } else {
            updated.push(idService);
        }
        setForm({ ...form, idServices: updated });
    };

    const handleSave = async () => {
        setMessage(null);
        setSaving(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/contract/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        dateEvent: form.dateEvent,
                        eventType: form.eventType,
                        idCardDetail: form.idCardDetail
                            ? Number(form.idCardDetail)
                            : null,
                        idServices: form.idServices,
                        cantExactaInvit: form.cantExactaInvit
                            ? Number(form.cantExactaInvit)
                            : null,
                        eventStartTime: form.eventStartTime || null,
                        eventEndTime: form.eventEndTime || null
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo guardar el contrato.");
            }

            setContract(data.contract);
            setForm((prev) => ({
                ...prev,
                cantExactaInvit:
                    data.contract.cantExactaInvit !== null &&
                        data.contract.cantExactaInvit !== undefined
                        ? String(data.contract.cantExactaInvit)
                        : "",
                eventStartTime: formatTime(data.contract.eventStartTime),
                eventEndTime: formatTime(data.contract.eventEndTime)
            }));

            showMessage("success", "Contrato guardado", "Los cambios se guardaron correctamente.");
        } catch (error) {
            showMessage("error", "Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEnviar = async () => {
        setMessage(null);
        setSaving(true);

        try {
            const saveResponse = await fetch(
                `http://localhost:3000/api/contract/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        dateEvent: form.dateEvent,
                        eventType: form.eventType,
                        idCardDetail: form.idCardDetail
                            ? Number(form.idCardDetail)
                            : null,
                        idServices: form.idServices,
                        cantExactaInvit: form.cantExactaInvit
                            ? Number(form.cantExactaInvit)
                            : null,
                        eventStartTime: form.eventStartTime || null,
                        eventEndTime: form.eventEndTime || null
                    })
                }
            );

            if (!saveResponse.ok) {
                const saveData = await saveResponse.json();
                throw new Error(saveData.error || "No se pudieron guardar los cambios antes de enviar.");
            }

            const enviarResponse = await fetch(
                `http://localhost:3000/api/contract/${id}/enviar`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await enviarResponse.json();

            if (!enviarResponse.ok) {
                throw new Error(data.error || "No se pudo enviar el contrato.");
            }

            setContract(data.contract);
            showMessage("success", "Contrato enviado", "El contrato se envió para revisión.");
        } catch (error) {
            showMessage("error", "Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAceptar = async () => {
        setMessage(null);
        setSaving(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/contract/${id}/aceptar`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo firmar el contrato.");
            }

            setContract(data.contract);
            showMessage("success", "Contrato firmado", "Aceptaste la conformidad del contrato.");
        } catch (error) {
            showMessage("error", "Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="contract-detail-container">
                <p className="contract-detail-message">Cargando contrato...</p>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="contract-detail-container">
                <p className="contract-detail-message">No se encontró el contrato.</p>
                <button className="contract-detail-back" onClick={() => navigate(rol === "administrador" ? "/contract" : "/my-contracts")}>
                    Volver
                </button>
            </div>
        );
    }

    const reservation = contract.reservation;

    return (
        <div className="contract-detail-container">

            <header className="contract-detail-header">
                <div>
                    <h1>Contrato #{contract.idContract}</h1>
                    <span className={`contract-status ${contract.status}`}>
                        {STATUS_LABEL[contract.status] || contract.status}
                    </span>
                </div>
                <button className="contract-detail-back" onClick={() => navigate(rol === "administrador" ? "/contract" : "/my-contracts")}>
                    Volver
                </button>
            </header>

            <main className="contract-detail-content">

                {/* PARTES */}
                <section className="contract-section">
                    <h2>Partes</h2>
                    <div className="contract-parties">
                        <div className="contract-party">
                            <h3>SALON STYLO</h3>
                            <p>{reservation.lounge?.name}</p>
                            <p>{reservation.lounge?.loungeAddress}</p>
                        </div>
                        <div className="contract-party">
                            <h3>CLIENTE</h3>
                            <p>{reservation.client?.nameCli} {reservation.client?.surnameCli}</p>
                            <p>DNI: {reservation.client?.dniCli}</p>
                            <p>{reservation.client?.addressCli}, {reservation.client?.location?.city}</p>
                            <p>{reservation.client?.phoneCli} · {reservation.client?.emailCli}</p>
                        </div>
                    </div>
                </section>

                {/* DATOS DEL EVENTO (editables) */}
                <section className="contract-section">
                    <h2>Datos del evento</h2>
                    <div className="contract-fields">
                        <div className="contract-field">
                            <label>Fecha del evento</label>
                            {canEdit ? (
                                <input type="date" name="dateEvent" value={form.dateEvent} onChange={handleChange} />
                            ) : (
                                <span>{formatDate(reservation.dateEvent)}</span>
                            )}
                        </div>

                        <div className="contract-field">
                            <label>Tipo de evento</label>
                            {canEdit ? (
                                <select name="eventType" value={form.eventType} onChange={handleChange}>
                                    <option value="" disabled>Seleccioná el tipo de evento...</option>
                                    {EVENT_TYPES.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            ) : (
                                <span>{reservation.eventType}</span>
                            )}
                        </div>

                        <div className="contract-field">
                            <label>Salón</label>
                            <span>{reservation.lounge?.name} — {reservation.loungeType?.nameLoungeType}</span>
                        </div>

                        <div className="contract-field">
                            <label>Cantidades prestablecidas</label>
                            <span>{reservation.cantInvit} - {reservation.maxCantInvit} invitados</span>
                        </div>
                    </div>
                </section>

                {/* CANTIDAD EXACTA + HORARIOS */}
                <section className="contract-section">
                    <h2>Cantidad de invitados y horario</h2>
                    <div className="contract-fields">
                        <div className="contract-field">
                            <label>Cantidad exacta de invitados</label>
                            {canEdit ? (
                                <input
                                    type="number"
                                    name="cantExactaInvit"
                                    value={form.cantExactaInvit}
                                    onChange={handleChange}
                                    min={reservation.cantInvit}
                                    max={reservation.maxCantInvit}
                                    placeholder={`${reservation.cantInvit} - ${reservation.maxCantInvit}`}
                                />
                            ) : (
                                <span>{contract.cantExactaInvit ?? "—"}</span>
                            )}
                            <small>Debe estar entre {reservation.cantInvit} y {reservation.maxCantInvit} invitados.</small>
                        </div>

                        <div className="contract-field">
                            <label>Hora de inicio del evento</label>
                            {canEdit ? (
                                <input type="time" name="eventStartTime" value={form.eventStartTime} onChange={handleChange} />
                            ) : (
                                <span>{formatTime(contract.eventStartTime) || "—"}</span>
                            )}
                        </div>

                        <div className="contract-field">
                            <label>Hora de fin del evento</label>
                            {canEdit ? (
                                <input type="time" name="eventEndTime" value={form.eventEndTime} onChange={handleChange} />
                            ) : (
                                <span>{formatTime(contract.eventEndTime) || "—"}</span>
                            )}
                        </div>
                    </div>
                </section>

                {/* MENÚ Y EXTRAS */}
                <section className="contract-section">
                    <h2>Menú y servicios</h2>

                    <div className="contract-field">
                        <label>Menú</label>
                        {canEdit ? (
                            mountData.cardDetails.map((menu) => (
                                <label className="contract-option" key={menu.idCardDetail}>
                                    <input
                                        type="radio"
                                        name="idCardDetail"
                                        value={menu.idCardDetail}
                                        checked={form.idCardDetail === String(menu.idCardDetail)}
                                        onChange={handleChange}
                                    />
                                    <span><strong>{menu.menuStage}</strong> — {menu.detail} ({currency(menu.budget)} por persona)</span>
                                </label>
                            ))
                        ) : (
                            <span>{reservation.cardDetail?.menuStage || "Sin menú"}</span>
                        )}
                    </div>

                    <div className="contract-field">
                        <label>Servicios extras</label>
                        {canEdit ? (
                            mountData.extraServices.map((service) => (
                                <label className="contract-option" key={service.idService}>
                                    <input
                                        type="checkbox"
                                        checked={form.idServices.includes(service.idService)}
                                        onChange={() => handleServiceChange(service.idService)}
                                    />
                                    <span><strong>{service.nameService}</strong> — {service.detailService} ({currency(service.cost)})</span>
                                </label>
                            ))
                        ) : (
                            <span>
                                {contract.extraServices && contract.extraServices.length > 0
                                    ? contract.extraServices.map((s) => s.nameService).join(", ")
                                    : "Ninguno"}
                            </span>
                        )}
                    </div>
                </section>

                {/* CLAUSULAS TECNICAS */}
                <section className="contract-section">
                    <h2>Cláusulas del contrato</h2>
                    {LEGAL_CLAUSES.map((clause) => (
                        <div className="contract-clause" key={clause.title}>
                            <h3>{clause.title}</h3>
                            <p>{clause.text}</p>
                        </div>
                    ))}
                    <p className="contract-legal-note">
                        Estas cláusulas son de carácter técnico y no pueden ser modificadas.
                    </p>
                </section>

                {/* DESGLOSE */}
                <section className="contract-section">
                    <h2>Desglose de precios</h2>
                    <table className="contract-price-table">
                        <tbody>
                            <tr>
                                <td>Salón (fecha {formatDate(reservation.dateEvent)})</td>
                                <td>{currency(contract.calc?.priceSalon)}</td>
                            </tr>
                            <tr>
                                <td>Menú ({reservation.cardDetail?.menuStage || "—"} × {contract.cantExactaInvit ?? 0} invitados)</td>
                                <td>{currency(contract.calc?.menuValue)}</td>
                            </tr>
                            <tr>
                                <td>Servicios extras</td>
                                <td>{currency(contract.calc?.totalExtras)}</td>
                            </tr>
                            <tr className="contract-price-total">
                                <td>Valor final</td>
                                <td>{currency(contract.finalValue)}</td>
                            </tr>
                        </tbody>
                    </table>
                    {!contract.calc?.hasPrice && (
                        <small className="contract-warning">
                            No hay un precio de salón vigente cargado, por lo que se consideró $0 para el salón. Contactá al administrador.
                        </small>
                    )}
                </section>

                {/* ACCIONES */}
                <section className="contract-actions">

                    {rol === "cliente" && canEdit && (
                        <>
                            <button className="contract-btn-save" onClick={handleSave} disabled={saving}>
                                {saving ? "Guardando..." : "Guardar cambios"}
                            </button>
                            <button className="contract-btn-primary" onClick={handleEnviar} disabled={saving}>
                                Enviar para revisión
                            </button>
                        </>
                    )}

                    {rol === "cliente" && contract.status === "aprobado" && (
                        <button className="contract-btn-accept" onClick={handleAceptar} disabled={saving}>
                            Aceptar contrato (firmar)
                        </button>
                    )}

                    {rol === "cliente" && contract.status !== "aprobado" && !canEdit && contract.status !== "firmado" && (
                        <p className="contract-pending-note">
                            El contrato está en revisión por el administrador.
                        </p>
                    )}

                </section>

            </main>

            {message && (
                <FeedbackModal
                    type={message.type}
                    title={message.title}
                    message={message.text}
                    onClose={() => setMessage(null)}
                />
            )}

        </div>
    );
}

export default ContractDetail;
