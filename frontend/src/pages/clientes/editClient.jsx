import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editClient.css";

function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState({
    nameCli: "",
    surnameCli: "",
    dniCli: "",
    phoneCli: "",
    emailCli: "",
    addressCli: "",
    idLocation: ""
  });
  const [locations, setLocations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [clientRes, locsRes] = await Promise.all([
          fetch(`http://localhost:3000/api/client/${id}`),
          fetch("http://localhost:3000/api/locations")
        ]);

        const clientData = await clientRes.json();
        const locsData = await locsRes.json();

        if (!clientRes.ok) {
          throw new Error(clientData.error || "Error al cargar los datos del cliente");
        }
        if (!locsRes.ok) {
          throw new Error(locsData.error || "Error al cargar las ubicaciones");
        }

        setClient({
          ...clientData,
          idLocation: clientData.idLocation || ""
        });
        setLocations(locsData);
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
    setClient((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const isFieldComplete = (name) => {
    const value = client[name];
    return Boolean(value && String(value).trim() && String(value) !== "0");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!client.idLocation) {
      setError("Debe seleccionar una ciudad.");
      setSubmitting(false);
      return;
    }

    const body = {
      ...client,
      idLocation: Number(client.idLocation)
    };

    try {
      const response = await fetch(`http://localhost:3000/api/client/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
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
            className={isFieldComplete("nameCli") ? "input-complete" : ""}
          />
        </div>

        <div className="form-group">
          <label htmlFor="surnameCli">Apellido *</label>
          <input
            id="surnameCli"
            type="text"
            name="surnameCli"
            value={client.surnameCli || ""}
            onChange={handleChange}
            required
            className={isFieldComplete("surnameCli") ? "input-complete" : ""}
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
            className={isFieldComplete("dniCli") ? "input-complete" : ""}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneCli">Teléfono *</label>
          <input
            id="phoneCli"
            type="tel"
            name="phoneCli"
            value={client.phoneCli || ""}
            onChange={handleChange}
            required
            className={isFieldComplete("phoneCli") ? "input-complete" : ""}
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
            className={isFieldComplete("emailCli") ? "input-complete" : ""}
          />
        </div>

        <div className="form-group">
          <label htmlFor="addressCli">Dirección *</label>
          <input
            id="addressCli"
            type="text"
            name="addressCli"
            value={client.addressCli || ""}
            onChange={handleChange}
            required
            className={isFieldComplete("addressCli") ? "input-complete" : ""}
          />
        </div>

        <div className="form-group">
          <label htmlFor="idLocation">Ciudad y Código Postal *</label>
          <select
            id="idLocation"
            name="idLocation"
            value={client.idLocation || ""}
            onChange={handleChange}
            required
            className={isFieldComplete("idLocation") ? "input-complete" : ""}
          >
            <option value="" disabled>
              Seleccione una ubicación...
            </option>
            {locations.map((loc) => (
              <option key={loc.idLocation} value={loc.idLocation}>
                {loc.city} - CP: {loc.zipCode}
              </option>
            ))}
          </select>
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