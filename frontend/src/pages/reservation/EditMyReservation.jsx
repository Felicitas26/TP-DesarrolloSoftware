import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ReservationNew.css";

function EditMyReservation() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [reservation, setReservation] = useState({
        dateEvent: "",
        eventType: "",
        cantInvit: "",
        idLounge: "",
        idLoungeType: "",
        idCardDetail: "",
        idServices: []
    });

    const [lounges, setLounges] = useState([]);
    const [loungeTypes, setLoungeTypes] = useState([]);
    const [cardDetails, setCardDetails] = useState([]);
    const [extraServices, setExtraServices] = useState([]);

    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem("sty_token");

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
                const [loungesRes, typesRes, menusRes, extrasRes] =
                    await Promise.all([
                        fetch("http://localhost:3000/api/lounge"),
                        fetch("http://localhost:3000/api/loungeType"),
                        fetch("http://localhost:3000/api/cardDetail"),
                        fetch("http://localhost:3000/api/extraservice")
                    ]);

                const [loungesData, typesData, menusData, extrasData] =
                    await Promise.all([
                        loungesRes.json(),
                        typesRes.json(),
                        menusRes.json(),
                        extrasRes.json()
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
                const response = await fetch(
                    `http://localhost:3000/api/reservation/${id}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "No se pudo cargar la reserva.");
                }

                setReservation({
                    dateEvent: data.dateEvent
                        ? data.dateEvent.split("T")[0]
                        : "",
                    eventType: data.eventType || "",
                    cantInvit: data.cantInvit || "",
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

        const selectedLoungeType = loungeTypes.find(
            (type) =>
                String(type.idLoungeType) === String(reservation.idLoungeType)
        );

        if (!selectedLoungeType) {
            showMessage("error", "Seleccioná un tipo de salón.");
            return;
        }

        const cantInvitNum = Number(reservation.cantInvit);

        if (!reservation.cantInvit || Number.isNaN(cantInvitNum) || cantInvitNum <= 0) {
            showMessage("error", "Ingresá la cantidad de invitados.");
            return;
        }

        if (
            cantInvitNum < selectedLoungeType.minQuantity ||
            cantInvitNum > selectedLoungeType.maxQuantity
        ) {
            showMessage(
                "error",
                `El tipo de salón "${selectedLoungeType.nameLoungeType}" admite entre ${selectedLoungeType.minQuantity} y ${selectedLoungeType.maxQuantity} invitados. La cantidad ingresada (${cantInvitNum}) no es válida para este tipo de salón.`
            );
            return;
        }

        const reservationData = {
            dateEvent: reservation.dateEvent,
            eventType: reservation.eventType,
            status: "pendiente",
            cantInvit: cantInvitNum,
            idCli: Number(localStorage.getItem("sty_idCli")),
            idLounge: selectedLoungeType.idLounge,
            idLoungeType: selectedLoungeType.idLoungeType,
            idCardDetail: reservation.idCardDetail
                ? Number(reservation.idCardDetail)
                : null,
            idServices: reservation.idServices
        };

        setSaving(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/reservation/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(reservationData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo actualizar la reserva.");
            }

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

                    {lounges.map((lounge) => (
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
                                    setReservation({
                                        ...reservation,
                                        idLounge: e.target.value,
                                        idLoungeType: "",
                                        cantInvit: ""
                                    })
                                }
                                required
                            />
                            <span>
                                <strong>{lounge.name}</strong>
                                {" - "}
                                {lounge.loungeAddress}
                            </span>
                        </label>
                    ))}

                </div>

                <div className="reservation-new-field">

                    <label>
                        Tipo de salón
                    </label>

                    {loungeTypes
                        .filter(
                            (type) =>
                                String(type.idLounge) ===
                                String(reservation.idLounge)
                        )
                        .map((type) => (
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
                                    onChange={handleChange}
                                    required
                                />
                                <span>
                                    <strong>
                                        {type.nameLoungeType}
                                    </strong>
                                    {" ("}
                                    {type.minQuantity}
                                    {" - "}
                                    {type.maxQuantity}
                                    {" invitados)"}
                                </span>
                            </label>
                        ))}

                    {reservation.idLounge &&
                        loungeTypes.filter(
                            (type) =>
                                String(type.idLounge) ===
                                String(reservation.idLounge)
                        ).length === 0 && (
                            <p className="reservation-hint">
                                Este salón no tiene tipos de salón cargados.
                            </p>
                        )}

                </div>

                <div className="reservation-new-field">

                    <label>
                        Cantidad de invitados
                    </label>

                    <input
                        type="number"
                        name="cantInvit"
                        value={reservation.cantInvit}
                        onChange={handleChange}
                        min="1"
                        required
                        placeholder="Ingresá la cantidad de invitados"
                    />

                    {reservation.idLoungeType &&
                        (() => {
                            const selectedLoungeType = loungeTypes.find(
                                (type) =>
                                    String(type.idLoungeType) ===
                                    String(reservation.idLoungeType)
                            );
                            return selectedLoungeType ? (
                                <p className="reservation-hint">
                                    Este tipo de salón admite entre{" "}
                                    {selectedLoungeType.minQuantity} y{" "}
                                    {selectedLoungeType.maxQuantity}{" "}
                                    invitados.
                                </p>
                            ) : null;
                        })()}

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