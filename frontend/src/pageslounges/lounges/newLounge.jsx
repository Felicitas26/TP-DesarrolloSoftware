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

  const handleLogout = () => {
    localStorage.removeItem("sty_token");
    localStorage.removeItem("sty_rol");
    localStorage.removeItem("sty_idUsuario");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLounge((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const isFieldComplete = (name) => {
    const value = lounge[name];
    return Boolean(value && String(value).trim());
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
    <div className="gestion-page">
      <div className="gestion-background" aria-hidden="true">
        <div className="gestion-glow gestion-glow-purple" />
        <div className="gestion-glow gestion-glow-cyan" />
        <div className="gestion-grid-overlay" />
      </div>
      <div className="gestion-overlay" />

      <header className="gestion-bar">
        <span className="gestion-logo">NUEVO SALÓN</span>
        <button type="button" className="gestion-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <div className="gestion-dashboard gestion-form-wrap">
        <div className="gestion-panel">
          <h1>Registrar Nuevo Salón</h1>
          <p>Completá los campos requeridos para dar de alta al salón en STYLO</p>
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
              <span className="gestion-form-card-icon"><IconLounge /></span>
              Datos del Salón
            </div>

            <div className="gestion-form-grid">
              <div className="gestion-form-group full-width">
                <label htmlFor="name">Nombre del Salón *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={lounge.name}
                  onChange={handleChange}
                  placeholder="Ej: Stylo + (Zona)"
                  className={isFieldComplete("name") ? "input-complete" : ""}
                />
                {fieldErrors.name && <span className="error-message">{fieldErrors.name}</span>}
              </div>
            </div>
          </div>

          <div className="gestion-form-card">
            <div className="gestion-form-card-title">
              <span className="gestion-form-card-icon"><IconMapPin /></span>
              Ubicación
            </div>

            <div className="gestion-form-grid">
              <div className="gestion-form-group">
                <label htmlFor="loungeAddress">Dirección *</label>
                <input
                  id="loungeAddress"
                  type="text"
                  name="loungeAddress"
                  value={lounge.loungeAddress}
                  onChange={handleChange}
                  placeholder="Ej: Av. Pellegrini 3124"
                  className={isFieldComplete("loungeAddress") ? "input-complete" : ""}
                />
                {fieldErrors.loungeAddress && <span className="error-message">{fieldErrors.loungeAddress}</span>}
              </div>

              <div className="gestion-form-group">
                <label htmlFor="idLocation">Ciudad y Código Postal *</label>
                <select
                  id="idLocation"
                  name="idLocation"
                  value={lounge.idLocation}
                  onChange={handleChange}
                  className={isFieldComplete("idLocation") ? "input-complete form-control" : "form-control"}
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

          <div className="gestion-form-actions">
            <button
              type="button"
              className="gestion-btn-back"
              onClick={() => navigate("/lounge")}
            >
              <IconArrowLeft /> Cancelar
            </button>

            <button
              type="submit"
              className="gestion-btn-primary"
              disabled={submitting}
            >
              {submitting ? "Guardando..." : "Guardar"}
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
