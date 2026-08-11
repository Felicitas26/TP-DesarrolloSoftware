import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./editClient.css";

function EditClient() {

    const { id } = useParams();

    const [client, setClient] = useState({
        nameCli: "",
        lastNameCli: "",
        dniCli: "",
        phoneCli: "",
        emailCli: "",
        addressCli: "",
        localityCli: ""
    });

    useEffect(() => {
        const getClient = async () => {

            try {

                const response = await fetch(
                    `http://localhost:3000/api/client/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    alert(data.error || "Error loading client");
                    return;
                }

                setClient(data);

            } catch (error) {

                console.log("Error:", error);
                alert("Error loading client");

            }
        };

        getClient();

    }, [id]);

    const handleChange = (e) => {
        setClient({
            ...client,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(
                `http://localhost:3000/api/client/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(client)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Error updating client");
                return;
            }

            console.log(data);

            alert("Client updated successfully");

        } catch (error) {

            console.log("Error:", error);
            alert("Error updating client");

        }
    };

    return (
        <div className="client-container">

            <h1>Edit Client</h1>

            <form
                className="client-form"
                onSubmit={handleSubmit}
            >

                <label>Name</label>
                <input
                    type="text"
                    name="nameCli"
                    value={client.nameCli}
                    onChange={handleChange}
                />

                <label>Last Name</label>
                <input
                    type="text"
                    name="lastNameCli"
                    value={client.lastNameCli}
                    onChange={handleChange}
                />

                <label>DNI</label>
                <input
                    type="number"
                    name="dniCli"
                    value={client.dniCli}
                    onChange={handleChange}
                />

                <label>Phone</label>
                <input
                    type="text"
                    name="phoneCli"
                    value={client.phoneCli}
                    onChange={handleChange}
                />

                <label>Email</label>
                <input
                    type="email"
                    name="emailCli"
                    value={client.emailCli}
                    onChange={handleChange}
                />

                <label>Address</label>
                <input
                    type="text"
                    name="addressCli"
                    value={client.addressCli}
                    onChange={handleChange}
                />

                <label>Locality</label>
                <input
                    type="text"
                    name="localityCli"
                    value={client.localityCli}
                    onChange={handleChange}
                />

                <button type="submit">
                    Save Changes
                </button>

            </form>

        </div>
    );
}

export default EditClient;

