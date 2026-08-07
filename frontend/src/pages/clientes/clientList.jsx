import "./clientList.css";

function ClientList() {

    const handleEdit = (id) => {
        console.log("Editar cliente:", id);
    };


    const handleDelete = (id) => {
        console.log("Eliminar cliente:", id);
        alert("Cliente eliminado");
    };


    return (
        <div className="client-list-container">

            <h1>Clientes</h1>

            <table className="client-table">

                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>DNI</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>


                <tbody>

                    {/* Acá después van los clientes desde la API */}

                </tbody>

            </table>

        </div>
    );
}

export default ClientList;
