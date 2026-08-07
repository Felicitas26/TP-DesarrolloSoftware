import { useState } from "react";
import "./editClient.css";

function editClient() {

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


    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(client);
        alert("Cliente modificado correctamente");
    };


    return (
        <div className="client-container">

            <h1>Editar Cliente</h1>

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
                />


                <label>Apellido</label>
                <input
                    type="text"
                    name="apellido"
                    value={client.apellido}
                    onChange={handleChange}
                />


                <label>DNI</label>
                <input
                    type="number"
                    name="dni"
                    value={client.dni}
                    onChange={handleChange}
                />


                <label>Teléfono</label>
                <input
                    type="text"
                    name="telefono"
                    value={client.telefono}
                    onChange={handleChange}
                />


                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={client.email}
                    onChange={handleChange}
                />


                <label>Dirección</label>
                <input
                    type="text"
                    name="direccion"
                    value={client.direccion}
                    onChange={handleChange}
                />


                <label>Localidad</label>
                <input
                    type="text"
                    name="localidad"
                    value={client.localidad}
                    onChange={handleChange}
                />


                <button type="submit">
                    Guardar cambios
                </button>

            </form>

        </div>
    );
}

export default EditClient;
