import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { clientService, locationService } from "../../services";
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
  const [fieldErrors, setFieldErrors] = useState({});

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

        const clientData = isMyProfile
          ? await clientService.getMe()
          : await clientService.getById(id);

        const locsData = await locationService.getAll();

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

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    const matches = locations.filter((loc) =>
      normalizeText(loc.city).includes(normalizeText(value))
    );
    setSuggestions(value.trim() ? matches.slice(0, 5) : []);
    setShowSuggestions(value.trim().length > 0);

    if (fieldErrors.city) {
      setFieldErrors((prev) => ({ ...prev, city: null }));
    }
    if (fieldErrors.postalCode) {
      setFieldErrors((prev) => ({ ...prev, postalCode: null }));
    }

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
    setFieldErrors((prev) => ({ ...prev, city: null, postalCode: null }));
  };

  const handlePostalChange = (e) => {
    setPostalCode(e.target.value);
    if (fieldErrors.postalCode) {
      setFieldErrors((prev) => ({ ...prev, postalCode: null }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!client.nameCli?.trim()) {
      errors.nameCli = "El nombre es obligatorio.";
    } else if (client.nameCli.trim().length < 2) {
      errors.nameCli = "El nombre debe tener al menos 2 caracteres.";
    }

    if (!client.surnameCli?.trim()) {
      errors.surnameCli = "El apellido es obligatorio.";
    } else if (client.surnameCli.trim().length < 2) {
      errors.surnameCli = "El apellido debe tener al menos 2 caracteres.";
    }

    if (!client.dniCli?.trim()) {
      errors.dniCli = "El DNI es obligatorio.";
    } else if (!/^\d+$/.test(client.dniCli)) {
      errors.dniCli = "El DNI solo puede contener números.";
    } else if (client.dniCli.length < 7 || client.dniCli.length > 9) {
      errors.dniCli = "El DNI debe tener entre 7 y 9 dígitos numéricos.";
    }

    if (!client.phoneCli?.trim()) {
      errors.phoneCli = "El teléfono es obligatorio.";
    } else if (!/^\d+$/.test(client.phoneCli)) {
      errors.phoneCli = "El teléfono solo puede contener números.";
    } else if (client.phoneCli.trim().length < 6 || client.phoneCli.trim().length > 20) {
      errors.phoneCli = "El teléfono debe tener entre 6 y 20 dígitos.";
    }

    if (!client.emailCli?.trim()) {
      errors.emailCli = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.emailCli)) {
      errors.emailCli = "Email inválido.";
    }

    if (!client.addressCli?.trim()) {
      errors.addressCli = "La dirección es obligatoria.";
    } else if (client.addressCli.trim().length < 3) {
      errors.addressCli = "La dirección debe tener al menos 3 caracteres.";
    }

    if (!cityInput.trim()) {
      errors.city = "La ciudad es obligatoria.";
    } else if (!client.idLocation) {
      errors.city = "La ciudad ingresada no existe en la base de ciudades de Argentina.";
    }

    if (!postalCode.trim()) {
      errors.postalCode = "El código postal es obligatorio.";
    } else if (!/^\d+$/.test(postalCode.trim())) {
      errors.postalCode = "El código postal solo puede contener números.";
    }

    const matchedLocation = locations.find(
      (l) => l.idLocation === client.idLocation
    );
    if (
      matchedLocation &&
      !errors.postalCode &&
      String(matchedLocation.zipCode) !== String(postalCode.trim())
    ) {
      errors.postalCode = `El código postal no coincide. Para ${matchedLocation.city} el código es ${matchedLocation.zipCode}.`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const body = {
      ...client,
      idLocation: Number(client.idLocation)
    };

    try {
      if (isMyProfile) {
        await clientService.updateMe(body);
      } else {
        await clientService.update(id, body);
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
          />
          {fieldErrors.nameCli && <span className="error-message">{fieldErrors.nameCli}</span>}
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
          />
          {fieldErrors.surnameCli && <span className="error-message">{fieldErrors.surnameCli}</span>}
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
          />
          {fieldErrors.dniCli && <span className="error-message">{fieldErrors.dniCli}</span>}
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
          />
          {fieldErrors.phoneCli && <span className="error-message">{fieldErrors.phoneCli}</span>}
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
          />
          {fieldErrors.emailCli && <span className="error-message">{fieldErrors.emailCli}</span>}
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
          />
          {fieldErrors.addressCli && <span className="error-message">{fieldErrors.addressCli}</span>}
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
          />
          {fieldErrors.city && <span className="error-message">{fieldErrors.city}</span>}

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
          />
          {fieldErrors.postalCode && <span className="error-message">{fieldErrors.postalCode}</span>}
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