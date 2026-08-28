import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./loungeList.css";

const IconBuilding = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
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

function LoungeList() {
  const navigate = useNavigate();
  const [lounges, setLounges] = useState([]);
  const [locations, setLocations] = useState([]); // <- Estado para guardar las localidades del selector
  const [loading, setLoading] = useState(true);

  const [loungeToDelete, setLoungeToDelete] = useState(null);
  const [loungeToDetail, setLoungeToDetail] = useState(null);
  const [loungeToEdit, setLoungeToEdit] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  // Cargar salones y localidades al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resLounges, resLocations] = await Promise.all([
          fetch("http://localhost:3000/api/lounge"),
          fetch("http://localhost:3000/api/locations")
        ]);

        if (resLounges.ok) {
          const dataLounges = await resLounges.json();
          setLounges(dataLounges);
        }

        if (resLocations.ok) {
          const dataLocations = await resLocations.json();
          setLocations(dataLocations);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirmDelete = async () => {
    if (!loungeToDelete) return;
    setDeleting(true);
    const id = loungeToDelete.id_lounge || loungeToDelete.idLounge || loungeToDelete.id;

    try {
      const response = await fetch(`http://localhost:3000/api/lounge/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("No se pudo eliminar el salón.");

      setLounges((prev) => prev.filter((l) => (l.id_lounge || l.idLounge || l.id) !== id));
      setLoungeToDelete(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setLoungeToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    const id = loungeToEdit.id_lounge || loungeToEdit.idLounge || loungeToEdit.id;

    try {
      const response = await fetch(`http://localhost:3000/api/lounge/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loungeToEdit)
      });

      if (!response.ok) throw new Error("No se pudo actualizar el salón.");

      // Actualizamos la lista localizando el objeto completo o buscando la ciudad correspondiente para mostrarla bien en la tabla
      const updatedLocation = locations.find(loc => String(loc.idLocation || loc.id) === String(loungeToEdit.idLocation || loungeToEdit.id_location));
      
      const loungeWithCityName = {
        ...loungeToEdit,
        cityName: updatedLocation ? (updatedLocation.city || updatedLocation.name) : loungeToEdit.cityName
      };

      setLounges((prev) =>
        prev.map((l) => ((l.id_lounge || l.idLounge || l.id) === id ? loungeWithCityName : l))
      );
      setLoungeToEdit(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="lounge-dashboard">
        {/* Header */}
        <header className="dashboard-header-flex">
          <div className="header-title-group">
            <div className="header-icon">
              <IconBuilding />
            </div>
            <div>
              <h1>Salones Registrados</h1>
              <p>Gestión y administración de espacios de STYLO</p>
            </div>
          </div>

          <button className="btn-submit-cyan" onClick={() => navigate("/lounge/new")}>
            <IconPlus /> Nuevo Salón
          </button>
        </header>

        {/* Tabla */}
        <div className="form-card full-width">
          <div className="card-body-table">
            {loading ? (
              <p className="loading-text">Cargando salones...</p>
            ) : (
              <table className="lounges-table">
                <thead>
                  <tr>
                    <th>Nombre del Salón</th>
                    <th>Dirección</th>
                    <th>Localidad</th>
                    <th>Salón (ID)</th>
                    <th style={{ textAlign: "center" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {lounges.length > 0 ? (
                    lounges.map((lounge) => {
                      const idKey = lounge.id_lounge || lounge.idLounge || lounge.id;
                      // Buscamos el nombre de la localidad si viene como ID o si el backend ya lo trae jointeado
                      const locationName = lounge.cityName || lounge.city || locations.find(loc => String(loc.idLocation || loc.id) === String(lounge.idLocation || lounge.id_location))?.city || "No asignada";

                      return (
                        <tr key={idKey}>
                          <td className="font-semibold">{lounge.name}</td>
                          <td>{lounge.loungeAddress}</td>
                          <td>{locationName}</td>
                          <td>{idKey}</td>
                          <td>
                            <div className="actions-cell">
                              <button
                                type="button"
                                className="btn-action-view"
                                onClick={() => setLoungeToDetail({ ...lounge, resolvedCity: locationName })}
                                title="Ver Detalle"
                              >
                                <IconEye />
                              </button>

                              <button
                                type="button"
                                className="btn-action-edit"
                                onClick={() => setLoungeToEdit({ ...lounge })}
                                title="Editar"
                              >
                                <IconEdit />
                              </button>

                              <button
                                type="button"
                                className="btn-action-delete"
                                onClick={() => setLoungeToDelete(lounge)}
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
                      <td colSpan="5" className="empty-table">
                        No hay salones registrados en la base de datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal Detalle */}
      {loungeToDetail && (
        <div className="modal-backdrop">
          <div className="modal-card-form">
            <div className="modal-header-styled">
              <h2>Detalles del Salón</h2>
              <button className="btn-close" onClick={() => setLoungeToDetail(null)}>✕</button>
            </div>
            <div className="modal-detail-grid">
              <div className="detail-item"><label>Nombre:</label> <span>{loungeToDetail.name}</span></div>
              <div className="detail-item"><label>Dirección:</label> <span>{loungeToDetail.loungeAddress}</span></div>
              <div className="detail-item"><label>Localidad:</label> <span>{loungeToDetail.resolvedCity}</span></div>
              <div className="detail-item"><label>Salón (ID):</label> <span>{loungeToDetail.id_lounge || loungeToDetail.idLounge || loungeToDetail.id}</span></div>
            </div>
            <div className="modal-footer-right">
              <button className="btn-j-primary" onClick={() => setLoungeToDetail(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {loungeToEdit && (
        <div className="modal-backdrop">
          <div className="modal-card-form">
            <div className="modal-header-styled">
              <h2>Editar Salón</h2>
              <button className="btn-close" onClick={() => setLoungeToEdit(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-edit-form">
              <div className="form-grid-2">
                <div className="form-group full-width">
                  <label>Nombre del Salón</label>
                  <input type="text" name="name" value={loungeToEdit.name || ""} onChange={handleEditChange} required />
                </div>
                <div className="form-group full-width">
                  <label>Dirección</label>
                  <input type="text" name="loungeAddress" value={loungeToEdit.loungeAddress || ""} onChange={handleEditChange} required />
                </div>
                <div className="form-group full-width">
                  <label>Localidad</label>
                  <select 
                    name="idLocation" 
                    value={loungeToEdit.idLocation || loungeToEdit.id_location || ""} 
                    onChange={handleEditChange} 
                    className="form-control"
                    required
                  >
                    <option value="">Seleccione una localidad...</option>
                    {locations.map((loc) => {
                      const locId = loc.idLocation || loc.id;
                      return (
                        <option key={locId} value={locId}>
                          {loc.city || loc.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="modal-footer-right">
                <button type="button" className="btn-j-link-secondary" onClick={() => setLoungeToEdit(null)}>
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

      {/* Modal Eliminar */}
      {loungeToDelete && (
        <div className="modal-backdrop">
          <div className="modal-card-j">
            <div className="modal-body-j">
              <div className="modal-icon-circle danger">
                <IconTrashWarning />
              </div>

              <div className="modal-content-j">
                <p className="modal-text-j">
                  ¿Está seguro de que desea eliminar este salón?
                </p>

                <button
                  type="button"
                  className="btn-j-danger"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  {deleting ? "Eliminando..." : "Eliminar salón"}
                </button>

                <button
                  type="button"
                  className="btn-j-link-secondary"
                  onClick={() => setLoungeToDelete(null)}
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

export default LoungeList;