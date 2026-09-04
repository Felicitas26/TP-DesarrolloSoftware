import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReservationNew.css";

function ReservationNew() {
    const navigate = useNavigate();

    const [reservation, setReservation] = useState({
        dateEvent: "",
        cantInvit: "",
        idCardDetail: "",
        idServices: []
    });

    const [loungeTypes, setLoungeTypes] = useState([]);
    const [cardDetails, setCardDetails] = useState([]);
    const [extraServices, setExtraServices] = useState([]);

    useEffect(() => {
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

        let selectedLoungeType = null;

        if (reservation.cantInvit === "1") {
            selectedLoungeType = loungeTypes.find(
                (type) =>
                    type.minQuantity <= 70 &&
                    type.maxQuantity >= 90
            );
        }

        if (reservation.cantInvit === "2") {
            selectedLoungeType = loungeTypes.find(
                (type) =>
                    type.minQuantity <= 90 &&
                    type.maxQuantity >= 130
            );
        }

        if (!selectedLoungeType) {
            console.error(
                "No se encontró un tipo de salón correspondiente."
            );
            return;
        }

        const token = localStorage.getItem("sty_token");

        if (!token) {
            console.error(
                "No hay un token de autenticación."
            );
            return;
        }

        const reservationData = {
            dateEvent: reservation.dateEvent,
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

            console.log(
                "Reserva creada correctamente:",
                data
            );

            navigate("/my-reservations");

        } catch (error) {
            console.error(
                "Error al crear la reserva:",
                error
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
                        Cantidad de invitados
                    </label>

                    <label className="reservation-option">

                        <input
                            type="radio"
                            name="cantInvit"
                            value="1"
                            checked={
                                reservation.cantInvit === "1"
                            }
                            onChange={handleChange}
                            required
                        />

                        <span>
                            70 - 90 invitados
                        </span>

                    </label>

                    <label className="reservation-option">

                        <input
                            type="radio"
                            name="cantInvit"
                            value="2"
                            checked={
                                reservation.cantInvit === "2"
                            }
                            onChange={handleChange}
                        />

                        <span>
                            90 - 130 invitados
                        </span>

                    </label>

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

        </div>
    );
}

export default ReservationNew;