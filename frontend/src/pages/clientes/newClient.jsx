import "./newClient.css";

function NewClient() {
    return (
        <div className="client-container">
            <h1>Registro de Cliente</h1>

            <form className="client-form">

                <label>Nombre</label>
                <input
                    type="text"
                    name="firstName"
                    placeholder="Ingrese el nombre"
                />

                <label>Apellido</label>
                <input
                    type="text"
                    name="lastName"
                    placeholder="Ingrese el apellido"
                />

                <label>DNI</label>
                <input
                    type="number"
                    name="dni"
                    placeholder="Ingrese el DNI"
                />

                <label>Teléfono</label>
                <input
                    type="text"
                    name="phone"
                    placeholder="Ingrese el teléfono"
                />

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Ingrese el email"
                />

                <label>Dirección</label>
                <input
                    type="text"
                    name="address"
                    placeholder="Ingrese la dirección"
                />

                <label>Localidad</label>
                <input
                    type="text"
                    name="city"
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