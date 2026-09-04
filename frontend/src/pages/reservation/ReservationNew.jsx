import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReservationNew.css";

function ReservationNew() {
    const navigate = useNavigate();

    const [reservation, setReservation] = useState({
        dateEvent: "",
        eventType: "",
        cantInvit: "",
        idLounge: "",
        idLoungeType: "",
        idCardDetail: "",
        idServices: []
    });

    const EVENT_TYPES = [
        "Casamiento",
        "Cumpleaños",
        "Cumpleaños +40",
        "Fiesta de 15",
        "Empresa / Corporativo",
        "Otro"
    ];

    const guestRanges = [
        { id: "1", min: 70, max: 90, label: "70 - 90 invitados" },
        { id: "2", min: 90, max: 130, label: "90 - 130 invitados" }
    ];

    const [lounges, setLounges] = useState([]);
    const [loungeTypes, setLoungeTypes] = useState([]);
    const [cardDetails, setCardDetails] = useState([]);
    const [extraServices, setExtraServices] = useState([]);

    const [message, setMessage] = useState(null);

    const showMessage = (type, text) => {
        setMessage({ type, text });
    };

    useEffect(() => {

        const getLounges = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/lounge"
                );
                const data = await response.json();
                setLounges(data);
            } catch (error) {
                console.error("Error al obtener los salones:", error);
            }
        };

        const getLoungeTypes = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/loungeType"
                );

                const data = await response.json();
                setLoungeTypes(data);
            } catch (error) {
                console.error(
                    "Error al obtener los tipos de salón:",
                    error
                );
            }
        };

        const getCardDetails = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/cardDetail"
                );

                const data = await response.json();
                setCardDetails(data);
            } catch (error) {
                console.error(
                    "Error al obtener los menús:",
                    error
                );
            }
        };

        const getExtraServices = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/extraservice"
                );

                const data = await response.json();
                setExtraServices(data);
            } catch (error) {
                console.error(
                    "Error al obtener los servicios extras:",
                    error
                );
            }
        };

        getLounges();
        getLoungeTypes();
        getCardDetails();
        getExtraServices();
    }, []);

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
                (id) => id !== idService
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

        const selectedRange = guestRanges.find(
            (r) => String(r.id) === String(reservation.cantInvit)
        );

        if (!selectedRange) {
            showMessage("error", "Seleccioná la cantidad de invitados.");
            return;
        }

        if (
            selectedRange.min < selectedLoungeType.minQuantity ||
            selectedRange.max > selectedLoungeType.maxQuantity
        ) {
            showMessage(
                "error",
                `El tipo de salón "${selectedLoungeType.nameLoungeType}" admite entre ${selectedLoungeType.minQuantity} y ${selectedLoungeType.maxQuantity} invitados. La cantidad seleccionada (${selectedRange.min} - ${selectedRange.max}) no es válida para este tipo de salón.`
            );
            return;
        }

        const token = localStorage.getItem("sty_token");

        if (!token) {
            showMessage("error", "No hay un token de autenticación. Volvé a iniciar sesión.");
            return;
        }

        const reservationData = {
            dateEvent: reservation.dateEvent,
            eventType: reservation.eventType,
            status: "pendiente",
            cantInvit: Number(reservation.cantInvit),
            idLounge: selectedLoungeType.idLounge,
            idLoungeType: selectedLoungeType.idLoungeType,
            idCardDetail: Number(reservation.idCardDetail),
            idServices: reservation.idServices
        };

        try {
            const response = await fetch(
                "http://localhost:3000/api/reservation",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(reservationData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "No se pudo crear la reserva."
                );
            }

            showMessage("success", "¡Reserva creada correctamente!");
            navigate("/my-reservations");

        } catch (error) {
            console.error(
                "Error al crear la reserva:",
                error
            );
            showMessage(
                "error",
                error.message || "No se pudo crear la reserva."
            );
        }
    };

    return (
        <div className="reservation-new-container">

            <h1>Nueva reserva</h1>

            <p>
                Ingresá los datos de tu reserva.
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
                                        idLoungeType: ""
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

                    {guestRanges.map((range) => (
                        <label
                            className="reservation-option"
                            key={range.id}
                        >
                            <input
                                type="radio"
                                name="cantInvit"
                                value={range.id}
                                checked={
                                    reservation.cantInvit === range.id
                                }
                                onChange={handleChange}
                                required
                            />
                            <span>
                                {range.label}
                            </span>
                        </label>
                    ))}

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
                                required
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

                    <button type="submit">
                        Continuar
                    </button>

                    <button
                        type="button"
                        className="reservation-back-button"
                        onClick={() => navigate("/client-home")}
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

export default ReservationNew;