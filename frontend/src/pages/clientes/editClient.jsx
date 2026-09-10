import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./editClient.css";

function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isMyProfile = location.pathname === "/client/edit/me";

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
  const [cityInput, setCityInput] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const normalizeText = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("sty_token");

        const clientRes = await fetch(
          isMyProfile
            ? "http://localhost:3000/api/client/me"
            : `http://localhost:3000/api/client/${id}`,
          isMyProfile
            ? {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            : {}
        );

        const locsRes = await fetch(
          "http://localhost:3000/api/locations"
        );

        const clientData = await clientRes.json();
        const locsData = await locsRes.json();

        if (!clientRes.ok) {
          throw new Error(
            clientData.error ||
              "Error al cargar los datos del cliente"
          );
        }

        if (!locsRes.ok) {
          throw new Error(
            locsData.error ||
              "Error al cargar las ubicaciones"
          );
        }

        setClient({
          ...clientData,
          idLocation: clientData.idLocation || ""
        });

        const matchedLoc = locsData.find(
          (l) => l.idLocation === clientData.idLocation
        );
        setCityInput(matchedLoc?.city || clientData.city || "");
        setPostalCode(matchedLoc?.zipCode || clientData.zipCode || "");

        setLocations(locsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();

  }, [id, isMyProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setClient((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    const matches = locations.filter((loc) =>
      normalizeText(loc.city).includes(normalizeText(value))
    );
    setSuggestions(value.trim() ? matches.slice(0, 5) : []);
    setShowSuggestions(value.trim().length > 0);

    if (normalizeText(locations.find((l) => l.idLocation === client.idLocation)?.city) === normalizeText(value)) {
      return;
    }
    setPostalCode("");
    setClient((prev) => ({ ...prev, idLocation: "" }));
  };

  const handleSelectCity = (loc) => {
    setCityInput(loc.city);
    setPostalCode(loc.zipCode);
    setClient((prev) => ({ ...prev, idLocation: loc.idLocation }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handlePostalChange = (e) => {
    setPostalCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    if (!cityInput.trim()) {
      setError("La ciudad es obligatoria.");
      setSubmitting(false);
      return;
    }

    if (!client.idLocation) {
      setError("La ciudad ingresada no existe en la base de ciudades de Argentina.");
      setSubmitting(false);
      return;
    }

    if (!postalCode.trim()) {
      setError("El código postal es obligatorio.");
      setSubmitting(false);
      return;
    }

    if (!/^\d+$/.test(postalCode.trim())) {
      setError("El código postal solo puede contener números.");
      setSubmitting(false);
      return;
    }

    const matchedLocation = locations.find(
      (l) => l.idLocation === client.idLocation
    );
    if (matchedLocation && String(matchedLocation.zipCode) !== String(postalCode.trim())) {
      setError(`El código postal no coincide. Para ${matchedLocation.city} el código es ${matchedLocation.zipCode}.`);
      setSubmitting(false);
      return;
    }

    if (!/^\d+$/.test(client.dniCli)) {
      setError("El DNI solo puede contener números.");
      setSubmitting(false);
      return;
    }

    if (
      client.dniCli.length < 7 ||
      client.dniCli.length > 9
    ) {
      setError(
        "El DNI debe tener entre 7 y 9 dígitos numéricos."
      );
      setSubmitting(false);
      return;
    }

    const body = {
      ...client,
      idLocation: Number(client.idLocation)
    };

    try {
      const token = localStorage.getItem("sty_token");

      const response = await fetch(
        isMyProfile
          ? "http://localhost:3000/api/client/me"
          : `http://localhost:3000/api/client/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(isMyProfile && {
              Authorization: `Bearer ${token}`
            })
          },
          body: JSON.stringify(body)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Error al actualizar el cliente"
        );
      }

      if (isMyProfile) {
        navigate("/my-profile");
      } else {
        navigate("/client");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="client-container">
        <p className="state-msg">
          Cargando cliente...
        </p>
      </div>
    );
  }

  return (
    <div className="client-container">

      <h1>
        {isMyProfile ? "Editar mi perfil" : "Editar Cliente"}
      </h1>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      <form
        className="client-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">
          <label htmlFor="nameCli">
            Nombre *
          </label>

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
          <label htmlFor="surnameCli">
            Apellido *
          </label>

          <input
            id="surnameCli"
            type="text"
            name="surnameCli"
            value={client.surnameCli || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dniCli">
            DNI *
          </label>

          <input
            id="dniCli"
            type="text"
            name="dniCli"
            pattern="[0-9]{7,9}"
            title="Ingrese un DNI válido (7 a 9 dígitos)"
            value={client.dniCli || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneCli">
            Teléfono *
          </label>

          <input
            id="phoneCli"
            type="tel"
            name="phoneCli"
            value={client.phoneCli || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="emailCli">
            Email *
          </label>

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
          <label htmlFor="addressCli">
            Dirección *
          </label>

          <input
            id="addressCli"
            type="text"
            name="addressCli"
            value={client.addressCli || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group" style={{ position: "relative" }}>
          <label htmlFor="cityInput">
            Ciudad *
          </label>

          <input
            id="cityInput"
            type="text"
            value={cityInput}
            onChange={handleCityChange}
            onFocus={() => {
              if (cityInput.trim()) {
                const matches = locations.filter((loc) =>
                  normalizeText(loc.city).includes(normalizeText(cityInput))
                );
                setSuggestions(matches.slice(0, 5));
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Ej: Rosario"
            autoComplete="off"
            required
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="city-suggestions">
              {suggestions.map((loc) => (
                <li
                  key={loc.idLocation}
                  onMouseDown={() => handleSelectCity(loc)}
                >
                  {loc.city} - CP: {loc.zipCode}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="postalCode">
            Código Postal *
          </label>

          <input
            id="postalCode"
            type="text"
            value={postalCode}
            onChange={handlePostalChange}
            placeholder="Ej: 2000"
            autoComplete="off"
            required
          />
        </div>

        <div className="form-actions">

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              navigate(
                isMyProfile
                  ? "/my-profile"
                  : "/client"
              )
            }
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? "Guardando..."
              : "Guardar Cambios"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditClient;