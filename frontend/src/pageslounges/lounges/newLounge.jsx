import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./newLounge.css";

const IconLounge = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconMapPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
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

function NewLounge() {
  const navigate = useNavigate();

  const emptyLounge = {
    name: "",
    loungeAddress: "",
    idLocation: ""
  };

  const [lounge, setLounge] = useState(emptyLounge);
  const [locations, setLocations] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

 
  useEffect(() => {
    fetch("http://localhost:3000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Error al cargar locaciones:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLounge((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!lounge.name.trim()) errors.name = "El nombre del salón es obligatorio.";
    if (!lounge.loungeAddress.trim()) errors.loungeAddress = "La dirección es obligatoria.";
    
    if (!lounge.idLocation.toString().trim()) {
      errors.idLocation = "La ciudad y código postal son obligatorios.";
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
      const response = await fetch("http://localhost:3000/api/lounge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lounge,
          idLocation: Number(lounge.idLocation) 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo registrar el salón.");
      }

      setShowSuccessModal(true);
      setLounge(emptyLounge);
      setFieldErrors({});
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="lounge-dashboard">
        <header className="dashboard-header">
          <div className="header-title-group">
            <div className="header-icon">
              <IconLounge />
            </div>
            <div>
              <h1>Nuevo Salón</h1>
              <p>Completá los campos requeridos para dar de alta al salón en STYLO</p>
            </div>
          </div>
        </header>

        {globalError && (
          <div className="alert-inline alert-error">
            <IconAlertCircle />
            <span>{globalError}</span>
          </div>
        )}

        <form className="dashboard-form" onSubmit={handleSubmit} noValidate>
          <div className="cards-grid">
            <div className="form-card full-width">
              <div className="card-header">
                <span className="card-icon"><IconLounge /></span>
                <h2>Datos del Salón</h2>
              </div>
              <div className="card-body">
                <div className={`form-group ${fieldErrors.name ? "has-error" : ""}`}>
                  <label htmlFor="name">Nombre del Salón *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={lounge.name}
                    onChange={handleChange}
                    placeholder="Ej: Stylo + (Zona)"
                  />
                  {fieldErrors.name && <span className="error-message">{fieldErrors.name}</span>}
                </div>
              </div>
            </div>

            <div className="form-card full-width">
              <div className="card-header">
                <span className="card-icon"><IconMapPin /></span>
                <h2>Ubicación</h2>
              </div>
              <div className="card-body grid-2-cols">
                <div className={`form-group ${fieldErrors.loungeAddress ? "has-error" : ""}`}>
                  <label htmlFor="loungeAddress">Dirección *</label>
                  <input
                    id="loungeAddress"
                    type="text"
                    name="loungeAddress"
                    value={lounge.loungeAddress}
                    onChange={handleChange}
                    placeholder="Ej: Av. Pellegrini 3124"
                  />
                  {fieldErrors.loungeAddress && <span className="error-message">{fieldErrors.loungeAddress}</span>}
                </div>

                <div className={`form-group ${fieldErrors.idLocation ? "has-error" : ""}`}>
                  <label htmlFor="idLocation">Ciudad y Código Postal *</label>
                  <select
                    id="idLocation"
                    name="idLocation"
                    value={lounge.idLocation}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Seleccione una ubicación...</option>
                    {locations.map((loc) => (
                      <option key={loc.idLocation} value={loc.idLocation}>
                        {loc.city} (CP: {loc.zipCode})
                      </option>
                    ))}
                  </select>
                  {fieldErrors.idLocation && <span className="error-message">{fieldErrors.idLocation}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="form-submit-wrapper">
            <button
              type="button"
              className="btn-secondary-outline"
              onClick={() => navigate("/lounge")}
            >
              <IconArrowLeft /> Cancelar
            </button>

            <button
              type="submit"
              className="btn-submit-cyan"
              disabled={submitting}
            >
              <IconSend /> {submitting ? "Guardando..." : "Enviar"}
            </button>
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
                  ¡Salón registrado con éxito en la base de datos!
                </p>

                <button
                  type="button"
                  className="btn-j-primary"
                  onClick={() => navigate("/lounge")}
                >
                  Ir al listado
                </button>

                <button
                  type="button"
                  className="btn-j-link"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Cargar otro salón
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewLounge;