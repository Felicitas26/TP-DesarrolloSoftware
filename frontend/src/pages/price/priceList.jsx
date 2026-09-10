import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./priceList.css";

const IconTag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
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

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("es-AR") : "Sin fecha límite";

const fmtMoney = (v) =>
  `$${Number(v).toLocaleString("es-AR")}`;

function PriceList() {
  const navigate = useNavigate();

  const [prices, setPrices] = useState([]);
  const [loungeTypes, setLoungeTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [priceToDelete, setPriceToDelete] = useState(null);
  const [priceToDetail, setPriceToDetail] = useState(null);
  const [priceToEdit, setPriceToEdit] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const typeName = (idLoungeType) => {
    const found = loungeTypes.find(
      (t) => t.idLoungeType === idLoungeType
    );

    return found ? found.nameLoungeType : `Tipo #${idLoungeType}`;
  };

  const priceKey = (price) =>
    `${price.idLoungeType}/${encodeURIComponent(
      new Date(price.effectiveDate).toISOString().slice(0, 10)
    )}`;

  const fetchData = async () => {
    try {
      setLoading(true);

      const [pricesRes, typesRes] = await Promise.all([
        fetch("http://localhost:3000/api/price"),
        fetch("http://localhost:3000/api/loungeType")
      ]);

      if (pricesRes.ok) {
        setPrices(await pricesRes.json());
      }

      if (typesRes.ok) {
        setLoungeTypes(await typesRes.json());
      }
    } catch (error) {
      console.error("Error al cargar precios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmDelete = async () => {
    if (!priceToDelete) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/price/${priceKey(priceToDelete)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sty_token")}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "No se pudo eliminar el precio.");
      }

      setPrices((prev) =>
        prev.filter(
          (price) =>
            price.idLoungeType !== priceToDelete.idLoungeType ||
            new Date(price.effectiveDate).getTime() !==
              new Date(priceToDelete.effectiveDate).getTime()
        )
      );

      setPriceToDelete(null);

    } catch (error) {
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setPriceToEdit((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    setSavingEdit(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/price/${priceKey(priceToEdit)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("sty_token")}`
          },
          body: JSON.stringify({
            value: Number(priceToEdit.value),
            endDate: priceToEdit.endDate || null
          })
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "No se pudo actualizar el precio.");
      }

      const data = await response.json();

      setPrices((prev) =>
        prev.map((price) =>
          price.idLoungeType === priceToEdit.idLoungeType &&
          new Date(price.effectiveDate).getTime() ===
            new Date(priceToEdit.effectiveDate).getTime()
            ? data
            : price
        )
      );

      setPriceToEdit(null);

    } catch (error) {
      alert(error.message);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="client-dashboard table-list-dashboard">

        <header className="dashboard-header-flex">

          <div className="header-title-group">

            <div className="header-icon">
              <IconTag />
            </div>

            <div>
              <h1>Precios de Salones</h1>
              <p>
                Gestión de los valores de alquiler según tipo de salón
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
              onClick={() => navigate("/price/new")}
            >
              <IconPlus />
              Nuevo Precio
            </button>

          </div>

        </header>

        <div className="form-card full-width">

          <div className="card-body-table">

            {loading ? (
              <p className="loading-text">
                Cargando precios...
              </p>
            ) : (
              <table className="clients-table">

                <thead>
                  <tr>
                    <th>Salón</th>
                    <th>Vigencia desde</th>
                    <th>Vigencia hasta</th>
                    <th>Valor</th>
                    <th style={{ textAlign: "center" }}>
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {prices.length > 0 ? (

                    prices.map((price) => (

                      <tr
                        key={`${price.idLoungeType}-${new Date(price.effectiveDate).getTime()}`}
                      >

                        <td className="font-semibold">
                          {typeName(price.idLoungeType)}
                        </td>

                        <td>
                          {new Date(price.effectiveDate).toLocaleDateString("es-AR")}
                        </td>

                        <td>
                          {fmtDate(price.endDate)}
                        </td>

                        <td>
                          {fmtMoney(price.value)}
                        </td>

                        <td>

                          <div className="actions-cell">

                            <button
                              type="button"
                              className="btn-action-view"
                              onClick={() =>
                                setPriceToDetail(price)
                              }
                              title="Ver Detalle"
                            >
                              <IconEye />
                            </button>

                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() =>
                                setPriceToEdit({
                                  ...price,
                                  endDate: price.endDate
                                    ? new Date(price.endDate)
                                        .toISOString()
                                        .slice(0, 10)
                                    : ""
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
                                setPriceToDelete(price)
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
                      <td colSpan="5" className="empty-table">
                        No hay precios registrados.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>
            )}

          </div>

        </div>

      </div>

      {priceToDetail && (

        <div className="modal-backdrop">

          <div className="modal-card-form">

            <div className="modal-header-styled">

              <h2>Detalles del Precio</h2>

              <button
                className="btn-close"
                onClick={() => setPriceToDetail(null)}
              >
                ✕
              </button>

            </div>

            <div className="modal-detail-grid">

              <div className="detail-item">
                <label>Salón:</label>
                <span>{typeName(priceToDetail.idLoungeType)}</span>
              </div>

              <div className="detail-item">
                <label>Capacidad:</label>
                <span>
                  {priceToDetail.loungeType
                    ? `${priceToDetail.loungeType.minQuantity} - ${priceToDetail.loungeType.maxQuantity} invitados`
                    : "-"}
                </span>
              </div>

              <div className="detail-item">
                <label>Valor:</label>
                <span>{fmtMoney(priceToDetail.value)}</span>
              </div>

              <div className="detail-item">
                <label>Vigencia desde:</label>
                <span>
                  {new Date(priceToDetail.effectiveDate).toLocaleDateString("es-AR")}
                </span>
              </div>

              <div className="detail-item">
                <label>Vigencia hasta:</label>
                <span>{fmtDate(priceToDetail.endDate)}</span>
              </div>

            </div>

            <div className="modal-footer-right">

              <button
                className="btn-j-primary"
                onClick={() => setPriceToDetail(null)}
              >
                Cerrar
              </button>

            </div>

          </div>

        </div>

      )}

      {priceToEdit && (

        <div className="modal-backdrop">

          <div className="modal-card-form">

            <div className="modal-header-styled">

              <h2>Editar Precio</h2>

              <button
                className="btn-close"
                onClick={() => setPriceToEdit(null)}
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

                  <label>Salón</label>

                  <input
                    type="text"
                    value={typeName(priceToEdit.idLoungeType)}
                    disabled
                  />

                </div>

                <div className="form-group">

                  <label>Vigencia desde (no editable)</label>

                  <input
                    type="text"
                    value={new Date(priceToEdit.effectiveDate).toLocaleDateString("es-AR")}
                    disabled
                  />

                </div>

                <div className="form-group">

                  <label>Valor</label>

                  <input
                    type="number"
                    name="value"
                    value={priceToEdit.value || ""}
                    onChange={handleEditChange}
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>Vigencia hasta (opcional)</label>

                  <input
                    type="date"
                    name="endDate"
                    value={priceToEdit.endDate || ""}
                    onChange={handleEditChange}
                  />

                </div>

              </div>

              <div className="modal-footer-right">

                <button
                  type="button"
                  className="btn-j-link-secondary"
                  onClick={() => setPriceToEdit(null)}
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

      {priceToDelete && (

        <div className="modal-backdrop">

          <div className="modal-card-j">

            <div className="modal-body-j">

              <div className="modal-icon-circle danger">
                <IconTrashWarning />
              </div>

              <div className="modal-content-j">

                <p className="modal-text-j">
                  ¿Está seguro de que desea eliminar el precio de {typeName(priceToDelete.idLoungeType)}?
                </p>

                <button
                  type="button"
                  className="btn-j-danger"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  {deleting
                    ? "Eliminando..."
                    : "Eliminar precio"}
                </button>

                <button
                  type="button"
                  className="btn-j-link-secondary"
                  onClick={() => setPriceToDelete(null)}
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

export default PriceList;