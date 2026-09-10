import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FeedbackModal from "../../components/FeedbackModal";
import "./ContractDetail.css";

const IconContract = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

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
    firmado: "Firmado",
    modificacion_en_curso: "Modificación aprobada — revisá y confirmá"
};

const PAYMENT_STATUS_LABEL = {
    pendiente: "Pendiente de abono",
    seña: "Seña abonada",
    pagado: "Saldo abonado"
};

const TERMINOS_FIRMA = [
    "El presente contrato constituye el acuerdo definitivo entre el CLIENTE y SALON STYLO para la realización del evento detallado en la reserva.",
    "Al aceptar, el CLIENTE se compromete al cumplimiento de todas las cláusulas del contrato, incluidas las condiciones de pago, los horarios y la cantidad de invitados informada.",
    "La cantidad exacta de invitados y los valores asociados quedan fijados según el desglose de precios del contrato.",
    "La seña abonada será imputada al precio final y la cancelación del evento queda sujeta a las penalidades de la cláusula de cancelación.",
    "El CLIENTE se compromete a respetar las normas del establecimiento y a responder por los daños ocasionados durante el evento.",
    "SALON STYLO no se responsabiliza por los objetos personales dejados en las instalaciones.",
    "Cualquier modificación posterior a la firma debe solicitarse hasta 2 semanas antes del evento y queda sujeta a la aprobación del administrador."
];

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

    const [modificando, setModificando] = useState(false);
    const [commentMod, setCommentMod] = useState("");
    const [showTerminos, setShowTerminos] = useState(false);
    const [confirmCancelar, setConfirmCancelar] = useState(false);
    const [pendingRedirect, setPendingRedirect] = useState(false);
    const [activePrice, setActivePrice] = useState(null);

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
    const tieneModPendiente = contract?.modificationStatus === "pendiente";
    const tieneModRechazada =
        rol === "cliente" &&
        contract?.status === "firmado" &&
        contract?.modificationStatus === "rechazada";

    const puedeEditar = canEdit;

    const showMessage = (type, title, text) => {
        setMessage({ type, title, text });
    };

    const closeMessage = () => {
        setMessage(null);
        if (pendingRedirect) {
            setPendingRedirect(false);
            navigate("/client-home");
        }
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
                    fetch("http://localhost:3000/api/extraService")
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

    useEffect(() => {
        const idLoungeType = contract?.reservation?.idLoungeType;
        const dateEvent = form.dateEvent ||
            (contract?.reservation?.dateEvent
                ? contract.reservation.dateEvent.split("T")[0]
                : "");

        if (!idLoungeType || !dateEvent) return;

        let cancelled = false;

        fetch(`http://localhost:3000/api/price/activo/${idLoungeType}/${dateEvent}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!cancelled) setActivePrice(data);
            })
            .catch(() => {
                if (!cancelled) setActivePrice(null);
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract?.reservation?.idLoungeType, form.dateEvent]);

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
            navigate("/client-home");
        } catch (error) {
            showMessage("error", "Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSolicitarMod = async () => {
        setMessage(null);
        setSaving(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/contract/${id}/modificacion`,
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
                        eventEndTime: form.eventEndTime || null,
                        comment: commentMod || null
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo solicitar la modificación.");
            }

            setContract(data.contract);
            setModificando(false);
            setCommentMod("");
            showMessage("success", "Modificación solicitada", "Tu solicitud quedó pendiente de aprobación por el administrador.");
        } catch (error) {
            showMessage("error", "Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleRevisarMod = async (decision) => {
        setMessage(null);
        setSaving(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/contract/${id}/modificacion/revision`,
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
                throw new Error(data.error || "No se pudo revisar la modificación.");
            }

            setContract(data.contract);
            showMessage(
                "success",
                decision === "aprobar" ? "Modificación aprobada" : "Modificación rechazada",
                data.message
            );
        } catch (error) {
            showMessage("error", "Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleContinuarContrato = async () => {
        setMessage(null);
        setSaving(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/contract/${id}/modificacion/rechazo`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ decision: "continuar" })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo procesar tu decisión.");
            }

            setContract(data.contract);
            showMessage("success", "Contrato vigente", "Continuás con el contrato como estaba.");
        } catch (error) {
            showMessage("error", "Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelarEvento = async () => {
        setConfirmCancelar(false);
        setMessage(null);
        setSaving(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/contract/${id}/modificacion/rechazo`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ decision: "cancelar" })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo cancelar el evento.");
            }

            setPendingRedirect(true);
            showMessage("success", "Evento cancelado", data.message);
        } catch (error) {
            showMessage("error", "Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCambiarPago = async (statusPayment) => {
        if (!payment) return;
        setMessage(null);
        setSaving(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/payment/${payment.idPayment}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ statusPayment })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo actualizar el pago.");
            }

            setContract({
                ...contract,
                payments: [{ ...payment, statusPayment }]
            });

            showMessage(
                "success",
                "Pago actualizado",
                statusPayment === "pagado"
                    ? "El saldo fue marcado como abonado."
                    : "El pago volvió a estado pendiente."
            );
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
            navigate("/client-home");
        } catch (error) {
            showMessage("error", "Error", error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="client-dashboard contract-detail-dashboard">
                    <p className="contract-detail-message">Cargando contrato...</p>
                </div>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="page-wrapper">
                <div className="client-dashboard contract-detail-dashboard">
                    <p className="contract-detail-message">No se encontró el contrato.</p>
                    <div className="header-actions">
                        <button className="btn-back-panel" onClick={() => navigate(rol === "administrador" ? "/contract" : "/my-contracts")}>
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const reservation = contract.reservation;

    const payment = contract.payments?.[0] || null;

    const fecEvento = form.dateEvent ||
        (reservation?.dateEvent ? reservation.dateEvent.split("T")[0] : "");

    const diasHastaEvento = (() => {
        if (!fecEvento) return null;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const evento = new Date(`${fecEvento}T00:00:00`);
        return Math.round((evento.getTime() - hoy.getTime()) / 86400000);
    })();

    const puedeSolicitarMod =
        rol === "cliente" &&
        contract.status === "firmado" &&
        !tieneModPendiente &&
        !tieneModRechazada &&
        diasHastaEvento !== null &&
        diasHastaEvento >= 14;

    const cantExactaVal =
        form.cantExactaInvit === "" ||
        form.cantExactaInvit === undefined ||
        form.cantExactaInvit === null
            ? null
            : Number(form.cantExactaInvit);

    const menuActual = mountData.cardDetails.find(
        (m) => String(m.idCardDetail) === String(form.idCardDetail)
    );
    const menuStage = menuActual?.menuStage || reservation?.cardDetail?.menuStage || "—";

    const calcLive = (() => {
        const priceSalon = activePrice ? Number(activePrice.value) : 0;
        const menuBudget = menuActual ? Number(menuActual.budget) : 0;
        const menuValue = cantExactaVal ? menuBudget * cantExactaVal : 0;
        const totalExtras = (form.idServices || []).reduce((acc, sid) => {
            const svc = mountData.extraServices.find(
                (s) => s.idService === Number(sid)
            );
            return acc + (svc ? Number(svc.cost) : 0);
        }, 0);
        const total = Math.round((priceSalon + menuValue + totalExtras) * 100) / 100;
        return {
            priceSalon,
            menuValue,
            totalExtras,
            total,
            hasPrice: Boolean(activePrice),
            menuBudget
        };
    })();

    const modMenu = mountData.cardDetails.find(
        (m) => String(m.idCardDetail) === String(contract.modificationData?.idCardDetail)
    );
    const modExtras = (contract.modificationData?.idServices || []).map(
        (sid) => mountData.extraServices.find((s) => s.idService === Number(sid))?.nameService
    ).filter(Boolean);

    const modDiffs = (() => {
        const d = contract.modificationData || {};
        const res = reservation || {};
        const diffs = [];

        const curDate = res.dateEvent ? res.dateEvent.split("T")[0] : "";
        const newDate = d.dateEvent ? d.dateEvent.split("T")[0] : "";
        if (newDate && newDate !== curDate) {
            diffs.push({
                campo: "Fecha del evento",
                actual: formatDate(curDate) || "—",
                nuevo: formatDate(newDate)
            });
        }

        if (d.eventType && d.eventType !== res.eventType) {
            diffs.push({
                campo: "Tipo de evento",
                actual: res.eventType || "—",
                nuevo: d.eventType
            });
        }

        if (d.cantExactaInvit != null && Number(d.cantExactaInvit) !== Number(contract.cantExactaInvit)) {
            diffs.push({
                campo: "Cantidad de invitados",
                actual: contract.cantExactaInvit ?? "—",
                nuevo: `${d.cantExactaInvit} invitados`
            });
        }

        if (d.eventStartTime && formatTime(d.eventStartTime) !== formatTime(contract.eventStartTime)) {
            diffs.push({
                campo: "Hora de inicio",
                actual: formatTime(contract.eventStartTime) || "—",
                nuevo: formatTime(d.eventStartTime)
            });
        }

        if (d.eventEndTime && formatTime(d.eventEndTime) !== formatTime(contract.eventEndTime)) {
            diffs.push({
                campo: "Hora de fin",
                actual: formatTime(contract.eventEndTime) || "—",
                nuevo: formatTime(d.eventEndTime)
            });
        }

        if (d.idCardDetail != null && String(d.idCardDetail) !== String(res.idCardDetail)) {
            diffs.push({
                campo: "Menú",
                actual: res.cardDetail?.menuStage || "—",
                nuevo: modMenu ? `${modMenu.menuStage} — ${modMenu.detail}` : "—"
            });
        }

        const curIds = (contract.extraServices || [])
            .map((s) => Number(s.idService))
            .sort((a, b) => a - b);
        const newIds = Array.isArray(d.idServices)
            ? d.idServices.map((s) => Number(s)).sort((a, b) => a - b)
            : null;

        if (newIds && newIds.join(",") !== curIds.join(",")) {
            diffs.push({
                campo: "Servicios extras",
                actual: curIds.length > 0
                    ? (contract.extraServices || []).map((s) => s.nameService).join(", ")
                    : "Ninguno",
                nuevo: modExtras.length > 0 ? modExtras.join(", ") : "Ninguno"
            });
        }

        return diffs;
    })();

    const modAppliedList = (() => {
        const d = contract.modificationData || {};
        const applied = [];

        if (d.dateEvent) {
            applied.push({ campo: "Fecha del evento", valor: formatDate(d.dateEvent) });
        }
        if (d.eventType) {
            applied.push({ campo: "Tipo de evento", valor: d.eventType });
        }
        if (d.cantExactaInvit != null) {
            applied.push({ campo: "Cantidad exacta de invitados", valor: `${d.cantExactaInvit} invitados` });
        }
        if (d.eventStartTime) {
            applied.push({ campo: "Hora de inicio", valor: formatTime(d.eventStartTime) });
        }
        if (d.eventEndTime) {
            applied.push({ campo: "Hora de fin", valor: formatTime(d.eventEndTime) });
        }
        if (d.idCardDetail != null) {
            applied.push({
                campo: "Menú",
                valor: modMenu ? `${modMenu.menuStage} — ${modMenu.detail}` : "—"
            });
        }
        if (Array.isArray(d.idServices)) {
            applied.push({
                campo: "Servicios extras",
                valor: modExtras.length > 0 ? modExtras.join(", ") : "Ninguno"
            });
        }

        return applied;
    })();

    const modNuevos = modDiffs.map((diff) => ({
        campo: diff.campo,
        valor: diff.nuevo
    }));

    return (
        <div className="page-wrapper">

            <div className="client-dashboard contract-detail-dashboard">

            <header className="dashboard-header-flex">
                <div className="header-title-group">
                    <div className="header-icon">
                        <IconContract />
                    </div>
                    <div>
                        <h1>Contrato #{contract.idContract}</h1>
                        <span className={`contract-status ${contract.status}`}>
                            {STATUS_LABEL[contract.status] || contract.status}
                        </span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-back-panel" onClick={() => navigate(rol === "administrador" ? "/contract" : "/my-contracts")}>
                        Volver
                    </button>
                </div>
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
                            {puedeEditar ? (
                                <input type="date" name="dateEvent" value={form.dateEvent} onChange={handleChange} />
                            ) : (
                                <span>{formatDate(reservation.dateEvent)}</span>
                            )}
                        </div>

                        <div className="contract-field">
                            <label>Tipo de evento</label>
                            {puedeEditar ? (
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
                            {puedeEditar ? (
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
                            {puedeEditar ? (
                                <input type="time" name="eventStartTime" value={form.eventStartTime} onChange={handleChange} />
                            ) : (
                                <span>{formatTime(contract.eventStartTime) || "—"}</span>
                            )}
                        </div>

                        <div className="contract-field">
                            <label>Hora de fin del evento</label>
                            {puedeEditar ? (
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
                        {puedeEditar ? (
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
                        {puedeEditar ? (
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
                                <td>{currency(calcLive.priceSalon)}</td>
                            </tr>
                            <tr className={!cantExactaVal ? "contract-row-muted" : ""}>
                                <td>Menú ({menuStage} × {cantExactaVal ?? "—"} invitados)</td>
                                <td>{cantExactaVal ? currency(calcLive.menuValue) : "—"}</td>
                            </tr>
                            <tr>
                                <td>Servicios extras</td>
                                <td>{currency(calcLive.totalExtras)}</td>
                            </tr>
                            {cantExactaVal ? (
                                <tr className="contract-price-total">
                                    <td>Valor final</td>
                                    <td>{currency(calcLive.total)}</td>
                                </tr>
                            ) : (
                                <tr className="contract-price-novalue">
                                    <td colSpan="2">Ingresá la cantidad exacta de invitados para ver el valor final del contrato.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {!calcLive.hasPrice && (
                        <small className="contract-warning">
                            No hay un precio de salón vigente cargado, por lo que se consideró $0 para el salón. Contactá al administrador.
                        </small>
                    )}
                </section>

                {/* PAGO (solo admin) */}
                {rol === "administrador" && (
                    <section className="contract-section">
                        <h2>Pago</h2>

                        {payment ? (
                            <>
                                <div className="contract-fields">
                                    <div className="contract-field">
                                        <label>Valor</label>
                                        <span>{currency(payment.value)}</span>
                                    </div>
                                    <div className="contract-field">
                                        <label>Estado</label>
                                        <span className={`contract-status ${payment.statusPayment}`}>
                                            {PAYMENT_STATUS_LABEL[payment.statusPayment] || payment.statusPayment}
                                        </span>
                                    </div>
                                    <div className="contract-field">
                                        <label>Fecha</label>
                                        <span>{formatDate(payment.datePayment)}</span>
                                    </div>
                                </div>

                                {payment.statusPayment !== "pagado" ? (
                                    <button
                                        className="contract-btn-accept"
                                        onClick={() => handleCambiarPago("pagado")}
                                        disabled={saving}
                                    >
                                        {saving ? "Procesando..." : "Marcar saldo como abonado"}
                                    </button>
                                ) : (
                                    <button
                                        className="contract-btn-save"
                                        onClick={() => handleCambiarPago("pendiente")}
                                        disabled={saving}
                                    >
                                        {saving ? "Procesando..." : "Reabrir como pendiente"}
                                    </button>
                                )}
                            </>
                        ) : (
                            <p className="contract-mod-meta">
                                Este contrato no tiene un pago registrado.
                            </p>
                        )}
                    </section>
                )}

                {/* MODIFICACION APROBADA — PENDIENTE DE FIRMA (cliente) */}
                {rol === "cliente" &&
                    contract.status === "aprobado" &&
                    contract.modificationStatus === "aprobada" && (
                        <section className="contract-section contract-mod-solicitando">
                            <div className="contract-mod-alert">
                                <strong>MODIFICACIÓN APROBADA — PENDIENTE DE TU FIRMA</strong>
                                <span>
                                    El administrador aprobó tu modificación el {formatDate(contract.modificationReviewedAt)}.
                                    Los cambios ya fueron aplicados. Revisá los datos y firmá el contrato nuevamente.
                                </span>
                            </div>
                            <p className="contract-mod-meta">
                                Solicitud del {formatDate(contract.modificationRequestedAt)}.
                            </p>
                            {modAppliedList.length > 0 ? (
                                <div className="contract-mod-diff">
                                    {modAppliedList.map((app, i) => (
                                        <div className="contract-mod-diff-row" key={i}>
                                            <div className="contract-mod-diff-campo">{app.campo}</div>
                                            <div className="contract-mod-diff-val nuevo contract-mod-diff-val-full">{app.valor}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="contract-mod-meta">Modificación sin cambios de datos, solo comentario.</p>
                            )}
                            {!!contract.modificationComment && (
                                <div className="contract-mod-comment">
                                    <strong>Comentario que dejaste:</strong>
                                    <p>{contract.modificationComment}</p>
                                </div>
                            )}
                        </section>
                    )}

                {/* MODIFICACION RECHAZADA (decision del cliente) */}
                {tieneModRechazada && (
                    <section className="contract-section contract-mod-rechazada">
                        <div className="contract-mod-alert contract-mod-alert-red">
                            <strong>MODIFICACIÓN RECHAZADA</strong>
                            <span>
                                El administrador rechazó tu solicitud de modificación
                                {contract.modificationReviewedAt
                                    ? ` el ${formatDate(contract.modificationReviewedAt)}`
                                    : ""}. Tu contrato sigue vigente con los datos originales.
                            </span>
                        </div>
                        <p className="contract-mod-meta">
                            Estos son los cambios que habías solicitado y que quedaron sin efecto:
                        </p>
                        {modNuevos.length > 0 ? (
                            <div className="contract-mod-diff">
                                {modNuevos.map((nv, i) => (
                                    <div className="contract-mod-diff-row" key={i}>
                                        <div className="contract-mod-diff-campo">{nv.campo}</div>
                                        <div className="contract-mod-diff-val nuevo contract-mod-diff-val-full">{nv.valor}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="contract-mod-meta">No se detectaron cambios en los datos del evento.</p>
                        )}
                        {!!contract.modificationComment && (
                            <div className="contract-mod-comment">
                                <strong>Comentario que dejaste en la solicitud:</strong>
                                <p>{contract.modificationComment}</p>
                            </div>
                        )}
                        <p className="contract-mod-meta">
                            Decidí cómo querés continuar con el evento:
                        </p>
                        <div className="contract-actions">
                            <button className="contract-btn-save" onClick={handleContinuarContrato} disabled={saving}>
                                {saving ? "Procesando..." : "Continuar con el contrato como estaba"}
                            </button>
                            <button className="contract-btn-reject" onClick={() => setConfirmCancelar(true)} disabled={saving}>
                                Rechazar y cancelar el evento
                            </button>
                        </div>
                    </section>
                )}

                {/* CONTRATO MODIFICADO (admin: pendiente de firma tras modificacion) */}
                {rol === "administrador" &&
                    contract.modificationStatus === "aprobada" &&
                    ["en_revision", "aprobado"].includes(contract.status) && (
                        <section className="contract-section contract-mod-revision">
                            <div className="contract-mod-alert">
                                <strong>CONTRATO MODIFICADO — PENDIENTE DE FIRMA</strong>
                                <span>
                                    Este contrato tiene una modificación aprobada y aplicada el {formatDate(contract.modificationReviewedAt)}.
                                    Quedó pendiente de la firma del cliente.
                                </span>
                            </div>
                            <p className="contract-mod-meta">
                                Solicitud del {formatDate(contract.modificationRequestedAt)}.
                            </p>
                            {modAppliedList.length > 0 ? (
                                <div className="contract-mod-diff">
                                    {modAppliedList.map((app, i) => (
                                        <div className="contract-mod-diff-row" key={i}>
                                            <div className="contract-mod-diff-campo">{app.campo}</div>
                                            <div className="contract-mod-diff-val nuevo contract-mod-diff-val-full">{app.valor}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="contract-mod-meta">Modificación sin cambios de datos, solo comentario.</p>
                            )}
                            <div className="contract-mod-comment">
                                <strong>Comentario del cliente:</strong>
                                <p>{contract.modificationComment || "Sin comentario."}</p>
                            </div>
                        </section>
                    )}

                {/* REVISION DE MODIFICACION (admin) */}
                {rol === "administrador" && tieneModPendiente && contract.modificationData && (
                    <section className="contract-section contract-mod-revision">
                        <div className="contract-mod-alert">
                            <strong>MODIFICACIÓN SOLICITADA</strong>
                            <span>
                                El cliente firmó el contrato y propuso estos cambios al evento. Estos son
                                UNICAMENTE los datos que quiere cambiar. Si los aprobás, el contrato vuelve
                                al cliente como pendiente de firma; si los rechazás, el contrato mantiene sus
                                datos vigentes y el cliente decide cómo continuar.
                            </span>
                        </div>
                        <p className="contract-mod-meta">
                            Solicitud del {formatDate(contract.modificationRequestedAt)}. Verificá los datos nuevos propuestos:
                        </p>

                        {modNuevos.length > 0 ? (
                            <div className="contract-mod-diff">
                                {modNuevos.map((nv, i) => (
                                    <div className="contract-mod-diff-row" key={i}>
                                        <div className="contract-mod-diff-campo">{nv.campo}</div>
                                        <div className="contract-mod-diff-val nuevo contract-mod-diff-val-full">{nv.valor}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="contract-mod-meta">
                                No se detectaron cambios en los datos del evento; revisá el comentario del cliente.
                            </p>
                        )}

                        <div className="contract-mod-comment">
                            <strong>Comentario del cliente:</strong>
                            <p>{contract.modificationComment || "Sin comentario."}</p>
                        </div>

                        <div className="contract-actions contract-mod-actions">
                            <button className="contract-btn-reject" onClick={() => handleRevisarMod("rechazar")} disabled={saving}>
                                Rechazar modificación
                            </button>
                            <button className="contract-btn-accept" onClick={() => handleRevisarMod("aprobar")} disabled={saving}>
                                Aprobar modificación
                            </button>
                        </div>
                    </section>
                )}

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
                        <button className="contract-btn-accept" onClick={() => setShowTerminos(true)} disabled={saving}>
                            Aceptar contrato (firmar)
                        </button>
                    )}

                    {rol === "cliente" && contract.status === "firmado" && !modificando && !tieneModPendiente && !tieneModRechazada && puedeSolicitarMod && (
                        <button className="contract-btn-primary" onClick={() => setModificando(true)} disabled={saving}>
                            Solicitar modificación
                        </button>
                    )}

                    {rol === "cliente" && contract.status === "firmado" && modificando && (
                        <>
                            <button className="contract-btn-primary" onClick={handleSolicitarMod} disabled={saving}>
                                {saving ? "Enviando..." : "Enviar solicitud de modificación"}
                            </button>
                            <button className="contract-btn-save" onClick={() => setModificando(false)} disabled={saving}>
                                Cancelar
                            </button>
                        </>
                    )}

                    {rol === "cliente" && contract.status === "firmado" && !modificando && tieneModPendiente && (
                        <p className="contract-pending-note">
                            Tu solicitud de modificación está pendiente de aprobación por el administrador. Por ahora no podés solicitar otra.
                        </p>
                    )}

                    {rol === "cliente" && contract.status === "firmado" && !modificando && !tieneModPendiente && !tieneModRechazada && !puedeSolicitarMod && (
                        <p className="contract-pending-note">
                            No se admiten más modificaciones: las solicitudes se aceptan hasta 2 semanas antes del evento.
                        </p>
                    )}

                    {rol === "cliente" && contract.status !== "aprobado" && !canEdit && contract.status !== "firmado" && (
                        <p className="contract-pending-note">
                            El contrato está en revisión por el administrador.
                        </p>
                    )}

                </section>

            </main>

            </div>

            {modificando && (
                <div className="contract-mod-screen-backdrop" onClick={() => setModificando(false)}>
                    <div className="contract-mod-screen" onClick={(e) => e.stopPropagation()}>
                        <button className="contract-terms-close" onClick={() => setModificando(false)} aria-label="Cerrar">✕</button>
                        <h3>Pedido de modificación</h3>
                        <p className="contract-terms-intro">
                            Completá SOLO los datos que querés cambiar del contrato firmado
                            {diasHastaEvento !== null ? ` (faltan ${diasHastaEvento} días para el evento)` : ""}.
                            Al enviar, el administrador verá únicamente estos cambios para aprobarlos o rechazarlos.
                        </p>

                        <div className="contract-mod-screen-fields">
                            <div className="contract-field">
                                <label>Fecha del evento</label>
                                <input type="date" name="dateEvent" value={form.dateEvent} onChange={handleChange} />
                            </div>

                            <div className="contract-field">
                                <label>Tipo de evento</label>
                                <select name="eventType" value={form.eventType} onChange={handleChange}>
                                    <option value="" disabled>Seleccioná el tipo de evento...</option>
                                    {EVENT_TYPES.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="contract-field">
                                <label>Cantidad exacta de invitados</label>
                                <input
                                    type="number"
                                    name="cantExactaInvit"
                                    value={form.cantExactaInvit}
                                    onChange={handleChange}
                                    min={reservation.cantInvit}
                                    max={reservation.maxCantInvit}
                                    placeholder={`${reservation.cantInvit} - ${reservation.maxCantInvit}`}
                                />
                                <small>Debe estar entre {reservation.cantInvit} y {reservation.maxCantInvit} invitados.</small>
                            </div>

                            <div className="contract-field">
                                <label>Hora de inicio del evento</label>
                                <input type="time" name="eventStartTime" value={form.eventStartTime} onChange={handleChange} />
                            </div>

                            <div className="contract-field">
                                <label>Hora de fin del evento</label>
                                <input type="time" name="eventEndTime" value={form.eventEndTime} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="contract-field">
                            <label>Menú por persona</label>
                            {mountData.cardDetails.map((menu) => (
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
                            ))}
                        </div>

                        <div className="contract-field">
                            <label>Servicios extras</label>
                            {mountData.extraServices.map((service) => (
                                <label className="contract-option" key={service.idService}>
                                    <input
                                        type="checkbox"
                                        checked={form.idServices.includes(service.idService)}
                                        onChange={() => handleServiceChange(service.idService)}
                                    />
                                    <span><strong>{service.nameService}</strong> — {service.detailService} ({currency(service.cost)})</span>
                                </label>
                            ))}
                        </div>

                        <div className="contract-field">
                            <label>Comentario para el administrador (opcional)</label>
                            <textarea
                                className="contract-mod-screen-comment"
                                value={commentMod}
                                onChange={(e) => setCommentMod(e.target.value)}
                                placeholder="Explicá el motivo de la modificación..."
                                rows="3"
                            />
                        </div>

                        <p className="contract-mod-meta contract-mod-screen-total">
                            Valor final estimado con los datos modificados:{" "}
                            <strong>{calcLive.hasPrice ? currency(calcLive.total) : "—"}</strong>
                        </p>
                        {!calcLive.hasPrice && (
                            <small className="contract-warning">
                                No hay un precio de salón vigente cargado, por lo que se consideró $0 para el salón.
                            </small>
                        )}

                        <div className="contract-terms-actions">
                            <button className="contract-btn-save" onClick={() => setModificando(false)} disabled={saving}>
                                Cancelar
                            </button>
                            <button className="contract-btn-accept" onClick={handleSolicitarMod} disabled={saving}>
                                {saving ? "Enviando..." : "Enviar solicitud de modificación"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showTerminos && (
                <div className="contract-terms-backdrop" onClick={() => setShowTerminos(false)}>
                    <div className="contract-terms-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="contract-terms-close" onClick={() => setShowTerminos(false)} aria-label="Cerrar">✕</button>
                        <h3>Confirmación de firma</h3>
                        <p className="contract-terms-intro">
                            Antes de aceptar, leé con atención. Al confirmar asumís el compromiso de cumplir
                            este contrato.
                        </p>
                        <ul className="contract-terms-list">
                            {TERMINOS_FIRMA.map((text, i) => (
                                <li key={i}>{text}</li>
                            ))}
                        </ul>
                        <div className="contract-terms-actions">
                            <button className="contract-btn-save" onClick={() => setShowTerminos(false)} disabled={saving}>
                                Volver
                            </button>
                            <button
                                className="contract-btn-accept"
                                onClick={() => {
                                    setShowTerminos(false);
                                    handleAceptar();
                                }}
                                disabled={saving}
                            >
                                {saving ? "Firmando..." : "Acepto y confirmo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmCancelar && (
                <div className="contract-terms-backdrop" onClick={() => setConfirmCancelar(false)}>
                    <div className="contract-terms-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="contract-terms-close" onClick={() => setConfirmCancelar(false)} aria-label="Cerrar">✕</button>
                        <h3>Cancelar el evento</h3>
                        <p className="contract-terms-intro">
                            Esta acción da de baja el contrato y cancela la reserva del evento.
                            No se puede deshacer.
                        </p>
                        <div className="contract-terms-actions">
                            <button className="contract-btn-save" onClick={() => setConfirmCancelar(false)} disabled={saving}>
                                Volver
                            </button>
                            <button className="contract-btn-reject" onClick={handleCancelarEvento} disabled={saving}>
                                {saving ? "Cancelando..." : "Sí, cancelar el evento"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {message && (
                <FeedbackModal
                    type={message.type}
                    title={message.title}
                    message={message.text}
                    onClose={closeMessage}
                />
            )}

        </div>
    );
}

export default ContractDetail;
