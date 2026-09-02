import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./loungeTypeList.css";

const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
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

function LoungeTypeList() {
  const navigate = useNavigate();
  const [loungeTypes, setLoungeTypes] = useState([]);
  const [lounges, setLounges] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loungeTypeToDelete, setLoungeTypeToDelete] = useState(null);
  const [loungeTypeToDetail, setLoungeTypeToDetail] = useState(null);
  const [loungeTypeToEdit, setLoungeTypeToEdit] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTypes, resLounges] = await Promise.all([
          fetch("http://localhost:3000/api/loungeType"),
          fetch("http://localhost:3000/api/lounge")
        ]);

        if (resTypes.ok) {
          const dataTypes = await resTypes.json();
          setLoungeTypes(dataTypes);
        }

        if (resLounges.ok) {
          const dataLounges = await resLounges.json();
          setLounges(dataLounges);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getLoungeName = (lt) => {
    if (lt.loungeName) return lt.loungeName;
    const lounge = lounges.find((l) => String(l.idLounge || l.id || l.id_lounge) === String(lt.idLounge));
    return lounge ? lounge.name : "No asignado";
  };

  const handleConfirmDelete = async () => {
    if (!loungeTypeToDelete) return;
    setDeleting(true);
    const id = loungeTypeToDelete.idLoungeType || loungeTypeToDelete.id;

    try {
      const response = await fetch(`http://localhost:3000/api/loungeType/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("No se pudo eliminar el tipo de salón.");

      setLoungeTypes((prev) => prev.filter((lt) => lt.idLoungeType !== id));
      setLoungeTypeToDelete(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setLoungeTypeToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    const id = loungeTypeToEdit.idLoungeType || loungeTypeToEdit.id;

    const minQuantity = Number(loungeTypeToEdit.minQuantity);
    const maxQuantity = Number(loungeTypeToEdit.maxQuantity);

    if (isNaN(minQuantity) || minQuantity < 50) {
      alert("La capacidad mínima no puede ser inferior a 50 personas.");
      setSavingEdit(false);
      return;
    }

    if (isNaN(maxQuantity) || maxQuantity > 200) {
      alert("La capacidad máxima no puede superar las 200 personas.");
      setSavingEdit(false);
      return;
    }

    if (minQuantity > maxQuantity) {
      alert("La capacidad mínima no puede superar la máxima.");
      setSavingEdit(false);
      return;
    }

    if (!loungeTypeToEdit.idLounge) {
      alert("Debe seleccionar el salón al que pertenece el tipo.");
      setSavingEdit(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/loungeType/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minQuantity,
          maxQuantity,
          idLounge: Number(loungeTypeToEdit.idLounge)
        })
      });

      if (!response.ok) throw new Error("No se pudo actualizar el tipo de salón.");

      const updated = await response.json();
      setLoungeTypes((prev) => prev.map((lt) => (lt.idLoungeType === id ? { ...updated, loungeName: getLoungeName(updated) } : lt)));
      setLoungeTypeToEdit(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="loungeType-dashboard">
        <header className="dashboard-header-flex">
          <div className="header-title-group">
            <div className="header-icon">
              <IconLayers />
            </div>
            <div>
              <h1>Tipos de Salón Registrados</h1>
              <p>Gestión y administración de tipos de salón de STYLO</p>
            </div>
          </div>

          <button className="btn-submit-cyan" onClick={() => navigate("/loungeType/new")}>
            <IconPlus /> Nuevo Tipo de Salón
          </button>
        </header>

        <div className="form-card full-width">
          <div className="card-body-table">
            {loading ? (
              <p className="loading-text">Cargando tipos de salón...</p>
            ) : (
              <table className="loungetypes-table">
                <thead>
                  <tr>
                    <th>Salón</th>
                    <th>Capacidad Mínima</th>
                    <th>Capacidad Máxima</th>
                    <th>Tipo (ID)</th>
                    <th style={{ textAlign: "center" }}>Gestiones</th>
                  </tr>
                </thead>
                <tbody>
                  {loungeTypes.length > 0 ? (
                    loungeTypes.map((lt) => {
                      const idKey = lt.idLoungeType || lt.id;
                      const loungeName = getLoungeName(lt);

                      return (
                        <tr key={idKey}>
                          <td className="font-semibold">{loungeName}</td>
                          <td>{lt.minQuantity}</td>
                          <td>{lt.maxQuantity}</td>
                          <td>{idKey}</td>
                          <td>
                            <div className="actions-cell">
                              <button
                                type="button"
                                className="btn-action-view"
                                onClick={() => setLoungeTypeToDetail({ ...lt, resolvedLounge: loungeName })}
                                title="Ver Detalle"
                              >
                                <IconEye />
                              </button>

                              <button
                                type="button"
                                className="btn-action-edit"
                                onClick={() => setLoungeTypeToEdit({ ...lt, idLounge: lt.idLounge })}
                                title="Editar"
                              >
                                <IconEdit />
                              </button>

                              <button
                                type="button"
                                className="btn-action-delete"
                                onClick={() => setLoungeTypeToDelete(lt)}
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
                        No hay tipos de salón registrados en la base de datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {loungeTypeToDetail && (
        <div className="modal-backdrop">
          <div className="modal-card-form">
            <div className="modal-header-styled">
              <h2>Detalles del Tipo de Salón</h2>
              <button className="btn-close" onClick={() => setLoungeTypeToDetail(null)}>✕</button>
            </div>
            <div className="modal-detail-grid">
              <div className="detail-item"><label>Salón:</label> <span>{loungeTypeToDetail.resolvedLounge}</span></div>
              <div className="detail-item"><label>Capacidad Mínima:</label> <span>{loungeTypeToDetail.minQuantity}</span></div>
              <div className="detail-item"><label>Capacidad Máxima:</label> <span>{loungeTypeToDetail.maxQuantity}</span></div>
              <div className="detail-item"><label>Tipo (ID):</label> <span>{loungeTypeToDetail.idLoungeType || loungeTypeToDetail.id}</span></div>
            </div>
            <div className="modal-footer-right">
              <button className="btn-j-primary" onClick={() => setLoungeTypeToDetail(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {loungeTypeToEdit && (
        <div className="modal-backdrop">
          <div className="modal-card-form">
            <div className="modal-header-styled">
              <h2>Editar Tipo de Salón</h2>
              <button className="btn-close" onClick={() => setLoungeTypeToEdit(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-edit-form">
              <div className="form-grid-2">
                <div className="form-group full-width">
                  <label>Salón al que pertenece</label>
                  <select
                    name="idLounge"
                    value={loungeTypeToEdit.idLounge || ""}
                    onChange={handleEditChange}
                    className="form-control"
                    required
                  >
                    <option value="">Seleccione un salón...</option>
                    {lounges.map((l) => {
                      const idLounge = l.idLounge || l.id || l.id_lounge;
                      return (
                        <option key={idLounge} value={idLounge}>
                          {l.name} (ID: {idLounge})
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="form-group">
                  <label>Capacidad Mínima</label>
                  <input type="number" name="minQuantity" value={loungeTypeToEdit.minQuantity || ""} onChange={handleEditChange} min="50" max="200" required />
                </div>
                <div className="form-group">
                  <label>Capacidad Máxima</label>
                  <input type="number" name="maxQuantity" value={loungeTypeToEdit.maxQuantity || ""} onChange={handleEditChange} min="50" max="200" required />
                </div>
              </div>

              <div className="modal-footer-right">
                <button type="button" className="btn-j-link-secondary" onClick={() => setLoungeTypeToEdit(null)}>
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

      {loungeTypeToDelete && (
        <div className="modal-backdrop">
          <div className="modal-card-j">
            <div className="modal-body-j">
              <div className="modal-icon-circle danger">
                <IconTrashWarning />
              </div>

              <div className="modal-content-j">
                <p className="modal-text-j">
                  ¿Está seguro de que desea eliminar este tipo de salón?
                </p>

                <button
                  type="button"
                  className="btn-j-danger"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  {deleting ? "Eliminando..." : "Eliminar tipo de salón"}
                </button>

                <button
                  type="button"
                  className="btn-j-link-secondary"
                  onClick={() => setLoungeTypeToDelete(null)}
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

export default LoungeTypeList;
