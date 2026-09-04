import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./extraServiceList.css";

const IconSparkles = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0-1.3-1.3z"/>
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEdit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const IconTrashWarning = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

function ExtraServiceList() {
  const navigate = useNavigate();

  const [extraServices, setExtraServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [serviceToDetail, setServiceToDetail] = useState(null);
  const [serviceToEdit, setServiceToEdit] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchExtraServices = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/extraservice"
      );

      if (response.ok) {
        const data = await response.json();
        setExtraServices(data);
      }
    } catch (error) {
      console.error("Error al cargar servicios extras:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtraServices();
  }, []);

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/extraservice/${serviceToDelete.idService}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sty_token")}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo eliminar el servicio extra.");
      }

      setExtraServices((prev) =>
        prev.filter(
          (service) =>
            service.idService !== serviceToDelete.idService
        )
      );

      setServiceToDelete(null);

    } catch (error) {
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setServiceToEdit((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    setSavingEdit(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/extraservice/${serviceToEdit.idService}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("sty_token")}`
          },
          body: JSON.stringify({
            nameService: serviceToEdit.nameService,
            detailService: serviceToEdit.detailService,
            cost: Number(serviceToEdit.cost)
          })
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo actualizar el servicio extra.");
      }

      const data = await response.json();

      setExtraServices((prev) =>
        prev.map((service) =>
          service.idService === serviceToEdit.idService
            ? data.extraService
            : service
        )
      );

      setServiceToEdit(null);

    } catch (error) {
      alert(error.message);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="client-dashboard">

        <header className="dashboard-header-flex">

          <div className="header-title-group">

            <div className="header-icon">
              <IconSparkles />
            </div>

            <div>
              <h1>Servicios Extras</h1>
              <p>
                Gestión y administración de los servicios adicionales de STYLO
              </p>
            </div>

          </div>

          <div className="header-actions">

            <button
              className="btn-back-panel"
              onClick={() => navigate("/admin-home")}
            >
              <IconArrowLeft />
              Volver al Panel
            </button>

            <button
              className="btn-submit-cyan"
              onClick={() => navigate("/extraservice/new")}
            >
              <IconPlus />
              Nuevo Servicio
            </button>

          </div>

        </header>

        <div className="form-card full-width">

          <div className="card-body-table">

            {loading ? (
              <p className="loading-text">
                Cargando servicios extras...
              </p>
            ) : (
              <table className="clients-table">

                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Detalle</th>
                    <th>Costo</th>
                    <th style={{ textAlign: "center" }}>
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {extraServices.length > 0 ? (

                    extraServices.map((service) => (

                      <tr key={service.idService}>

                        <td className="font-semibold">
                          {service.nameService}
                        </td>

                        <td>
                          {service.detailService}
                        </td>

                        <td>
                          ${Number(service.cost).toLocaleString("es-AR")}
                        </td>

                        <td>

                          <div className="actions-cell">

                            <button
                              type="button"
                              className="btn-action-view"
                              onClick={() =>
                                setServiceToDetail(service)
                              }
                              title="Ver Detalle"
                            >
                              <IconEye />
                            </button>

                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() =>
                                setServiceToEdit({
                                  ...service
                                })
                              }
                              title="Editar"
                            >
                              <IconEdit />
                            </button>

                            <button
                              type="button"
                              className="btn-action-delete"
                              onClick={() =>
                                setServiceToDelete(service)
                              }
                              title="Eliminar"
                            >
                              <IconTrash />
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan="4" className="empty-table">
                        No hay servicios extras registrados.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>
            )}

          </div>

        </div>

      </div>

      {serviceToDetail && (

        <div className="modal-backdrop">

          <div className="modal-card-form">

            <div className="modal-header-styled">

              <h2>Detalles del Servicio</h2>

              <button
                className="btn-close"
                onClick={() => setServiceToDetail(null)}
              >
                ✕
              </button>

            </div>

            <div className="modal-detail-grid">

              <div className="detail-item">
                <label>Servicio:</label>
                <span>{serviceToDetail.nameService}</span>
              </div>

              <div className="detail-item">
                <label>Detalle:</label>
                <span>{serviceToDetail.detailService}</span>
              </div>

              <div className="detail-item">
                <label>Costo:</label>
                <span>
                  ${Number(serviceToDetail.cost).toLocaleString("es-AR")}
                </span>
              </div>

            </div>

            <div className="modal-footer-right">

              <button
                className="btn-j-primary"
                onClick={() => setServiceToDetail(null)}
              >
                Cerrar
              </button>

            </div>

          </div>

        </div>

      )}

      {serviceToEdit && (

        <div className="modal-backdrop">

          <div className="modal-card-form">

            <div className="modal-header-styled">

              <h2>Editar Servicio Extra</h2>

              <button
                className="btn-close"
                onClick={() => setServiceToEdit(null)}
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSaveEdit}
              className="modal-edit-form"
            >

              <div className="form-grid-2">

                <div className="form-group">

                  <label>Nombre del Servicio</label>

                  <input
                    type="text"
                    name="nameService"
                    value={serviceToEdit.nameService || ""}
                    onChange={handleEditChange}
                    required
                  />

                </div>

                <div className="form-group">

                  <label>Costo</label>

                  <input
                    type="number"
                    name="cost"
                    value={serviceToEdit.cost || ""}
                    onChange={handleEditChange}
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>Detalle</label>

                  <textarea
                    name="detailService"
                    value={serviceToEdit.detailService || ""}
                    onChange={handleEditChange}
                    required
                  />

                </div>

              </div>

              <div className="modal-footer-right">

                <button
                  type="button"
                  className="btn-j-link-secondary"
                  onClick={() => setServiceToEdit(null)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-submit-cyan"
                  disabled={savingEdit}
                >
                  {savingEdit
                    ? "Guardando..."
                    : "Guardar Cambios"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {serviceToDelete && (

        <div className="modal-backdrop">

          <div className="modal-card-j">

            <div className="modal-body-j">

              <div className="modal-icon-circle danger">
                <IconTrashWarning />
              </div>

              <div className="modal-content-j">

                <p className="modal-text-j">
                  ¿Está seguro de que desea eliminar este servicio extra?
                </p>

                <button
                  type="button"
                  className="btn-j-danger"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  {deleting
                    ? "Eliminando..."
                    : "Eliminar servicio"}
                </button>

                <button
                  type="button"
                  className="btn-j-link-secondary"
                  onClick={() => setServiceToDelete(null)}
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

export default ExtraServiceList;