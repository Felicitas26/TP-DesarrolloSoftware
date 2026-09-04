import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./extraServiceList.css";

const IconSparkles = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0-1.3-1.3z"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

function NewExtraService() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nameService: "",
    detailService: "",
    cost: ""
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/extraservice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("sty_token")}`
          },
          body: JSON.stringify({
            nameService: form.nameService,
            detailService: form.detailService,
            cost: Number(form.cost)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo crear el servicio extra."
        );
      }

      navigate("/extraservice");

    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
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
              <h1>Nuevo Servicio Extra</h1>
              <p>
                Agregá un nuevo servicio adicional para los eventos de STYLO
              </p>
            </div>

          </div>

          <button
            className="btn-back-panel"
            onClick={() => navigate("/extraservice")}
          >
            <IconArrowLeft />
            Volver a Servicios
          </button>

        </header>

        <div className="form-card">

          <div className="card-body">

            <form onSubmit={handleSubmit}>

              <div className="form-grid-2">

                <div className="form-group">

                  <label>Nombre del Servicio</label>

                  <input
                    type="text"
                    name="nameService"
                    value={form.nameService}
                    onChange={handleChange}
                    placeholder="Ej: DJ"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>Costo</label>

                  <input
                    type="number"
                    name="cost"
                    value={form.cost}
                    onChange={handleChange}
                    placeholder="Ej: 50000"
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>Detalle</label>

                  <textarea
                    name="detailService"
                    value={form.detailService}
                    onChange={handleChange}
                    placeholder="Descripción del servicio..."
                    required
                  />

                </div>

              </div>

              <div className="modal-footer-right">

                <button
                  type="button"
                  className="btn-j-link-secondary"
                  onClick={() => navigate("/extraservice")}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-submit-cyan"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Crear Servicio"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default NewExtraService;