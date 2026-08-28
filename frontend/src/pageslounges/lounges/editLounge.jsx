import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editLounge.css";

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
      <div className="lounge-container">
        <p className="state-msg">Cargando salón...</p>
      </div>
    );
  }

  return (
    <div className="lounge-container">
      <h1>Editar Salón</h1>

      {error && <div className="alert-error">{error}</div>}

      <form className="lounge-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre del Salón *</label>
          <input
            id="name"
            type="text"
            name="name"
            value={lounge.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="loungeAddress">Dirección *</label>
          <input
            id="loungeAddress"
            type="text"
            name="loungeAddress"
            value={lounge.loungeAddress || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
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

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/lounge")}
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

export default EditLounge;