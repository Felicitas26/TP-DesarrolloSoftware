import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loungeService, loungeTypeService, cardDetailService, extraServiceService, reservationService } from "../../services";
import "./ReservationNew.css";

function EditMyReservation() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [reservation, setReservation] = useState({
        dateEvent: "",
        eventType: "",
        cantInvit: "",
        maxCantInvit: "",
        idLounge: "",
        idLoungeType: "",
        idCardDetail: "",
        idServices: []
    });

    const [lounges, setLounges] = useState([]);
    const [loungeTypes, setLoungeTypes] = useState([]);
    const [cardDetails, setCardDetails] = useState([]);
    const [extraServices, setExtraServices] = useState([]);

    // Entidades actuales de la reserva, para mostrarlas aunque estén dadas de baja.
    const [currentLounge, setCurrentLounge] = useState(null);
    const [currentType, setCurrentType] = useState(null);

    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const EVENT_TYPES = [
        "Casamiento",
        "Cumpleaños",
        "Cumpleaños +40",
        "Fiesta de 15",
        "Empresa / Corporativo",
        "Otro"
    ];

    const showMessage = (type, text) => {
        setMessage({ type, text });
    };

    useEffect(() => {

        const getCatalog = async () => {
            try {
                const [loungesData, typesData, menusData, extrasData] =
                    await Promise.all([
                        loungeService.getAll(),
                        loungeTypeService.getAll(),
                        cardDetailService.getAll(),
                        extraServiceService.getAll()
                    ]);

                setLounges(loungesData);
                setLoungeTypes(typesData);
                setCardDetails(menusData);
                setExtraServices(extrasData);
            } catch (error) {
                console.error("Error al obtener el catálogo:", error);
            }
        };

        const getReservation = async () => {
            try {
                const data = await reservationService.getById(id);

                setReservation({
                    dateEvent: data.dateEvent
                        ? data.dateEvent.split("T")[0]
                        : "",
                    eventType: data.eventType || "",
                    cantInvit: data.cantInvit || "",
                    maxCantInvit: data.maxCantInvit || "",
                    idLounge: data.idLounge ? String(data.idLounge) : "",
                    idLoungeType: data.idLoungeType
                        ? String(data.idLoungeType)
                        : "",
                    idCardDetail: data.idCardDetail
                        ? String(data.idCardDetail)
                        : "",
                    idServices:
                        (data.extraServices || []).map(
                            (s) => s.idService
                        ) || []
                });

                setCurrentLounge(data.lounge || null);
                setCurrentType(data.loungeType || null);

            } catch (error) {
                showMessage("error", error.message);
            } finally {
                setLoading(false);
            }
        };

        getCatalog();
        getReservation();

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

        // Si el salón tiene una única capacidad, se selecciona sola (cascada).
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
                currentType?.nameLoungeType ||
                `Capacidad #${reservation.idLoungeType}`,
            minQuantity: currentType?.minQuantity ?? reservation.cantInvit,
            maxQuantity: currentType?.maxQuantity ?? reservation.maxCantInvit,
            idLounge: Number(reservation.idLounge),
            inactivo: true
        });
    }

    // Cascada: si el salón tiene una sola capacidad activa y la reserva no tenía
    // una seleccionada, se completa sola.
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

    const handleServiceChange = (idService) => {
        let updatedServices = [...reservation.idServices];

        if (updatedServices.includes(idService)) {
            updatedServices = updatedServices.filter(
                (sid) => sid !== idService
            );
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!reservation.eventType) {
            showMessage("error", "Seleccioná el tipo de evento.");
            return;
        }

        const selectedLoungeType = salonTypes.find(
            (type) =>
                String(type.idLoungeType) === String(reservation.idLoungeType)
        );

        if (!selectedLoungeType) {
            showMessage("error", "Seleccioná la capacidad del salón.");
            return;
        }

        const reservationData = {
            dateEvent: reservation.dateEvent,
            eventType: reservation.eventType,
            status: "pendiente",
            cantInvit: selectedLoungeType.minQuantity,
            maxCantInvit: selectedLoungeType.maxQuantity,
            idCli: Number(localStorage.getItem("sty_idCli")),
            idLounge: selectedLoungeType.idLounge ?? Number(reservation.idLounge),
            idLoungeType: selectedLoungeType.idLoungeType,
            idCardDetail: reservation.idCardDetail
                ? Number(reservation.idCardDetail)
                : null,
            idServices: reservation.idServices
        };

        setSaving(true);

        try {
            await reservationService.update(id, reservationData);

            showMessage("success", "¡Reserva actualizada correctamente!");
            setTimeout(() => navigate("/my-reservations"), 1000);

        } catch (error) {
            console.error("Error al actualizar la reserva:", error);
            showMessage("error", error.message || "No se pudo actualizar la reserva.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="reservation-new-container">
                <p> Cargando reserva... </p>
            </div>
        );
    }

    return (
        <div className="reservation-new-container">

            <h1>Editar reserva</h1>

            <p>
                Modificá los datos de tu reserva.
            </p>

            <form onSubmit={handleSubmit}>

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
                            El salón de tu reserva fue dado de baja. Podés elegir otro salón disponible.
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
                            La capacidad de tu reserva fue dada de baja. Podés elegir otra disponible.
                        </p>
                    )}

                </div>

                <div className="reservation-new-field">

                    <label>
                        Menú
                    </label>

                    {cardDetails.map((menu) => (

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
                                onChange={handleChange}
                            />

                            <span>

                                <strong>
                                    {menu.menuStage}
                                </strong>

                                {" - "}

                                {menu.detail}

                                {" ($"}

                                {menu.budget}

                                {")"}

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

                    {extraServices.map((service) => (

                        <label
                            className="reservation-option"
                            key={service.idService}
                        >

                            <input
                                type="checkbox"
                                value={service.idService}
                                checked={
                                    reservation.idServices.includes(
                                        service.idService
                                    )
                                }
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

                                {" ($"}

                                {service.cost}

                                {")"}

                            </span>

                        </label>

                    ))}

                </div>

                <div className="reservation-buttons">

                    <button type="submit" disabled={saving}>
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </button>

                    <button
                        type="button"
                        className="reservation-back-button"
                        onClick={() => navigate("/my-reservations")}
                    >
                        Volver
                    </button>

                </div>

            </form>

            {message && (
                <div
                    className="reservation-modal-backdrop"
                    onClick={() => setMessage(null)}
                >
                    <div
                        className={`reservation-modal ${message.type}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="reservation-modal-close"
                            onClick={() => setMessage(null)}
                        >
                            ✕
                        </button>
                        <h3>
                            {message.type === "error"
                                ? "No se pudo procesar la solicitud"
                                : "Proceso exitoso"}
                        </h3>
                        <p>
                            {message.text}
                        </p>
                        <div className="reservation-modal-actions">
                            <button
                                type="button"
                                onClick={() => setMessage(null)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default EditMyReservation;