import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientService, locationService } from "../../services";
import CityAutocomplete from "../../components/CityAutocomplete";
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

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
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
      const data = await clientService.getAll();
      setClients(data);
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
        setLocations(await locationService.getAll());
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
      await clientService.remove(id);

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

  const handleEditPostalChange = (e) => {
    setClientToEdit((prev) => ({ ...prev, postalCode: e.target.value }));
    setEditErrors((prev) => ({ ...prev, postalCode: null }));
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

    const nameCli = (clientToEdit.nameCli || "").trim();
    if (!nameCli) {
      errors.nameCli = "El nombre es obligatorio.";
    } else if (nameCli.length < 2) {
      errors.nameCli = "El nombre debe tener al menos 2 caracteres.";
    }

    const surnameCli = (clientToEdit.surnameCli || "").trim();
    if (!surnameCli) {
      errors.surnameCli = "El apellido es obligatorio.";
    } else if (surnameCli.length < 2) {
      errors.surnameCli = "El apellido debe tener al menos 2 caracteres.";
    }

    const dni = clientToEdit.dniCli || "";
    if (!dni.trim()) {
      errors.dniCli = "El DNI es obligatorio.";
    } else if (!/^\d+$/.test(dni)) {
      errors.dniCli = "El DNI solo puede contener números.";
    } else if (dni.length < 7 || dni.length > 9) {
      errors.dniCli = "El DNI debe tener entre 7 y 9 dígitos numéricos.";
    }

    const phone = (clientToEdit.phoneCli || "").trim();
    if (!phone) {
      errors.phoneCli = "El teléfono es obligatorio.";
    } else if (!/^\d+$/.test(phone)) {
      errors.phoneCli = "El teléfono solo puede contener números.";
    } else if (phone.length < 6 || phone.length > 20) {
      errors.phoneCli = "El teléfono debe tener entre 6 y 20 dígitos.";
    }

    const email = (clientToEdit.emailCli || "").trim();
    if (!email) {
      errors.emailCli = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.emailCli = "Email inválido.";
    }

    const address = (clientToEdit.addressCli || "").trim();
    if (!address) {
      errors.addressCli = "La dirección es obligatoria.";
    } else if (address.length < 3) {
      errors.addressCli = "La dirección debe tener al menos 3 caracteres.";
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
      await clientService.update(id, body);

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
      <div className="client-dashboard table-list-dashboard">
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

          <div className="header-actions">
            <button className="btn-back-panel" onClick={() => navigate("/admin-home")}>
              <IconArrowLeft /> Volver al Panel
            </button>
            <button className="btn-submit-cyan" onClick={() => navigate("/client/new")}>
              <IconPlus /> Nuevo Cliente
            </button>
          </div>
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
                <div className={`form-group ${editErrors.nameCli ? "has-error" : ""}`}>
                  <label>Nombre</label>
                  <input type="text" name="nameCli" value={clientToEdit.nameCli || ""} onChange={handleEditChange} />
                  {editErrors.nameCli && <span className="error-message">{editErrors.nameCli}</span>}
                </div>
                <div className={`form-group ${editErrors.surnameCli ? "has-error" : ""}`}>
                  <label>Apellido</label>
                  <input type="text" name="surnameCli" value={clientToEdit.surnameCli || ""} onChange={handleEditChange} />
                  {editErrors.surnameCli && <span className="error-message">{editErrors.surnameCli}</span>}
                </div>
                <div className={`form-group ${editErrors.dniCli ? "has-error" : ""}`}>
                  <label>DNI</label>
                  <input type="text" name="dniCli" value={clientToEdit.dniCli || ""} onChange={handleEditChange} />
                  {editErrors.dniCli && <span className="error-message">{editErrors.dniCli}</span>}
                </div>
                <div className={`form-group ${editErrors.phoneCli ? "has-error" : ""}`}>
                  <label>Teléfono</label>
                  <input type="text" name="phoneCli" value={clientToEdit.phoneCli || ""} onChange={handleEditChange} />
                  {editErrors.phoneCli && <span className="error-message">{editErrors.phoneCli}</span>}
                </div>
                <div className={`form-group ${editErrors.emailCli ? "has-error" : ""}`}>
                  <label>Email</label>
                  <input type="email" name="emailCli" value={clientToEdit.emailCli || ""} onChange={handleEditChange} />
                  {editErrors.emailCli && <span className="error-message">{editErrors.emailCli}</span>}
                </div>
                <div className={`form-group ${editErrors.addressCli ? "has-error" : ""}`}>
                  <label>Dirección</label>
                  <input type="text" name="addressCli" value={clientToEdit.addressCli || ""} onChange={handleEditChange} />
                  {editErrors.addressCli && <span className="error-message">{editErrors.addressCli}</span>}
                </div>
                <div className={`form-group ${editErrors.city ? "has-error" : ""}`}>
                  <label htmlFor="edit-cityInput">Ciudad *</label>
                  <CityAutocomplete
                    id="edit-cityInput"
                    name="cityInput"
                    value={clientToEdit.cityInput || ""}
                    locations={locations}
                    placeholder="Ej: Rosario"
                    hasError={Boolean(editErrors.city)}
                    onSelect={(loc) => {
                      setClientToEdit((prev) => ({
                        ...prev,
                        cityInput: loc.city,
                        postalCode: loc.zipCode,
                      }));
                      setEditErrors((prev) => ({
                        ...prev,
                        city: null,
                        postalCode: null,
                      }));
                    }}
                    onClear={() => {
                      setClientToEdit((prev) => ({
                        ...prev,
                        cityInput: "",
                        postalCode: "",
                      }));
                    }}
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