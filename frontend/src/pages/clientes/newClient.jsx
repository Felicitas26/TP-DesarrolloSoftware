import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./newClient.css";

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
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

function NewClient() {
  const navigate = useNavigate();

  const emptyClient = {
    nameCli: "",
    surnameCli: "",
    dniCli: "",
    phoneCli: "",
    emailCli: "",
    addressCli: "",
    cityCli: ""
  };

  const [client, setClient] = useState(emptyClient);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!client.nameCli.trim()) errors.nameCli = "El nombre es obligatorio.";
    if (!client.surnameCli.trim()) errors.surnameCli = "El apellido es obligatorio.";
    
    if (!client.dniCli.trim()) {
      errors.dniCli = "El DNI es obligatorio.";
    } else if (!/^\d+$/.test(client.dniCli)) {
      errors.dniCli = "Solo números.";
    }

    if (!client.phoneCli.trim()) {
      errors.phoneCli = "El teléfono es obligatorio.";
    } else if (!/^\d+$/.test(client.phoneCli)) {
      errors.phoneCli = "Solo números.";
    }

    if (!client.emailCli.trim()) {
      errors.emailCli = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.emailCli)) {
      errors.emailCli = "Email inválido.";
    }

    if (!client.addressCli.trim()) errors.addressCli = "La dirección es obligatoria.";
    if (!client.cityCli.trim()) errors.cityCli = "La ciudad es obligatoria.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError(null);

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo registrar el cliente.");
      }

      setShowSuccessModal(true);
      setClient(emptyClient);
      setFieldErrors({});
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="client-dashboard">
        <header className="dashboard-header">
          <div className="header-title-group">
            <div className="header-icon">
              <IconUser />
            </div>
            <div>
              <h1>Nuevo Registro</h1>
              <p>Completá los campos requeridos para dar de alta al cliente en STYLO</p>
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
            <div className="form-card">
              <div className="card-header">
                <span className="card-icon"><IconUser /></span>
                <h2>Datos Principales</h2>
              </div>
              <div className="card-body">
                <div className={`form-group ${fieldErrors.nameCli ? "has-error" : ""}`}>
                  <label htmlFor="nameCli">Nombre *</label>
                  <input
                    id="nameCli"
                    type="text"
                    name="nameCli"
                    value={client.nameCli}
                    onChange={handleChange}
                    placeholder="Ej: Luisina"
                  />
                  {fieldErrors.nameCli && <span className="error-message">{fieldErrors.nameCli}</span>}
                </div>

                <div className={`form-group ${fieldErrors.surnameCli ? "has-error" : ""}`}>
                  <label htmlFor="surnameCli">Apellido *</label>
                  <input
                    id="surnameCli"
                    type="text"
                    name="surnameCli"
                    value={client.surnameCli}
                    onChange={handleChange}
                    placeholder="Ej: Movio"
                  />
                  {fieldErrors.surnameCli && <span className="error-message">{fieldErrors.surnameCli}</span>}
                </div>

                <div className={`form-group ${fieldErrors.dniCli ? "has-error" : ""}`}>
                  <label htmlFor="dniCli">DNI / Documento *</label>
                  <input
                    id="dniCli"
                    type="text"
                    name="dniCli"
                    value={client.dniCli}
                    onChange={handleChange}
                    placeholder="Ej: 38123456"
                  />
                  {fieldErrors.dniCli && <span className="error-message">{fieldErrors.dniCli}</span>}
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="card-header">
                <span className="card-icon"><IconPhone /></span>
                <h2>Contacto</h2>
              </div>
              <div className="card-body">
                <div className={`form-group ${fieldErrors.phoneCli ? "has-error" : ""}`}>
                  <label htmlFor="phoneCli">Teléfono *</label>
                  <input
                    id="phoneCli"
                    type="tel"
                    name="phoneCli"
                    value={client.phoneCli}
                    onChange={handleChange}
                    placeholder="(011) 1234-5678"
                  />
                  {fieldErrors.phoneCli && <span className="error-message">{fieldErrors.phoneCli}</span>}
                </div>

                <div className={`form-group ${fieldErrors.emailCli ? "has-error" : ""}`}>
                  <label htmlFor="emailCli">Email *</label>
                  <input
                    id="emailCli"
                    type="email"
                    name="emailCli"
                    value={client.emailCli}
                    onChange={handleChange}
                    placeholder="ejemplo@mail.com"
                  />
                  {fieldErrors.emailCli && <span className="error-message">{fieldErrors.emailCli}</span>}
                </div>
              </div>
            </div>

            <div className="form-card full-width">
              <div className="card-header">
                <span className="card-icon"><IconMapPin /></span>
                <h2>Ubicación</h2>
              </div>
              <div className="card-body grid-2-cols">
                <div className={`form-group ${fieldErrors.addressCli ? "has-error" : ""}`}>
                  <label htmlFor="addressCli">Dirección *</label>
                  <input
                    id="addressCli"
                    type="text"
                    name="addressCli"
                    value={client.addressCli}
                    onChange={handleChange}
                    placeholder="Ej: Av. Pellegrini 1234"
                  />
                  {fieldErrors.addressCli && <span className="error-message">{fieldErrors.addressCli}</span>}
                </div>

                <div className={`form-group ${fieldErrors.cityCli ? "has-error" : ""}`}>
                  <label htmlFor="cityCli">Ciudad / Localidad *</label>
                  <input
                    id="cityCli"
                    type="text"
                    name="cityCli"
                    value={client.cityCli}
                    onChange={handleChange}
                    placeholder="Ej: Rosario"
                  />
                  {fieldErrors.cityCli && <span className="error-message">{fieldErrors.cityCli}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="form-submit-wrapper">
            <button
              type="button"
              className="btn-secondary-outline"
              onClick={() => navigate("/client")}
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
                  ¡Cliente registrado con éxito en la base de datos!
                </p>

                <button
                  type="button"
                  className="btn-j-primary"
                  onClick={() => navigate("/client")}
                >
                  Ir al listado
                </button>

                <button
                  type="button"
                  className="btn-j-link"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Cargar otro cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewClient;