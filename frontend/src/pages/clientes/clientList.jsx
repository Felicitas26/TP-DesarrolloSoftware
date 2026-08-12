import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./clientList.css";

function ClientList() {

    const [clients, setClients] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        const getClients = async () => {

            try {

                const response = await fetch(
                    "http://localhost:3000/api/client"
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error(data.error || "Error loading clients");
                    return;
                }

                setClients(data);

            } catch (error) {

                console.error("Error loading clients:", error);

            }
        };

        getClients();

    }, []);

    const handleEdit = (id) => {
        navigate(`/client/edit/${id}`);
    };

    const handleDelete = (id) => {
        console.log("Delete client:", id);
    };

    return (
        <div className="client-list-container">

            <h1>Clients</h1>

            <button onClick={() => navigate("/client/new")}>
                New Client
            </button>

            <table className="client-table">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Last Name</th>
                        <th>DNI</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {clients.map((client) => (

                        <tr key={client.idCli}>

                            <td>{client.nameCli}</td>

                            <td>{client.lastNameCli}</td>

                            <td>{client.dniCli}</td>

                            <td>{client.phoneCli}</td>

                            <td>{client.emailCli}</td>

                            <td>

                                <button
                                    onClick={() => handleEdit(client.idCli)}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(client.idCli)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default ClientList;

