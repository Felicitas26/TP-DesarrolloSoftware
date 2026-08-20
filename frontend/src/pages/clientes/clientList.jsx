import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./clientList.css";

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEdit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const IconTrashWarning = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

function ClientList() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [clientToDelete, setClientToDelete] = useState(null);
  const [clientToDetail, setClientToDetail] = useState(null);
  const [clientToEdit, setClientToEdit] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/client");
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    setDeleting(true);
    const id = clientToDelete.id_client || clientToDelete.idCli || clientToDelete.id;

    try {
      const response = await fetch(`http://localhost:3000/api/client/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("No se pudo eliminar el cliente.");

      setClients((prev) => prev.filter((c) => (c.id_client || c.idCli || c.id) !== id));
      setClientToDelete(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setClientToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    const id = clientToEdit.id_client || clientToEdit.idCli || clientToEdit.id;

    try {
      const response = await fetch(`http://localhost:3000/api/client/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientToEdit)
      });

      if (!response.ok) throw new Error("No se pudo actualizar el cliente.");

      setClients((prev) =>
        prev.map((c) => ((c.id_client || c.idCli || c.id) === id ? clientToEdit : c))
      );
      setClientToEdit(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="client-dashboard">
        {/* Header */}
        <header className="dashboard-header-flex">
          <div className="header-title-group">
            <div className="header-icon">
              <IconUser />
            </div>
            <div>
              <h1>Clientes Registrados</h1>
              <p>Gestión y administración de la base de datos de STYLO</p>
            </div>
          </div>

          <button className="btn-submit-cyan" onClick={() => navigate("/client/new")}>
            <IconPlus /> Nuevo Cliente
          </button>
        </header>

        {/* Tabla */}
        <div className="form-card full-width">
          <div className="card-body-table">
            {loading ? (
              <p className="loading-text">Cargando clientes...</p>
            ) : (
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Nombre y Apellido</th>
                    <th>DNI</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Ciudad</th>
                    <th style={{ textAlign: "center" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length > 0 ? (
                    clients.map((cli) => {
                      const idKey = cli.id_client || cli.idCli || cli.id;
                      return (
                        <tr key={idKey}>
                          <td className="font-semibold">{cli.nameCli} {cli.surnameCli}</td>
                          <td>{cli.dniCli}</td>
                          <td>{cli.phoneCli}</td>
                          <td>{cli.emailCli}</td>
                          <td>{cli.cityCli}</td>
                          <td>
                            <div className="actions-cell">
                              <button
                                type="button"
                                className="btn-action-view"
                                onClick={() => setClientToDetail(cli)}
                                title="Ver Detalle"
                              >
                                <IconEye />
                              </button>

                              <button
                                type="button"
                                className="btn-action-edit"
                                onClick={() => setClientToEdit({ ...cli })}
                                title="Editar"
                              >
                                <IconEdit />
                              </button>

                              <button
                                type="button"
                                className="btn-action-delete"
                                onClick={() => setClientToDelete(cli)}
                                title="Eliminar"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-table">
                        No hay clientes registrados en la base de datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {clientToDetail && (
        <div className="modal-backdrop">
          <div className="modal-card-form">
            <div className="modal-header-styled">
              <h2>Detalles del Cliente</h2>
              <button className="btn-close" onClick={() => setClientToDetail(null)}>✕</button>
            </div>
            <div className="modal-detail-grid">
              <div className="detail-item"><label>Nombre:</label> <span>{clientToDetail.nameCli}</span></div>
              <div className="detail-item"><label>Apellido:</label> <span>{clientToDetail.surnameCli}</span></div>
              <div className="detail-item"><label>DNI / Doc:</label> <span>{clientToDetail.dniCli}</span></div>
              <div className="detail-item"><label>Teléfono:</label> <span>{clientToDetail.phoneCli}</span></div>
              <div className="detail-item"><label>Email:</label> <span>{clientToDetail.emailCli}</span></div>
              <div className="detail-item"><label>Dirección:</label> <span>{clientToDetail.addressCli}</span></div>
              <div className="detail-item"><label>Ciudad:</label> <span>{clientToDetail.cityCli}</span></div>
            </div>
            <div className="modal-footer-right">
              <button className="btn-j-primary" onClick={() => setClientToDetail(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {clientToEdit && (
        <div className="modal-backdrop">
          <div className="modal-card-form">
            <div className="modal-header-styled">
              <h2>Editar Cliente</h2>
              <button className="btn-close" onClick={() => setClientToEdit(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-edit-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" name="nameCli" value={clientToEdit.nameCli || ""} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Apellido</label>
                  <input type="text" name="surnameCli" value={clientToEdit.surnameCli || ""} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>DNI</label>
                  <input type="text" name="dniCli" value={clientToEdit.dniCli || ""} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="text" name="phoneCli" value={clientToEdit.phoneCli || ""} onChange={handleEditChange} required />
                </div>
                <div className="form-group full-width">
                  <label>Email</label>
                  <input type="email" name="emailCli" value={clientToEdit.emailCli || ""} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Dirección</label>
                  <input type="text" name="addressCli" value={clientToEdit.addressCli || ""} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Ciudad</label>
                  <input type="text" name="cityCli" value={clientToEdit.cityCli || ""} onChange={handleEditChange} required />
                </div>
              </div>

              <div className="modal-footer-right">
                <button type="button" className="btn-j-link-secondary" onClick={() => setClientToEdit(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit-cyan" disabled={savingEdit}>
                  {savingEdit ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {clientToDelete && (
        <div className="modal-backdrop">
          <div className="modal-card-j">
            <div className="modal-body-j">
              <div className="modal-icon-circle danger">
                <IconTrashWarning />
              </div>

              <div className="modal-content-j">
                <p className="modal-text-j">
                  ¿Está seguro de que desea eliminar este cliente?
                </p>

                <button
                  type="button"
                  className="btn-j-danger"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  {deleting ? "Eliminando..." : "Eliminar cliente"}
                </button>

                <button
                  type="button"
                  className="btn-j-link-secondary"
                  onClick={() => setClientToDelete(null)}
                  disabled={deleting}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientList;