import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editLounge.css";

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconAlertCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

function EditLounge() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lounge, setLounge] = useState({
    name: "",
    loungeAddress: "",
    idtypeLounge: ""
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("sty_token");
    localStorage.removeItem("sty_rol");
    localStorage.removeItem("sty_idUsuario");
    navigate("/");
  };

  useEffect(() => {
    const getLounge = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/lounge/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al cargar los datos del salón");
        }

        setLounge(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getLounge();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLounge((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/lounge/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(lounge)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el salón");
      }

      navigate("/lounge");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="gestion-page">
        <div className="gestion-dashboard gestion-form-wrap">
          <p className="loading-text">Cargando salón...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-page">
      <div className="gestion-background" aria-hidden="true">
        <div className="gestion-glow gestion-glow-purple" />
        <div className="gestion-glow gestion-glow-cyan" />
        <div className="gestion-grid-overlay" />
      </div>
      <div className="gestion-overlay" />

      <header className="gestion-bar">
        <span className="gestion-logo">EDITAR SALÓN</span>
        <button type="button" className="gestion-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <div className="gestion-dashboard gestion-form-wrap">
        <div className="gestion-panel">
          <h1>Editar Salón</h1>
          <p>Modificá los datos del salón</p>
        </div>

        {error && (
          <div className="gestion-alert-error">
            <IconAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <form className="gestion-form" onSubmit={handleSubmit}>
          <div className="gestion-form-card">
            <div className="gestion-form-card-title">Datos del Salón</div>

            <div className="gestion-form-grid">
              <div className="gestion-form-group full-width">
                <label htmlFor="name">Nombre del Salón *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={lounge.name || ""}
                  onChange={handleChange}
                  placeholder="Ej: Stylo + (Zona)"
                  required
                />
              </div>

              <div className="gestion-form-group full-width">
                <label htmlFor="loungeAddress">Dirección *</label>
                <input
                  id="loungeAddress"
                  type="text"
                  name="loungeAddress"
                  value={lounge.loungeAddress || ""}
                  onChange={handleChange}
                  placeholder="Ej: Av. Pellegrini 3124"
                  required
                />
              </div>

              <div className="gestion-form-group full-width">
                <label htmlFor="idtypeLounge">Tipo de Salón (ID) *</label>
                <input
                  id="idtypeLounge"
                  type="number"
                  name="idtypeLounge"
                  value={lounge.idtypeLounge || ""}
                  onChange={handleChange}
                  required
                />
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
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLounge;
