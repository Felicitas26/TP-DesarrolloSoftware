import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./loungeList.css";

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

const IconLayers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
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
  const [loungeToEdit, setLoungeToEdit] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("sty_token");
    localStorage.removeItem("sty_rol");
    localStorage.removeItem("sty_idUsuario");
    navigate("/");
  };

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
    <div className="gestion-page">
      <div className="gestion-background" aria-hidden="true">
        <div className="gestion-glow gestion-glow-purple" />
        <div className="gestion-glow gestion-glow-cyan" />
        <div className="gestion-grid-overlay" />
      </div>
      <div className="gestion-overlay" />

      <header className="gestion-bar">
        <span className="gestion-logo">GESTIONAR SALONES</span>
        <button type="button" className="gestion-logout" onClick={handleLogout}>
          <IconLogout /> Cerrar Sesión
        </button>
      </header>

      <div className="gestion-dashboard">
        <div className="gestion-panel">
          <h1>Salones Registrados</h1>
          <p>Gestión y administración de espacios de STYLO</p>
        </div>

        <div className="gestion-header-flex">
          <div className="gestion-actions">
            <button className="gestion-btn-back" onClick={() => navigate("/admin-home")}>
              <IconArrowLeft /> Volver al Panel
            </button>
            <button className="gestion-btn-primary" onClick={() => navigate("/lounge/new")}>
              <IconPlus /> Nuevo Salón
            </button>
          </div>
        </div>

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
                    <th style={{ textAlign: "center" }}>Gestiones</th>
                  </tr>
                </thead>
                <tbody>
                  {lounges.length > 0 ? (
                    lounges.map((lounge) => {
                      const idKey = lounge.id_lounge || lounge.idLounge || lounge.id;
                     
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
                                onClick={() =>
                                  navigate(`/loungeType?loungeId=${idKey}&loungeName=${encodeURIComponent(lounge.name)}`)
                                }
                                title="Gestionar tipos de salón"
                              >
                                <IconLayers />
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