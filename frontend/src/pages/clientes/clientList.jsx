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
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [clientToDelete, setClientToDelete] = useState(null);
  const [clientToDetail, setClientToDetail] = useState(null);
  const [clientToEdit, setClientToEdit] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editErrors, setEditErrors] = useState({});

  const normalizeText = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

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

    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/locations");
        if (res.ok) {
          setLocations(await res.json());
        }
      } catch (err) {
        console.error("Error al cargar ubicaciones:", err);
      }
    };

    fetchLocations();
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
    if (editErrors[name]) {
      setEditErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleEditCityChange = (e) => {
    const value = e.target.value;
    setClientToEdit((prev) => ({ ...prev, cityInput: value }));
    setEditErrors((prev) => ({ ...prev, city: null }));
    const match = locations.find((loc) => normalizeText(loc.city) === normalizeText(value));
    if (match) {
      setClientToEdit((prev) => ({ ...prev, postalCode: match.zipCode }));
      setEditErrors((prev) => ({ ...prev, postalCode: null }));
    }
  };

  const handleEditPostalChange = (e) => {
    setClientToEdit((prev) => ({ ...prev, postalCode: e.target.value }));
    setEditErrors((prev) => ({ ...prev, postalCode: null }));
  };

  const isEditFieldComplete = (name) => {
    const value = name === "cityInput" ? clientToEdit.cityInput : name === "postalCode" ? clientToEdit.postalCode : clientToEdit[name];
    return Boolean(value && String(value).trim());
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const id = clientToEdit.id_client || clientToEdit.idCli || clientToEdit.id;

    const city = clientToEdit.cityInput || "";
    const postal = clientToEdit.postalCode || "";
    const cityMatch = locations.find((loc) => normalizeText(loc.city) === normalizeText(city));

    const errors = {};
    if (!city.trim()) {
      errors.city = "La ciudad es obligatoria.";
    } else if (!cityMatch) {
      errors.city = "La ciudad no existe en la base de ciudades de Argentina.";
    }

    if (!postal.trim()) {
      errors.postalCode = "El código postal es obligatorio.";
    } else if (!/^\d+$/.test(postal.trim())) {
      errors.postalCode = "Solo números.";
    }

    if (
      cityMatch &&
      !errors.city &&
      !errors.postalCode &&
      String(cityMatch.zipCode) !== String(postal.trim())
    ) {
      errors.postalCode = `El código postal no coincide. Para ${cityMatch.city} el código es ${cityMatch.zipCode}.`;
    }

    if (Object.keys(errors).length) {
      setEditErrors(errors);
      return;
    }

    setEditErrors({});
    const matchingLocation = locations.find(
      (loc) =>
        normalizeText(loc.city) === normalizeText(city) &&
        String(loc.zipCode) === String(postal.trim())
    );

    const { cityInput, postalCode, ...cleanClient } = clientToEdit;
    const body = {
      ...cleanClient,
      idLocation: Number(matchingLocation.idLocation)
    };

    setSavingEdit(true);

    try {
      const response = await fetch(`http://localhost:3000/api/client/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error("No se pudo actualizar el cliente.");

      setClients((prev) =>
        prev.map((c) =>
          (c.id_client || c.idCli || c.id) === id
            ? { ...body, city: matchingLocation.city, zipCode: matchingLocation.zipCode }
            : c
        )
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
                          <td>{cli.city}</td>
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
                                onClick={() => {
                                  setEditErrors({});
                                  setClientToEdit({
                                    ...cli,
                                    cityInput: cli.city || "",
                                    postalCode: cli.zipCode || ""
                                  });
                                }}
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
              <div className="detail-item"><label>Ciudad:</label> <span>{clientToDetail.city}</span></div>
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
                  <input type="text" name="nameCli" value={clientToEdit.nameCli || ""} onChange={handleEditChange} required className={isEditFieldComplete("nameCli") ? "input-complete" : ""} />
                </div>
                <div className="form-group">
                  <label>Apellido</label>
                  <input type="text" name="surnameCli" value={clientToEdit.surnameCli || ""} onChange={handleEditChange} required className={isEditFieldComplete("surnameCli") ? "input-complete" : ""} />
                </div>
                <div className="form-group">
                  <label>DNI</label>
                  <input type="text" name="dniCli" value={clientToEdit.dniCli || ""} onChange={handleEditChange} required className={isEditFieldComplete("dniCli") ? "input-complete" : ""} />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="text" name="phoneCli" value={clientToEdit.phoneCli || ""} onChange={handleEditChange} required className={isEditFieldComplete("phoneCli") ? "input-complete" : ""} />
                </div>
                <div className="form-group full-width">
                  <label>Email</label>
                  <input type="email" name="emailCli" value={clientToEdit.emailCli || ""} onChange={handleEditChange} required className={isEditFieldComplete("emailCli") ? "input-complete" : ""} />
                </div>
                <div className="form-group">
                  <label>Dirección</label>
                  <input type="text" name="addressCli" value={clientToEdit.addressCli || ""} onChange={handleEditChange} required className={isEditFieldComplete("addressCli") ? "input-complete" : ""} />
                </div>
                <div className={`form-group ${editErrors.city ? "has-error" : ""}`}>
                  <label>Ciudad *</label>
                  <input
                    type="text"
                    name="cityInput"
                    value={clientToEdit.cityInput || ""}
                    onChange={handleEditCityChange}
                    placeholder="Ej: Rosario"
                    autoComplete="off"
                    className={isEditFieldComplete("cityInput") ? "input-complete" : ""}
                  />
                  {editErrors.city && <span className="error-message">{editErrors.city}</span>}
                </div>
                <div className={`form-group ${editErrors.postalCode ? "has-error" : ""}`}>
                  <label>Código Postal *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={clientToEdit.postalCode || ""}
                    onChange={handleEditPostalChange}
                    placeholder="Ej: 2000"
                    autoComplete="off"
                    className={isEditFieldComplete("postalCode") ? "input-complete" : ""}
                  />
                  {editErrors.postalCode && <span className="error-message">{editErrors.postalCode}</span>}
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