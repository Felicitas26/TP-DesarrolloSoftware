import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./newLoungeType.css";

const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconCheck = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconAlertCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

function NewLoungeType() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const filterLoungeId = searchParams.get("loungeId") || "";
  const filterLoungeName = searchParams.get("loungeName") || "";

  const emptyLoungeType = {
    nameLoungeType: "",
    minQuantity: "",
    maxQuantity: "",
    idLounge: filterLoungeId || ""
  };

  const filteredBackPath = filterLoungeId
    ? `/loungeType?loungeId=${filterLoungeId}&loungeName=${encodeURIComponent(filterLoungeName)}`
    : "/loungeType";

  const [loungeType, setLoungeType] = useState(emptyLoungeType);
  const [lounges, setLounges] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/lounge")
      .then((res) => res.json())
      .then((data) => setLounges(data))
      .catch((err) => console.error("Error al cargar salones:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoungeType((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const isFieldComplete = (name) => {
    const value = loungeType[name];
    return Boolean(value && String(value).trim());
  };

  const validateForm = () => {
    const errors = {};

    if (!loungeType.nameLoungeType || !String(loungeType.nameLoungeType).trim()) {
      errors.nameLoungeType = "El nombre del tipo de salón es obligatorio.";
    }

    if (!loungeType.idLounge || loungeType.idLounge === "") {
      errors.idLounge = "Debe seleccionar el salón al que pertenece el tipo.";
    }

    if (!loungeType.minQuantity.toString().trim()) {
      errors.minQuantity = "La capacidad mínima es obligatoria.";
    } else if (isNaN(loungeType.minQuantity)) {
      errors.minQuantity = "Debe ser un número válido.";
    } else if (Number(loungeType.minQuantity) < 50) {
      errors.minQuantity = "La capacidad mínima no puede ser inferior a 50 personas.";
    }

    if (!loungeType.maxQuantity.toString().trim()) {
      errors.maxQuantity = "La capacidad máxima es obligatoria.";
    } else if (isNaN(loungeType.maxQuantity)) {
      errors.maxQuantity = "Debe ser un número válido.";
    } else if (Number(loungeType.maxQuantity) > 200) {
      errors.maxQuantity = "La capacidad máxima no puede superar las 200 personas.";
    } else if (
      !isNaN(loungeType.minQuantity) &&
      !isNaN(loungeType.maxQuantity) &&
      Number(loungeType.minQuantity) > Number(loungeType.maxQuantity)
    ) {
      errors.maxQuantity = "La capacidad máxima no puede ser menor a la mínima.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError(null);

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/loungeType", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameLoungeType: String(loungeType.nameLoungeType).trim(),
          minQuantity: Number(loungeType.minQuantity),
          maxQuantity: Number(loungeType.maxQuantity),
          idLounge: Number(loungeType.idLounge)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo registrar el tipo de salón.");
      }

      setShowSuccessModal(true);
      setLoungeType(emptyLoungeType);
      setFieldErrors({});
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setSubmitting(false);
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

      <header className="gestion-bar gestion-bar-form">
        <span className="gestion-logo">NUEVO TIPO DE SALÓN</span>
        <button type="button" className="gestion-btn-back" onClick={() => navigate(filteredBackPath)}>
          <IconArrowLeft /> Volver
        </button>
      </header>

      <div className="gestion-dashboard gestion-form-wrap">
        <div className="gestion-panel">
          <h1>Nuevo Tipo de Salón</h1>
          <p>Completá los datos para dar de alta un nuevo tipo de salón</p>
        </div>

        {globalError && (
          <div className="gestion-alert-error">
            <IconAlertCircle />
            <span>{globalError}</span>
          </div>
        )}

        <form className="gestion-form" onSubmit={handleSubmit} noValidate>
          <div className="gestion-form-card">
            <div className="gestion-form-card-title">
              <span className="gestion-form-card-icon"><IconLayers /></span>
              Datos del Tipo de Salón
            </div>

            <div className="gestion-form-grid">
              <div className="gestion-form-group full-width">
                <label htmlFor="nameLoungeType">Nombre del Tipo de Salón *</label>
                <input
                  id="nameLoungeType"
                  type="text"
                  name="nameLoungeType"
                  value={loungeType.nameLoungeType}
                  onChange={handleChange}
                  placeholder="Ej: Salón Completo"
                  className={isFieldComplete("nameLoungeType") ? "input-complete" : ""}
                />
                {fieldErrors.nameLoungeType && <span className="error-message">{fieldErrors.nameLoungeType}</span>}
              </div>

              <div className="gestion-form-group full-width">
                <label htmlFor="idLounge">Salón al que pertenece *</label>
                <select
                  id="idLounge"
                  name="idLounge"
                  value={loungeType.idLounge}
                  onChange={handleChange}
                  className={isFieldComplete("idLounge") ? "input-complete form-control" : "form-control"}
                >
                  <option value="">Seleccione un salón...</option>
                  {lounges.map((l) => {
                    const idLounge = l.id_lounge || l.idLounge || l.id;
                    return (
                      <option key={idLounge} value={idLounge}>
                        {l.name} (ID: {idLounge})
                      </option>
                    );
                  })}
                </select>
                {fieldErrors.idLounge && <span className="error-message">{fieldErrors.idLounge}</span>}
              </div>

              <div className="gestion-form-group">
                <label htmlFor="minQuantity">Capacidad Mínima *</label>
                <input
                  id="minQuantity"
                  type="number"
                  name="minQuantity"
                  value={loungeType.minQuantity}
                  onChange={handleChange}
                  placeholder="Ej: 50"
                  min="50"
                  max="200"
                  className={isFieldComplete("minQuantity") ? "input-complete" : ""}
                />
                {fieldErrors.minQuantity && <span className="error-message">{fieldErrors.minQuantity}</span>}
              </div>

              <div className="gestion-form-group">
                <label htmlFor="maxQuantity">Capacidad Máxima *</label>
                <input
                  id="maxQuantity"
                  type="number"
                  name="maxQuantity"
                  value={loungeType.maxQuantity}
                  onChange={handleChange}
                  placeholder="Ej: 150"
                  min="50"
                  max="200"
                  className={isFieldComplete("maxQuantity") ? "input-complete" : ""}
                />
                {fieldErrors.maxQuantity && <span className="error-message">{fieldErrors.maxQuantity}</span>}
              </div>
            </div>

            <div className="gestion-form-actions">
              <button
                type="button"
                className="gestion-btn-back"
                onClick={() => navigate(filteredBackPath)}
              >
                <IconArrowLeft /> Cancelar
              </button>

              <button type="submit" className="gestion-btn-primary" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="modal-backdrop">
          <div className="modal-card-j">
            <div className="modal-body-j">
              <div className="modal-icon-circle">
                <IconCheck />
              </div>
              <div className="modal-content-j">
                <p className="modal-text-j">
                  ¡Tipo de salón registrado con éxito en la base de datos!
                </p>

                <button
                  type="button"
                  className="btn-j-primary"
                  onClick={() => navigate(filteredBackPath)}
                >
                  Ir al listado
                </button>

                <button
                  type="button"
                  className="btn-j-link"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Cargar otro tipo de salón
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewLoungeType;
