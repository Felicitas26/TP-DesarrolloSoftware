import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    reservationService,
    loungeService,
    loungeTypeService,
    cardDetailService,
    extraServiceService,
    clientService
} from "../../services";
import FeedbackModal from "../../components/FeedbackModal";
import "./ReservationNew.css";
import "./ReservationEdit.css";

const STATUS_LABELS = {
    pendiente: "Pendiente",
    aceptada: "Aceptada",
    confirmada: "Confirmada",
    cancelada: "Dada de baja"
};

const EVENT_TYPES = [
    "Casamiento",
    "Cumpleaños",
    "Cumpleaños +40",
    "Fiesta de 15",
    "Empresa / Corporativo",
    "Otro"
];

function ReservationEdit() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [reservation, setReservation] = useState({
        dateEvent: "",
        eventType: "",
        status: "",
        idCli: "",
        cantInvit: "",
        maxCantInvit: "",
        idLounge: "",
        idLoungeType: "",
        idCardDetail: "",
        idServices: []
    });

    const [lounges, setLounges] = useState([]);
    const [loungeTypes, setLoungeTypes] = useState([]);
    const [clients, setClients] = useState([]);
    const [cardDetails, setCardDetails] = useState([]);
    const [extraServices, setExtraServices] = useState([]);

    // Entidades actuales de la reserva, para mostrarlas aunque estén dadas de baja.
    const [currentLounge, setCurrentLounge] = useState(null);
    const [currentType, setCurrentType] = useState(null);
    const [currentMenu, setCurrentMenu] = useState(null);
    const [summary, setSummary] = useState(null);

    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // El backend exige un motivo para que el cliente sepa por qué se dio de baja.
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteMotivo, setDeleteMotivo] = useState("");
    const [deleting, setDeleting] = useState(false);

    const showMessage = (type, title, message, extra = {}) => {
        setFeedback({ type, title, message, ...extra });
    };

    useEffect(() => {

        const getCatalog = async () => {
            try {
                const [loungesData, typesData, menusData, extrasData, clientsData] =
                    await Promise.all([
                        loungeService.getAll(),
                        loungeTypeService.getAll(),
                        cardDetailService.getAll(),
                        extraServiceService.getAll(),
                        clientService.getAll()
                    ]);

                setLounges(loungesData);
                setLoungeTypes(typesData);
                setCardDetails(menusData);
                setExtraServices(extrasData);
                setClients(clientsData);

            } catch (error) {
                console.error("Error al obtener el catálogo:", error);
                showMessage("error", "Error", "No se pudieron cargar los datos del sistema.");
            }
        };

        const getReservation = async () => {
            try {
                const data = await reservationService.getById(id);

                setReservation({
                    dateEvent: data.dateEvent ? data.dateEvent.split("T")[0] : "",
                    eventType: data.eventType || "",
                    status: data.status || "",
                    idCli: data.idCli ? String(data.idCli) : "",
                    cantInvit: data.cantInvit ?? "",
                    maxCantInvit: data.maxCantInvit ?? "",
                    idLounge: data.idLounge ? String(data.idLounge) : "",
                    idLoungeType: data.idLoungeType ? String(data.idLoungeType) : "",
                    idCardDetail: data.idCardDetail ? String(data.idCardDetail) : "",
                    idServices: (data.extraServices || []).map((s) => s.idService) || []
                });

                setCurrentLounge(data.lounge || null);
                setCurrentType(data.loungeType || null);
                setCurrentMenu(data.cardDetail || null);
                setSummary(data.client || null);

            } catch (error) {
                showMessage("error", "Error", error.message || "No se pudo cargar la reserva.");
            } finally {
                setLoading(false);
            }
        };

        getCatalog();
        getReservation();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleChange = (e) => {
        setReservation({
            ...reservation,
            [e.target.name]: e.target.value
        });
    };

    const handleLoungeChange = (idLounge) => {

        const types = loungeTypes.filter(
            (type) => String(type.idLounge) === String(idLounge)
        );

        // Cascada: si el salón tiene una única capacidad, se selecciona sola.
        const onlyType = types.length === 1 ? types[0] : null;

        setReservation({
            ...reservation,
            idLounge,
            idLoungeType: onlyType ? String(onlyType.idLoungeType) : "",
            cantInvit: onlyType ? String(onlyType.minQuantity) : "",
            maxCantInvit: onlyType ? String(onlyType.maxQuantity) : ""
        });
    };

    const handleTypeChange = (type) => {
        setReservation({
            ...reservation,
            idLoungeType: String(type.idLoungeType),
            cantInvit: String(type.minQuantity),
            maxCantInvit: String(type.maxQuantity)
        });
    };

    const loungeOptions = [...lounges];

    if (
        reservation.idLounge &&
        !lounges.some(
            (lounge) => String(lounge.idLounge) === String(reservation.idLounge)
        )
    ) {
        loungeOptions.push({
            idLounge: Number(reservation.idLounge),
            name: currentLounge?.name || `Salón #${reservation.idLounge}`,
            loungeAddress: currentLounge?.loungeAddress || "",
            inactivo: true
        });
    }

    const activeSalonTypes = loungeTypes.filter(
        (type) => String(type.idLounge) === String(reservation.idLounge)
    );

    const salonTypes = [...activeSalonTypes];

    if (
        reservation.idLoungeType &&
        !salonTypes.some(
            (type) =>
                String(type.idLoungeType) === String(reservation.idLoungeType)
        )
    ) {
        salonTypes.push({
            idLoungeType: Number(reservation.idLoungeType),
            nameLoungeType:
                currentType?.nameLoungeType || `Capacidad #${reservation.idLoungeType}`,
            minQuantity: currentType?.minQuantity ?? reservation.cantInvit,
            maxQuantity: currentType?.maxQuantity ?? reservation.maxCantInvit,
            idLounge: Number(reservation.idLounge),
            inactivo: true
        });
    }

    // Cascada: si el salón tiene una sola capacidad y la reserva no tenía una
    // seleccionada, se completa sola.
    useEffect(() => {
        if (!reservation.idLounge || reservation.idLoungeType) return;
        if (activeSalonTypes.length !== 1) return;

        const onlyType = activeSalonTypes[0];

        setReservation((prev) => ({
            ...prev,
            idLoungeType: String(onlyType.idLoungeType),
            cantInvit: String(onlyType.minQuantity),
            maxCantInvit: String(onlyType.maxQuantity)
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loungeTypes, reservation.idLounge, reservation.idLoungeType]);

    // Menú: los activos + el actual (aunque esté dado de baja).
    const menuOptions = [...cardDetails];

    if (
        reservation.idCardDetail &&
        !menuOptions.some(
            (menu) => String(menu.idCardDetail) === String(reservation.idCardDetail)
        )
    ) {
        menuOptions.push({
            idCardDetail: Number(reservation.idCardDetail),
            menuStage: currentMenu?.menuStage || `Menú #${reservation.idCardDetail}`,
            detail: currentMenu?.detail || "",
            budget: currentMenu?.budget ?? "",
            inactivo: true
        });
    }

    const handleMenuChange = (idCardDetail) => {
        setReservation({
            ...reservation,
            idCardDetail: String(idCardDetail)
        });
    };

    // Servicios extras: los activos + los que ya tenía la reserva (aunque estén dados de baja).
    const extrasActuales = (reservation.idServices || [])
        .filter(
            (idService) =>
                !extraServices.some(
                    (service) => service.idService === idService
                )
        )
        .map((idService) => ({
            idService,
            nameService: `Servicio #${idService}`,
            detailService: "ya no está disponible (dado de baja)",
            cost: "",
            inactivo: true
        }));

    const serviceOptions = [...extraServices, ...extrasActuales];

    const handleServiceChange = (idService) => {
        let updatedServices = [...reservation.idServices];

        if (updatedServices.includes(idService)) {
            updatedServices = updatedServices.filter((sid) => sid !== idService);
        } else {
            updatedServices.push(idService);
        }

        setReservation({
            ...reservation,
            idServices: updatedServices
        });
    };

    const handleNoneChange = () => {
        setReservation({
            ...reservation,
            idServices: []
        });
    };

    const saveChanges = async () => {

        setFeedback(null);
        setSaving(true);

        const selectedType = salonTypes.find(
            (type) =>
                String(type.idLoungeType) === String(reservation.idLoungeType)
        );

        try {
            await reservationService.update(id, {
                dateEvent: reservation.dateEvent,
                eventType: reservation.eventType,
                status: reservation.status,
                cantInvit: Number(selectedType.minQuantity),
                maxCantInvit: Number(selectedType.maxQuantity),
                idCli: Number(reservation.idCli),
                idLounge: Number(reservation.idLounge),
                idLoungeType: Number(reservation.idLoungeType),
                idCardDetail: reservation.idCardDetail
                    ? Number(reservation.idCardDetail)
                    : null,
                idServices: reservation.idServices
            });

            // Vuelve a Gestión de Reservas, donde se ve la reserva actualizada.
            navigate("/reservation");

        } catch (error) {
            console.error(error);
            setSaving(false);
            showMessage("error", "Error", error.message || "No se pudo actualizar la reserva.");
        }
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        const selectedType = salonTypes.find(
            (type) =>
                String(type.idLoungeType) === String(reservation.idLoungeType)
        );

        if (!reservation.eventType) {
            showMessage("error", "Datos incompletos", "Seleccioná el tipo de evento.");
            return;
        }

        if (!reservation.status) {
            showMessage("error", "Datos incompletos", "Seleccioná el estado de la reserva.");
            return;
        }

        if (!reservation.idCli || !reservation.idLounge || !selectedType) {
            showMessage(
                "error",
                "Datos incompletos",
                "Seleccioná el cliente, el salón y la capacidad del salón."
            );
            return;
        }

        if (reservation.status === "cancelada") {
            setFeedback({
                type: "confirm",
                title: "Cambiar estado de la reserva",
                message: "La reserva va a quedar marcada como cancelada. Para avisarle al cliente con la razón, usá \"Dar de baja la reserva\". ¿Confirmás el cambio igual?",
                confirmLabel: "Sí, guardar",
                onConfirm: saveChanges,
                onCancel: () => setFeedback(null)
            });
            return;
        }

        saveChanges();
    };

    const handleDeleteClick = () => {
        setDeleteMotivo("");
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {

        const motivo = deleteMotivo.trim();

        if (!motivo) {
            showMessage("error", "Falta el motivo", "Indicá el motivo de la baja para avisarle al cliente.");
            return;
        }

        setDeleting(true);

        try {
            await reservationService.remove(id, { motivo });

            setDeleteOpen(false);
            setDeleteMotivo("");

            // La reserva quedó dada de baja: volvemos a Gestión de Reservas.
            navigate("/reservation");

        } catch (error) {
            console.error(error);
            setDeleting(false);
            showMessage("error", "Error", error.message || "No se pudo dar de baja la reserva.");
        }
    };

    const clientOptions = [...clients];

    if (
        reservation.idCli &&
        !clients.some((client) => String(client.idCli) === String(reservation.idCli))
    ) {
        clientOptions.push({
            idCli: Number(reservation.idCli),
            nameCli: summary?.nameCli || `Cliente #${reservation.idCli}`,
            surnameCli: summary?.surnameCli || "",
            dniCli: summary?.dniCli || "",
            inactivo: true
        });
    }

    if (loading) {
        return (
            <div className="reservation-edit-container">
                <p className="reservation-edit-loading"> Cargando reserva... </p>
            </div>
        );
    }

    return (
        <div className="reservation-edit-container">

            <h1>Editar reserva #{id}</h1>

            <p>
                {summary
                    ? `${summary.nameCli || ""} ${summary.surnameCli || ""}`
                    : "Modificá los datos de la reserva."}
            </p>

            <form onSubmit={handleSubmit}>

                <div className="reservation-new-field">

                    <label>
                        Estado
                    </label>

                    <select
                        name="status"
                        value={reservation.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Seleccioná el estado...
                        </option>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>

                    <p className="reservation-edit-help">
                        {reservation.status === "pendiente" && "Pendiente de revisión del administrador."}
                        {reservation.status === "aceptada" && "La reserva fue aceptada por el administrador."}
                        {reservation.status === "confirmada" && "La reserva está confirmada para el evento."}
                        {reservation.status === "cancelada" && "La reserva está dada de baja. Con \"Guardar cambios\" vuelve a estar activa."}
                    </p>

                </div>

                <div className="reservation-new-field">

                    <label>
                        Fecha del evento
                    </label>

                    <input
                        type="date"
                        name="dateEvent"
                        value={reservation.dateEvent}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="reservation-new-field">

                    <label>
                        Tipo de evento
                    </label>

                    <select
                        name="eventType"
                        value={reservation.eventType}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Seleccioná el tipo de evento...
                        </option>
                        {EVENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                </div>

                <div className="reservation-new-field">

                    <label>
                        Cliente
                    </label>

                    <select
                        name="idCli"
                        value={reservation.idCli}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Seleccioná el cliente...
                        </option>

                        {clientOptions.map((client) => (
                            <option
                                key={client.idCli}
                                value={client.idCli}
                                disabled={client.inactivo}
                            >
                                {client.nameCli} {client.surnameCli}
                                {client.dniCli ? ` — DNI ${client.dniCli}` : ""}
                                {client.inactivo ? " — cuenta dada de baja" : ""}
                            </option>
                        ))}

                    </select>

                </div>

                <div className="reservation-new-field">

                    <label>
                        Salón
                    </label>

                    {loungeOptions.map((lounge) => (
                        <label
                            className="reservation-option"
                            key={lounge.idLounge}
                        >
                            <input
                                type="radio"
                                name="idLounge"
                                value={lounge.idLounge}
                                checked={
                                    reservation.idLounge ===
                                    String(lounge.idLounge)
                                }
                                onChange={(e) =>
                                    handleLoungeChange(e.target.value)
                                }
                                disabled={lounge.inactivo}
                                required
                            />
                            <span>
                                <strong>{lounge.name}</strong>
                                {" - "}
                                {lounge.loungeAddress}
                                {lounge.inactivo && " (dado de baja)"}
                            </span>
                        </label>
                    ))}

                    {reservation.idLounge && loungeOptions.some(
                        (lounge) =>
                            String(lounge.idLounge) === String(reservation.idLounge) &&
                            lounge.inactivo
                    ) && (
                        <p className="reservation-hint">
                            El salón de esta reserva fue dado de baja. Podés elegir otro salón disponible.
                        </p>
                    )}

                </div>

                <div className="reservation-new-field">

                    <label>
                        Capacidad del salón
                    </label>

                    {!reservation.idLounge && (
                        <p className="reservation-hint">
                            Primero seleccioná un salón.
                        </p>
                    )}

                    {reservation.idLounge && salonTypes.length === 0 && (
                        <p className="reservation-hint">
                            Este salón no tiene capacidades cargadas.
                        </p>
                    )}

                    {salonTypes.length === 1 && (
                        <label className="reservation-option">
                            <span>
                                <strong>
                                    {salonTypes[0].nameLoungeType}
                                </strong>
                                {" — "}
                                {salonTypes[0].minQuantity}
                                {" a "}
                                {salonTypes[0].maxQuantity}
                                {" invitados (única capacidad del salón)"}
                                {salonTypes[0].inactivo && " — dada de baja"}
                            </span>
                        </label>
                    )}

                    {salonTypes.length > 1 &&
                        salonTypes.map((type) => (
                            <label
                                className="reservation-option"
                                key={type.idLoungeType}
                            >
                                <input
                                    type="radio"
                                    name="idLoungeType"
                                    value={type.idLoungeType}
                                    checked={
                                        reservation.idLoungeType ===
                                        String(type.idLoungeType)
                                    }
                                    onChange={() => handleTypeChange(type)}
                                    disabled={type.inactivo}
                                    required
                                />
                                <span>
                                    <strong>
                                        {type.nameLoungeType}
                                    </strong>
                                    {" — "}
                                    {type.minQuantity}
                                    {" a "}
                                    {type.maxQuantity}
                                    {" invitados"}
                                    {type.inactivo && " (dada de baja)"}
                                </span>
                            </label>
                        ))}

                    {reservation.idLoungeType && salonTypes.some(
                        (type) =>
                            String(type.idLoungeType) === String(reservation.idLoungeType) &&
                            type.inactivo
                    ) && (
                        <p className="reservation-hint">
                            La capacidad de esta reserva fue dada de baja. Podés elegir otra disponible.
                        </p>
                    )}

                </div>

                <div className="reservation-new-field">

                    <label>
                        Menú
                    </label>

                    {menuOptions.map((menu) => (

                        <label
                            className="reservation-option"
                            key={menu.idCardDetail}
                        >

                            <input
                                type="radio"
                                name="idCardDetail"
                                value={menu.idCardDetail}
                                checked={
                                    reservation.idCardDetail ===
                                    String(menu.idCardDetail)
                                }
                                onChange={() =>
                                    handleMenuChange(menu.idCardDetail)
                                }
                                disabled={menu.inactivo}
                            />

                            <span>

                                <strong>
                                    {menu.menuStage}
                                </strong>

                                {" - "}

                                {menu.detail}

                                {menu.budget !== "" && (
                                    <>
                                        {" ($"}
                                        {menu.budget}
                                        {")"}
                                    </>
                                )}

                                {menu.inactivo && " (dado de baja)"}

                            </span>

                        </label>

                    ))}

                </div>

                <div className="reservation-new-field">

                    <label>
                        Servicios extras
                    </label>

                    <label className="reservation-option">

                        <input
                            type="checkbox"
                            checked={
                                reservation.idServices.length === 0
                            }
                            onChange={handleNoneChange}
                        />

                        <span>
                            Ninguno
                        </span>

                    </label>

                    {serviceOptions.map((service) => (

                        <label
                            className="reservation-option"
                            key={service.idService}
                        >

                            <input
                                type="checkbox"
                                checked={
                                    reservation.idServices.includes(
                                        service.idService
                                    )
                                }
                                disabled={service.inactivo}
                                onChange={() =>
                                    handleServiceChange(
                                        service.idService
                                    )
                                }
                            />

                            <span>

                                <strong>
                                    {service.nameService}
                                </strong>

                                {" - "}

                                {service.detailService}

                                {service.cost !== "" && (
                                    <>
                                        {" ($"}
                                        {service.cost}
                                        {")"}
                                    </>
                                )}

                                {service.inactivo && " — no disponible"}

                            </span>

                        </label>

                    ))}

                </div>

                <div className="reservation-buttons">

                    <button
                        type="submit"
                        className={`reservation-edit-save ${saving ? "loading" : ""}`}
                        disabled={saving}
                    >
                        {saving ? "Guardando cambios..." : "Guardar cambios"}
                    </button>

                    <button
                        type="button"
                        className="reservation-back-button"
                        onClick={() => navigate("/reservation")}
                    >
                        Volver
                    </button>

                    <button
                        type="button"
                        className="reservation-edit-danger"
                        onClick={handleDeleteClick}
                    >
                        Dar de baja la reserva
                    </button>

                </div>

            </form>

            {deleteOpen && (
                <div className="reservation-modal-backdrop">
                    <div className="reservation-modal error" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="reservation-modal-close"
                            onClick={() => setDeleteOpen(false)}
                        >
                            ✕
                        </button>
                        <h3>Dar de baja la reserva</h3>
                        <p>
                            La reserva quedará dada de baja y el cliente será notificado.
                            Indicá el motivo para que sepa por qué:
                        </p>

                        <textarea
                            className="reservation-edit-textarea"
                            value={deleteMotivo}
                            onChange={(e) => setDeleteMotivo(e.target.value)}
                            rows={3}
                            placeholder="Motivo de la baja"
                        />

                        <div className="reservation-modal-actions">
                            <button
                                type="button"
                                onClick={() => setDeleteOpen(false)}
                            >
                                Volver
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDeleteConfirm}
                            >
                                {deleting ? "Dando de baja..." : "Sí, dar de baja"}
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
                    confirmLabel={feedback.confirmLabel || "Cerrar"}
                    cancelLabel="Cancelar"
                    onCancel={feedback.onCancel}
                />
            )}

        </div>
    );
}

export default ReservationEdit;
