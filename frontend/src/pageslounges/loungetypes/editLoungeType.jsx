import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./editLoungeType.css";

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

function EditLoungeType() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const filterLoungeId = searchParams.get("loungeId") || "";
  const filterLoungeName = searchParams.get("loungeName") || "";

  const filteredBackPath = filterLoungeId
    ? `/loungeType?loungeId=${filterLoungeId}&loungeName=${encodeURIComponent(filterLoungeName)}`
    : "/loungeType";

  const [loungeType, setLoungeType] = useState({
    nameLoungeType: "",
    minQuantity: "",
    maxQuantity: "",
    idLounge: filterLoungeId || ""
  });
  const [lounges, setLounges] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [typeRes, loungeRes] = await Promise.all([
          fetch(`http://localhost:3000/api/loungeType/${id}`),
          fetch("http://localhost:3000/api/lounge")
        ]);

        const typeData = await typeRes.json();
        const loungeData = await loungeRes.json();

        if (!typeRes.ok) {
          throw new Error(typeData.error || "Error al cargar los datos del tipo de salón");
        }
        if (!loungeRes.ok) {
          throw new Error(loungeData.error || "Error al cargar los salones");
        }

        setLoungeType({
          nameLoungeType: typeData.nameLoungeType || "",
          minQuantity: typeData.minQuantity,
          maxQuantity: typeData.maxQuantity,
          idLounge: typeData.idLounge
        });
        setLounges(loungeData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoungeType((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!loungeType.nameLoungeType || !String(loungeType.nameLoungeType).trim()) {
      setError("El nombre del tipo de salón es obligatorio.");
      setSubmitting(false);
      return;
    }

    const minQuantity = Number(loungeType.minQuantity);
    const maxQuantity = Number(loungeType.maxQuantity);

    if (isNaN(minQuantity) || minQuantity < 50) {
      setError("La capacidad mínima no puede ser inferior a 50 personas.");
      setSubmitting(false);
      return;
    }

    if (isNaN(maxQuantity) || maxQuantity > 200) {
      setError("La capacidad máxima no puede superar las 200 personas.");
      setSubmitting(false);
      return;
    }

    if (minQuantity > maxQuantity) {
      setError("La capacidad mínima no puede superar la máxima.");
      setSubmitting(false);
      return;
    }

    if (!loungeType.idLounge) {
      setError("Debe seleccionar el salón al que pertenece el tipo.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/loungeType/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nameLoungeType: String(loungeType.nameLoungeType).trim(),
          minQuantity,
          maxQuantity,
          idLounge: Number(loungeType.idLounge)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          const dest = lounges.find(
            (l) => (l.idLounge || l.id || l.id_lounge) === Number(loungeType.idLounge)
          );
          const destName = dest ? dest.name : "";
          setError(
            `No se puede guardar: ya existe un tipo de salón llamado "${loungeType.nameLoungeType}" `
            + `en el salón ${destName ? `"${destName}"` : `(ID ${loungeType.idLounge})`}. `
            + "Elegí otro nombre o seleccioná otro salón."
          );
        } else {
          setError(data.error || "Error al actualizar el tipo de salón");
        }
        setSubmitting(false);
        return;
      }

      navigate(filteredBackPath);
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
          <p className="loading-text">Cargando tipo de salón...</p>
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

      <header className="gestion-bar gestion-bar-form">
        <span className="gestion-logo">EDITAR TIPO DE SALÓN</span>
        <button type="button" className="gestion-btn-back" onClick={() => navigate(filteredBackPath)}>
          <IconArrowLeft /> Volver
        </button>
      </header>

      <div className="gestion-dashboard gestion-form-wrap">
        <div className="gestion-panel">
          <h1>Editar Tipo de Salón</h1>
          <p>Modificá los datos del tipo de salón</p>
        </div>

        {error && (
          <div className="gestion-alert-error">
            <IconAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <form className="gestion-form" onSubmit={handleSubmit}>
          <div className="gestion-form-card">
            <div className="gestion-form-card-title">Datos del Tipo de Salón</div>

            <div className="gestion-form-grid">
              <div className="gestion-form-group full-width">
                <label htmlFor="nameLoungeType">Nombre del Tipo de Salón *</label>
                <input
                  id="nameLoungeType"
                  type="text"
                  name="nameLoungeType"
                  value={loungeType.nameLoungeType || ""}
                  onChange={handleChange}
                  placeholder="Ej: Salón Completo"
                />
              </div>

              <div className="gestion-form-group full-width">
                <label htmlFor="idLounge">Salón al que pertenece *</label>
                <select
                  id="idLounge"
                  name="idLounge"
                  value={loungeType.idLounge || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="" disabled>
                    Seleccione un salón...
                  </option>
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

              <div className="gestion-form-group">
                <label htmlFor="minQuantity">Capacidad Mínima *</label>
                <input
                  id="minQuantity"
                  type="number"
                  name="minQuantity"
                  value={loungeType.minQuantity || ""}
                  onChange={handleChange}
                  min="50"
                  max="200"
                  required
                />
              </div>

              <div className="gestion-form-group">
                <label htmlFor="maxQuantity">Capacidad Máxima *</label>
                <input
                  id="maxQuantity"
                  type="number"
                  name="maxQuantity"
                  value={loungeType.maxQuantity || ""}
                  onChange={handleChange}
                  min="50"
                  max="200"
                  required
                />
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

export default EditLoungeType;
