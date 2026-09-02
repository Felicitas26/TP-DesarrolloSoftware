import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editLoungeType.css";

function EditLoungeType() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loungeType, setLoungeType] = useState({
    minQuantity: "",
    maxQuantity: "",
    idLounge: ""
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
          minQuantity,
          maxQuantity,
          idLounge: Number(loungeType.idLounge)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el tipo de salón");
      }

      navigate("/loungeType");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loungeType-container">
        <p className="state-msg">Cargando tipo de salón...</p>
      </div>
    );
  }

  return (
    <div className="loungeType-container">
      <h1>Editar Tipo de Salón</h1>

      {error && <div className="alert-error">{error}</div>}

      <form className="loungeType-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="idLounge">Salón al que pertenece *</label>
          <select
            id="idLounge"
            name="idLounge"
            value={loungeType.idLounge || ""}
            onChange={handleChange}
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

        <div className="form-group">
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

        <div className="form-group">
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

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/loungeType")}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditLoungeType;
