import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

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

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

function ForgotPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    passwordNueva: "",
    confirmar: ""
  });
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
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

    if (!form.email.trim()) {
      setError("Ingresá tu email para continuar.");
      return;
    }

    if (!form.passwordNueva) {
      setError("Ingresá la contraseña nueva.");
      return;
    }

    if (form.passwordNueva.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (form.passwordNueva !== form.confirmar) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          passwordNueva: form.passwordNueva
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo restablecer la contraseña.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="forgot-page">
      <button type="button" className="forgot-back" onClick={() => navigate("/login")}>
        <IconArrowLeft /> Volver
      </button>
      <div className="forgot-card">
        <div className="forgot-logo">STYLO</div>

        {success ? (
          <div className="forgot-success">
            <p>¡Contraseña restablecida con éxito!</p>
            <button
              type="button"
              className="forgot-btn-primary"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </button>
          </div>
        ) : (
          <>
            <h1 className="forgot-title">Olvidé mi Contraseña</h1>
            <p className="forgot-subtitle">
              Ingresá tu email y definí una nueva contraseña.
            </p>

            {error && <div className="forgot-error">{error}</div>}

            <form className="forgot-form" onSubmit={handleSubmit} noValidate>
              <div className="forgot-field">
                <span className="forgot-icon"><IconMail /></span>
                <input
                  type="email"
                  name="email"
                  placeholder="Ingresar Email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="forgot-field">
                <span className="forgot-icon"><IconLock /></span>
                <input
                  type={showNueva ? "text" : "password"}
                  name="passwordNueva"
                  placeholder="Nueva contraseña"
                  value={form.passwordNueva}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="forgot-eye"
                  onClick={() => setShowNueva((prev) => !prev)}
                  aria-label={showNueva ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showNueva ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>

              <div className="forgot-field">
                <span className="forgot-icon"><IconLock /></span>
                <input
                  type={showConfirmar ? "text" : "password"}
                  name="confirmar"
                  placeholder="Confirmar nueva contraseña"
                  value={form.confirmar}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="forgot-eye"
                  onClick={() => setShowConfirmar((prev) => !prev)}
                  aria-label={showConfirmar ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmar ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>

              <button type="submit" className="forgot-btn-primary" disabled={submitting}>
                {submitting ? "Guardando..." : "Restablecer Contraseña"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;