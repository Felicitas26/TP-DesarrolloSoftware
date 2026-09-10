import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./priceList.css";

const IconTag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

function NewPrice() {
  const navigate = useNavigate();

  const [loungeTypes, setLoungeTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const [form, setForm] = useState({
    idLoungeType: "",
    effectiveDate: "",
    endDate: "",
    value: ""
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/loungeType"
        );

        if (response.ok) {
          setLoungeTypes(await response.json());
        }
      } catch (error) {
        console.error("Error al cargar tipos de salón:", error);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchTypes();
  }, []);

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
        "http://localhost:3000/api/price",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("sty_token")}`
          },
          body: JSON.stringify({
            idLoungeType: Number(form.idLoungeType),
            effectiveDate: form.effectiveDate,
            endDate: form.endDate || null,
            value: Number(form.value)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo crear el precio."
        );
      }

      navigate("/price");

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
              <IconTag />
            </div>

            <div>
              <h1>Nuevo Precio</h1>
              <p>
                Definí el valor de alquiler de un tipo de salón para una fecha de vigencia
              </p>
            </div>

          </div>

          <button
            className="btn-back-panel"
            onClick={() => navigate("/price")}
          >
            <IconArrowLeft />
            Volver a Precios
          </button>

        </header>

        <div className="form-card">

          <div className="card-body">

            <form onSubmit={handleSubmit}>

              <div className="form-grid-2">

                <div className="form-group">

                  <label>Salón</label>

                  <select
                    name="idLoungeType"
                    value={form.idLoungeType}
                    onChange={handleChange}
                    required
                    disabled={loadingTypes}
                  >
                    <option value="">
                      {loadingTypes
                        ? "Cargando tipos..."
                        : "Seleccioná un tipo"}
                    </option>

                    {loungeTypes.map((type) => (
                      <option
                        key={type.idLoungeType}
                        value={type.idLoungeType}
                      >
                        {type.nameLoungeType} ({type.minQuantity} - {type.maxQuantity} invitados)
                      </option>
                    ))}

                  </select>

                </div>

                <div className="form-group">

                  <label>Valor</label>

                  <input
                    type="number"
                    name="value"
                    value={form.value}
                    onChange={handleChange}
                    placeholder="Ej: 1500000"
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>Vigencia desde</label>

                  <input
                    type="date"
                    name="effectiveDate"
                    value={form.effectiveDate}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="form-group">

                  <label>Vigencia hasta (opcional)</label>

                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="modal-footer-right">

                <button
                  type="button"
                  className="btn-j-link-secondary"
                  onClick={() => navigate("/price")}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-submit-cyan"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Crear Precio"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default NewPrice;