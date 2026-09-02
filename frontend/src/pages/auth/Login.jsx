import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
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

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.username.trim() || !form.password) {
      setError("Por favor, completá usuario y contraseña.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Credenciales incorrectas.");
      }

      if (data.token) {
        localStorage.setItem("sty_token", data.token);
        localStorage.setItem("sty_rol", data.rol || "");
        localStorage.setItem("sty_idUsuario", data.idUsuario || "");
      }

      if (data.passwordTemporal) {
        navigate("/cambiar-password");
      } else {
        navigate("/client");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-card">
        <div className="login-logo">STYLO</div>
        <h1 className="login-title">Iniciar Sesión</h1>
        <p className="login-subtitle">Panel de Administración STYLO</p>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <span className="login-input-icon">
              <IconUser />
            </span>
            <input
              type="text"
              name="username"
              placeholder="Ingresar Usuario"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <span className="login-input-icon">
              <IconLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Ingresar Contraseña"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-eye"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>

          <div className="login-buttons">
            <button type="submit" className="login-btn-primary" disabled={submitting}>
              {submitting ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </div>

          <div className="login-links">
            <a href="#olvido" className="login-link-left">Olvido su contraseña?</a>
            <span
              className="login-link-right"
              role="button"
              tabIndex="0"
              onClick={() => navigate("/client/new", { state: { origin: "login" } })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate("/client/new", { state: { origin: "login" } });
              }}
            >
              ¿No tiene cuenta?
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
