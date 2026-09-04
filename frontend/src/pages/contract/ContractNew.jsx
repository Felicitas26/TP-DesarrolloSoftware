import { useState } from "react";
import "./ContractNew.css";

function ContractNew() {

    const [contract, setContract] = useState({
        eventStartTime: "",
        eventEndTime: "",
        finalValue: "",
        idReservation: ""
    });

    const handleChange = (e) => {
        setContract({
            ...contract,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/contract", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    eventStartTime: contract.eventStartTime,
                    eventEndTime: contract.eventEndTime,
                    finalValue: Number(contract.finalValue),
                    idReservation: Number(contract.idReservation)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            alert("Contrato creado correctamente.");

            setContract({
                eventStartTime: "",
                eventEndTime: "",
                finalValue: "",
                idReservation: ""
            });

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div className="contract-new-container">

            <h1>Nuevo contrato</h1>
            <p>Ingresá los datos del contrato.</p>

            <form onSubmit={handleSubmit}>

                <div className="contract-new-field">
                    <label>Hora de inicio</label>
                    <input
                        type="time"
                        name="eventStartTime"
                        value={contract.eventStartTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="contract-new-field">
                    <label>Hora de finalización</label>
                    <input
                        type="time"
                        name="eventEndTime"
                        value={contract.eventEndTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="contract-new-field">
                    <label>Valor final</label>
                    <input
                        type="number"
                        name="finalValue"
                        value={contract.finalValue}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="contract-new-field">
                    <label>ID de reserva</label>
                    <input
                        type="number"
                        name="idReservation"
                        value={contract.idReservation}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                <button type="submit">
                    Crear contrato
                </button>

            </form>

        </div>
    );
}

export default ContractNew;