import { useEffect, useState } from "react";
import "./clientList.css";

function ClientList() {

    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/client")
            .then(response => response.json())
            .then(data => {
                setClients(data);
            })
            .catch(error => {
                console.error("Error loading clients:", error);
            });
    }, []);

    const handleEdit = (id) => {
        console.log("Edit client:", id);
    };

    const handleDelete = (id) => {
        console.log("Delete client:", id);
    };

    return (
        <div className="client-list-container">

            <h1>Clients</h1>

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
                                <button onClick={() => handleEdit(client.idCli)}>
                                    Edit
                                </button>

                                <button onClick={() => handleDelete(client.idCli)}>
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
