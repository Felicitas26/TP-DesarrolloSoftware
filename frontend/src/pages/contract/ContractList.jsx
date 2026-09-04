import { useEffect, useState } from "react";
import "./ContractList.css";

function ContractList() {

    const [contracts, setContracts] = useState([]);

    const getContracts = async () => {

        try {
            const response = await fetch(
                "http://localhost:3000/api/contract"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setContracts(data);

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    useEffect(() => {
        getContracts();
    }, []);

    return (
        <div className="contract-list-container">

            <div className="contract-list-header">
                <div>
                    <h1>Contratos</h1>
                    <p>Contratos registrados en el sistema.</p>
                </div>

                <span>{contracts.length}</span>
            </div>

            {contracts.length === 0 ? (

                <p className="contract-list-empty">
                    No hay contratos registrados.
                </p>

            ) : (

                <div className="contract-list-table-container">

                    <table className="contract-list-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Hora inicio</th>
                                <th>Hora fin</th>
                                <th>Fecha contrato</th>
                                <th>Valor final</th>
                                <th>Reserva</th>
                            </tr>
                        </thead>

                        <tbody>

                            {contracts.map((contract) => (

                                <tr key={contract.idContract}>

                                    <td>{contract.idContract}</td>
                                    <td>{contract.eventStartTime}</td>
                                    <td>{contract.eventEndTime}</td>
                                    <td>{contract.dateContract}</td>
                                    <td>${contract.finalValue}</td>
                                    <td>{contract.idReservation}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default ContractList;