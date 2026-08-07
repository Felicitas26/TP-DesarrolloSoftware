import { useState } from "react";
import "./newClient.css";

function NewClient() {

    const [client, setClient] = useState({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        email: "",
        direccion: "",
        localidad: ""
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

            const response = await fetch("http://localhost:3000/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(client)
            });


            const data = await response.json();

            console.log(data);

            alert("Cliente creado correctamente");


        } catch (error) {

            console.log("Error:", error);
            alert("Error al crear cliente");

        }
    };


    return (
        <div className="client-container">

            <h1>Registro de Cliente</h1>

            <form 
                className="client-form"
                onSubmit={handleSubmit}
            >

                <label>Nombre</label>
                <input
                    type="text"
                    name="nombre"
                    value={client.nombre}
                    onChange={handleChange}
                    placeholder="Ingrese el nombre"
                />


                <label>Apellido</label>
                <input
                    type="text"
                    name="apellido"
                    value={client.apellido}
                    onChange={handleChange}
                    placeholder="Ingrese el apellido"
                />


                <label>DNI</label>
                <input
                    type="number"
                    name="dni"
                    value={client.dni}
                    onChange={handleChange}
                    placeholder="Ingrese el DNI"
                />


                <label>Teléfono</label>
                <input
                    type="text"
                    name="telefono"
                    value={client.telefono}
                    onChange={handleChange}
                    placeholder="Ingrese el teléfono"
                />


                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={client.email}
                    onChange={handleChange}
                    placeholder="Ingrese el email"
                />


                <label>Dirección</label>
                <input
                    type="text"
                    name="direccion"
                    value={client.direccion}
                    onChange={handleChange}
                    placeholder="Ingrese la dirección"
                />


                <label>Localidad</label>
                <input
                    type="text"
                    name="localidad"
                    value={client.localidad}
                    onChange={handleChange}
                    placeholder="Ingrese la localidad"
                />


                <button type="submit">
                    Guardar Cliente
                </button>

            </form>

        </div>
    );
}


export default NewClient;