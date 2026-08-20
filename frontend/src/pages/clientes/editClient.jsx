import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editClient.css";

function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState({
    nameCli: "",
    lastNameCli: "",
    dniCli: "",
    phoneCli: "",
    emailCli: "",
    addressCli: "",
    localityCli: ""
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getClient = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/client/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al cargar los datos del cliente");
        }

        setClient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getClient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/client/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(client)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el cliente");
      }

      navigate("/client");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="client-container"><p className="state-msg">Cargando cliente...</p></div>;

  return (
    <div className="client-container">
      <h1>Editar Cliente</h1>

      {error && <div className="alert-error">{error}</div>}

      <form className="client-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nameCli">Nombre *</label>
          <input
            id="nameCli"
            type="text"
            name="nameCli"
            value={client.nameCli || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastNameCli">Apellido *</label>
          <input
            id="lastNameCli"
            type="text"
            name="lastNameCli"
            value={client.lastNameCli || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dniCli">DNI *</label>
          <input
            id="dniCli"
            type="text"
            name="dniCli"
            pattern="[0-9]{7,8}"
            title="Ingrese un DNI válido (7 a 8 dígitos)"
            value={client.dniCli || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneCli">Teléfono</label>
          <input
            id="phoneCli"
            type="tel"
            name="phoneCli"
            value={client.phoneCli || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="emailCli">Email *</label>
          <input
            id="emailCli"
            type="email"
            name="emailCli"
            value={client.emailCli || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="addressCli">Dirección</label>
          <input
            id="addressCli"
            type="text"
            name="addressCli"
            value={client.addressCli || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="localityCli">Localidad</label>
          <input
            id="localityCli"
            type="text"
            name="localityCli"
            value={client.localityCli || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/client")}
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

export default EditClient;