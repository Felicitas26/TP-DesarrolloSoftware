import { useState } from "react";
import "./newClient.css";

function NewClient() {

    const [client, setClient] = useState({
        nameCli: "",
        lastNameCli: "",
        dniCli: "",
        phoneCli: "",
        emailCli: "",
        addressCli: "",
        localityCli: ""
    });

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
                "http://localhost:3000/api/client",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(client)
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(data.error || "Error creating client");
                return;

            }

            console.log(data);

            alert("Client created successfully");

            setClient({
                nameCli: "",
                lastNameCli: "",
                dniCli: "",
                phoneCli: "",
                emailCli: "",
                addressCli: "",
                localityCli: ""
            });

        } catch (error) {

            console.error("Error creating client:", error);

            alert("Error creating client");

        }
    };

    return (
        <div className="client-container">

            <h1>New Client</h1>

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
                    placeholder="Enter name"
                />

                <label>Last Name</label>

                <input
                    type="text"
                    name="lastNameCli"
                    value={client.lastNameCli}
                    onChange={handleChange}
                    placeholder="Enter last name"
                />

                <label>DNI</label>

                <input
                    type="number"
                    name="dniCli"
                    value={client.dniCli}
                    onChange={handleChange}
                    placeholder="Enter DNI"
                />

                <label>Phone</label>

                <input
                    type="text"
                    name="phoneCli"
                    value={client.phoneCli}
                    onChange={handleChange}
                    placeholder="Enter phone"
                />

                <label>Email</label>

                <input
                    type="email"
                    name="emailCli"
                    value={client.emailCli}
                    onChange={handleChange}
                    placeholder="Enter email"
                />

                <label>Address</label>

                <input
                    type="text"
                    name="addressCli"
                    value={client.addressCli}
                    onChange={handleChange}
                    placeholder="Enter address"
                />

                <label>Locality</label>

                <input
                    type="text"
                    name="localityCli"
                    value={client.localityCli}
                    onChange={handleChange}
                    placeholder="Enter locality"
                />

                <button type="submit">
                    Save Client
                </button>

            </form>

        </div>
    );
}

export default NewClient;
