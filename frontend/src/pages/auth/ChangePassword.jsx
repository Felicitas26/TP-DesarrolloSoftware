import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    passwordActual: "",
    passwordNueva: "",
    confirmar: ""
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.passwordActual || !form.passwordNueva) {
      setError("Completá la contraseña actual y la nueva.");
      return;
    }

    if (form.passwordNueva.length < 6) {
      setError("La contraseña nueva debe tener al menos 6 caracteres.");
      return;
    }

    if (form.passwordNueva !== form.confirmar) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    const token = localStorage.getItem("sty_token");
    if (!token) {
      setError("No estás autenticado. Volvé a iniciar sesión.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/usuario/cambiar-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          passwordActual: form.passwordActual,
          passwordNueva: form.passwordNueva
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo cambiar la contraseña.");
      }

      localStorage.setItem("sty_password_temporal", "0");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="changepass-page">
      <div className="changepass-card">
        <div className="changepass-logo">STYLO</div>
        <h1 className="changepass-title">Cambiar Contraseña</h1>
        <p className="changepass-subtitle">
          Tu contraseña es provisoria. Definí una nueva para tu cuenta.
        </p>

        {error && <div className="changepass-error">{error}</div>}

        {success ? (
          <div className="changepass-success">
            <p>¡Contraseña actualizada con éxito!</p>
            <button
              type="button"
              className="changepass-btn-primary"
              onClick={() => navigate("/client")}
            >
              Continuar
            </button>
          </div>
        ) : (
          <form className="changepass-form" onSubmit={handleSubmit} noValidate>
            <div className="changepass-field">
              <span className="changepass-icon"><IconLock /></span>
              <input
                type={show ? "text" : "password"}
                name="passwordActual"
                placeholder="Contraseña actual (provisoria)"
                value={form.passwordActual}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <div className="changepass-field">
              <span className="changepass-icon"><IconLock /></span>
              <input
                type={show ? "text" : "password"}
                name="passwordNueva"
                placeholder="Nueva contraseña"
                value={form.passwordNueva}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="changepass-eye"
                onClick={() => setShow((prev) => !prev)}
                aria-label={show ? "Ocultar" : "Mostrar"}
              >
                {show ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>

            <div className="changepass-field">
              <span className="changepass-icon"><IconLock /></span>
              <input
                type={show ? "text" : "password"}
                name="confirmar"
                placeholder="Confirmar nueva contraseña"
                value={form.confirmar}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="changepass-btn-primary" disabled={submitting}>
              {submitting ? "Guardando..." : "Cambiar Contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChangePassword;
