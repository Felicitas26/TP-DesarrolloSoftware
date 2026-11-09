import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usuarioService, clientService, locationService } from "../../services";
import CityAutocomplete from "../../components/CityAutocomplete";
import { getIdUsuario } from "../../utils/session";
import "./usuariosList.css";

const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconEdit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const IconTrashWarning = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconRestore = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const USUARIO_RAIZ = "admin";
const USERNAME_REGEX = /^[A-Za-z0-9._@-]{3,150}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sin tildes y en minúsculas, para que el buscador no dependa de acentos.
const normalizar = (s) =>
    (s || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

function generarPasswordProvisoria() {
    // Consonantes + vocales + dígitos: legible de dictar y de tipear.
    const consonantes = "bcdfghjklmnpqrstvwxz";
    const vocales = "aeiou";
    let s = "";
    for (let i = 0; i < 3; i++) {
        s += consonantes[Math.floor(Math.random() * consonantes.length)];
        s += vocales[Math.floor(Math.random() * vocales.length)];
    }
    s += String(Math.floor(10 + Math.random() * 90));
    return s;
}

const CREDS_VACIOS = { username: "", password: "" };
const CLIENTE_VACIO = {
    nameCli: "",
    surnameCli: "",
    dniCli: "",
    emailCli: "",
    phoneCli: "",
    addressCli: ""
};
const CUITADES_VACIAS = { cityInput: "", postalCode: "" };

function UsuariosList() {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("todos");

    const miIdUsuario = Number(getIdUsuario()) || null;

    const [busqueda, setBusqueda] = useState("");

    // Desactivados / reactivación
    const [desactivados, setDesactivados] = useState([]);
    const [rowToReactivate, setRowToReactivate] = useState(null);
    const [reactivating, setReactivating] = useState(false);

    // Modal de alta/edición
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null); // null=alta | row
    const [tipo, setTipo] = useState(""); // solo en creación: "administrador" | "cliente"
    const [creds, setCreds] = useState(CREDS_VACIOS);
    const [showPassword, setShowPassword] = useState(false);
    const [clienteData, setClienteData] = useState(CLIENTE_VACIO);
    const [ciudades, setCiudades] = useState(CUITADES_VACIAS);
    const [locations, setLocations] = useState([]);
    const [saving, setSaving] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [createdCredentials, setCreatedCredentials] = useState(null);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const recargar = useCallback(async () => {
        setLoading(true);
        try {
            const [adminsData, clientsData, desactivadosData] = await Promise.all([
                usuarioService.getAdministradores(),
                clientService.getAll(),
                usuarioService.getDesactivados()
            ]);
            setAdmins(Array.isArray(adminsData) ? adminsData : []);
            setClients(Array.isArray(clientsData) ? clientsData : []);
            setDesactivados(
                Array.isArray(desactivadosData) ? desactivadosData : []
            );
        } catch (err) {
            console.error("Error al cargar los usuarios:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        recargar();
    }, [recargar]);

    // --------------------------------------------- helpers de filas

    const rows = [
        ...admins.map((a) => ({
            key: `a${a.idUsuario}`,
            tipo: "administrador",
            idUsuario: a.idUsuario,
            username: a.username,
            passwordTemporal: a.passwordTemporal,
            nombre: a.nameCli ? `${a.nameCli} ${a.surnameCli || ""}`.trim() : "—",
            rol: "administrador",
            raw: a
        })),
        // Un administrador guarda sus datos en una Client vinculada:
        // esas filas no deben listarse también como clientes.
        ...clients
            .filter((c) => c.rol !== "administrador")
            .map((c) => ({
            key: `c${c.idCli}`,
            tipo: "cliente",
            idUsuario: c.idUsuario,
            idCli: c.idCli,
            username: c.usernameLogin || "—",
            nombre: c.nameCli ? `${c.nameCli} ${c.surnameCli || ""}`.trim() : "—",
            rol: c.rol || "cliente",
            raw: c
        })),
        // Cuentas dadas de baja: solo se reactivan desde esta pantalla,
        // nunca se listan junto a las activas.
        ...desactivados.map((d) => ({
            key: `d${d.idUsuario}`,
            tipo: d.rol === "administrador" ? "administrador" : "cliente",
            idUsuario: d.idUsuario,
            username: d.username,
            nombre: d.nameCli ? `${d.nameCli} ${d.surnameCli || ""}`.trim() : "—",
            dni: d.dniCli ?? "",
            inactivo: true,
            raw: d
        }))
    ];

    const busquedaN = normalizar(busqueda);

    // "Desactivados" muestra solo las dadas de baja; las demás vistas,
    // solo las cuentas activas.
    const visibles = rows.filter((r) => {
        const porTipo =
            filtro === "desactivados"
                ? r.inactivo
                : !r.inactivo &&
                  (filtro === "todos" || r.tipo === filtro);
        if (!porTipo) return false;
        if (!busquedaN) return true;

        const porNombre = normalizar(r.nombre).includes(busquedaN);
        // Como some accounts may not yet have a name (e.g., root), the
        // username is also matched so that nothing goes "unfindable".
        const porUsuario = normalizar(r.username).includes(busquedaN);
        const porDni = normalizar(r.dni ?? r.raw?.dniCli ?? "").includes(busquedaN);
        return porNombre || porUsuario || porDni;
    });

    const contar = (t) => rows.filter((r) => r.tipo === t && !r.inactivo).length;
    const contarDesactivados = desactivados.length;

    // --------------------------------------------- abrir formularios

    const cargarLocations = async () => {
        try {
            const data = await locationService.getAll();
            setLocations(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al cargar las localidades:", err);
        }
    };

    const abrirNuevo = () => {
        setEditing(null);
        setTipo("");
        setCreds({ username: "", password: generarPasswordProvisoria() });
        setClienteData(CLIENTE_VACIO);
        setCiudades(CUITADES_VACIAS);
        setShowPassword(false);
        setFormErrors({});
        setFormOpen(true);
        cargarLocations();
    };

    const abrirEditar = (row) => {
        setEditing(row);
        setTipo(row.tipo);
        const c = row.raw;
        setCreds({ username: c.username || "", password: "" });
        setClienteData({
            nameCli: c.nameCli || "",
            surnameCli: c.surnameCli || "",
            dniCli: c.dniCli ?? "",
            emailCli: c.emailCli || "",
            phoneCli: c.phoneCli || "",
            addressCli: c.addressCli || ""
        });
        setCiudades({ cityInput: c.city || "", postalCode: c.zipCode || "" });
        setShowPassword(false);
        setFormErrors({});
        setFormOpen(true);
        cargarLocations();
    };

    const regenerarPassword = () => {
        setCreds((p) => ({ ...p, password: generarPasswordProvisoria() }));
        setShowPassword(true);
        if (formErrors.password) {
            setFormErrors((prev) => ({ ...prev, password: null }));
        }
    };

    // --------------------------------------------- validación

    const validarCreds = (requierePassword, passwordValue) => {
        const errors = {};
        const user = creds.username.trim();

        if (!user) {
            errors.username = "El nombre de usuario es obligatorio.";
        } else if (!USERNAME_REGEX.test(user)) {
            errors.username = "Entre 3 y 150 caracteres: letras, números, punto, guion, guion bajo o arroba.";
        }

        if (requierePassword) {
            if (!passwordValue) {
                errors.password = "La contraseña es obligatoria.";
            } else if (passwordValue.length < 6) {
                errors.password = "La contraseña debe tener al menos 6 caracteres.";
            } else if (passwordValue.length > 100) {
                errors.password = "La contraseña no puede superar los 100 caracteres.";
            }
        } else if (passwordValue && passwordValue.length < 6) {
            errors.password = "La nueva contraseña debe tener al menos 6 caracteres.";
        }
        return errors;
    };

    const validarCliente = () => {
        const errors = {};

        if (clienteData.nameCli.trim().length < 2) errors.nameCli = "El nombre debe tener entre 2 y 100 caracteres.";
        if (clienteData.surnameCli.trim().length < 2) errors.surnameCli = "El apellido debe tener entre 2 y 100 caracteres.";

        const dni = String(clienteData.dniCli).trim();
        if (!dni) {
            errors.dniCli = "El DNI es obligatorio.";
        } else if (!/^\d+$/.test(dni)) {
            errors.dniCli = "El DNI solo puede contener números.";
        } else if (dni.length < 7 || dni.length > 9) {
            errors.dniCli = "El DNI debe tener entre 7 y 9 dígitos numéricos.";
        }

        const email = clienteData.emailCli.trim().toLowerCase();
        if (!email) {
            errors.emailCli = "El email es obligatorio.";
        } else if (!EMAIL_REGEX.test(email)) {
            errors.emailCli = "El email no tiene un formato válido.";
        }

        const phone = String(clienteData.phoneCli).trim();
        if (!phone) {
            errors.phoneCli = "El teléfono es obligatorio.";
        } else if (!/^\d+$/.test(phone)) {
            errors.phoneCli = "El teléfono solo puede contener números.";
        } else if (phone.length < 6 || phone.length > 20) {
            errors.phoneCli = "El teléfono debe tener entre 6 y 20 dígitos.";
        }

        if (clienteData.addressCli.trim().length < 3) {
            errors.addressCli = "La dirección debe tener entre 3 y 200 caracteres.";
        }

        const loc = locations.find(
            (l) => l.city === ciudades.cityInput && String(l.zipCode) === String(ciudades.postalCode)
        );
        if (!ciudades.cityInput) {
            errors.city = "La ciudad es obligatoria.";
        } else if (!loc) {
            errors.city = "Seleccioná una ciudad de la lista.";
        }

        return { errors, loc };
    };

    // --------------------------------------------- alta / edición

    const handleSave = async (e) => {
        e.preventDefault();
        const esCreacion = editing === null;
        const tipoEfectivo = editing ? editing.tipo : tipo;

        if (esCreacion && !tipoEfectivo) {
            setFormErrors({ tipo: "Elegí el tipo de cuenta a crear." });
            return;
        }

        let errors = {};
        let loc = null;

        const credsErrors = validarCreds(esCreacion, creds.password);
        const validado = validarCliente();
        errors = { ...credsErrors, ...validado.errors };
        loc = validado.loc;

        if (Object.keys(errors).length) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});
        setSaving(true);

        try {
            const persona = {
                ...clienteData,
                dniCli: Number(String(clienteData.dniCli).trim()),
                emailCli: clienteData.emailCli.trim().toLowerCase(),
                idLocation: Number(loc.idLocation)
            };

            if (tipoEfectivo === "administrador") {
                const user = creds.username.trim();
                if (esCreacion) {
                    await usuarioService.createAdministrador({
                        username: user,
                        password: creds.password,
                        ...persona
                    });
                    setCreatedCredentials({
                        tipo: "administrador",
                        username: user,
                        password: creds.password
                    });
                } else {
                    await usuarioService.updateAdministrador(editing.idUsuario, {
                        username: user,
                        ...(creds.password ? { password: creds.password } : {}),
                        ...persona
                    });
                }
            } else if (esCreacion) {
                const email = persona.emailCli;
                const password = creds.password;
                await clientService.create({
                    ...persona,
                    username: creds.username.trim() || email,
                    password,
                    // La contraseña es provisoria: obligamos a cambiarla al iniciar sesión.
                    passwordTemporal: true
                });
                setCreatedCredentials({
                    tipo: "cliente",
                    username: creds.username.trim() || email,
                    password
                });
            } else {
                // Edición de cliente: los datos personales viajan via PUT /api/client
                await clientService.update(editing.idCli, persona);
            }

            await recargar();
            setFormOpen(false);
        } catch (error) {
            setFormErrors({ _form: error.message || "No se pudo guardar el usuario." });
        } finally {
            setSaving(false);
        }
    };

    // --------------------------------------------- baja

    const handleConfirmDelete = async () => {
        if (!rowToDelete) return;
        setDeleting(true);

        try {
            if (rowToDelete.tipo === "administrador") {
                await usuarioService.removeAdministrador(rowToDelete.idUsuario);
            } else {
                await clientService.remove(rowToDelete.idCli);
            }
            await recargar();
            setRowToDelete(null);
        } catch (error) {
            alert(error.message);
        } finally {
            setDeleting(false);
        }
    };

    const puedeEliminar = (row) =>
        row.idUsuario !== miIdUsuario && row.username !== USUARIO_RAIZ;

    const handleConfirmReactivate = async () => {
        if (!rowToReactivate) return;
        setReactivating(true);

        try {
            await usuarioService.reactivar(rowToReactivate.idUsuario);
            await recargar();
            setRowToReactivate(null);
        } catch (error) {
            alert(error.message);
        } finally {
            setReactivating(false);
        }
    };

    // --------------------------------------------- render

    const inputClass = (name) => `form-group ${formErrors[name] ? "has-error" : ""}`;

    const renderClienteSection = () => (
        <>
            <span className="section-label">
                Datos del Usuario
            </span>

            <div className="form-grid-2">
                <div className={inputClass("nameCli")}>
                    <label htmlFor="cl-name">Nombre *</label>
                    <input id="cl-name" type="text" name="nameCli" value={clienteData.nameCli}
                        onChange={(e) => setClienteData((p) => ({ ...p, nameCli: e.target.value }))}
                        placeholder="Ej: María"
                    />
                    {formErrors.nameCli && <span className="error-message">{formErrors.nameCli}</span>}
                </div>

                <div className={inputClass("surnameCli")}>
                    <label htmlFor="cl-surname">Apellido *</label>
                    <input id="cl-surname" type="text" name="surnameCli" value={clienteData.surnameCli}
                        onChange={(e) => setClienteData((p) => ({ ...p, surnameCli: e.target.value }))}
                        placeholder="Ej: Gorosito"
                    />
                    {formErrors.surnameCli && <span className="error-message">{formErrors.surnameCli}</span>}
                </div>

                <div className={inputClass("dniCli")}>
                    <label htmlFor="cl-dni">DNI *</label>
                    <input id="cl-dni" type="text" inputMode="numeric" name="dniCli" value={clienteData.dniCli}
                        onChange={(e) => setClienteData((p) => ({ ...p, dniCli: e.target.value }))}
                        placeholder="Ej: 30456789"
                        autoComplete="off"
                    />
                    {formErrors.dniCli && <span className="error-message">{formErrors.dniCli}</span>}
                </div>

                <div className={inputClass("phoneCli")}>
                    <label htmlFor="cl-phone">Teléfono *</label>
                    <input id="cl-phone" type="text" inputMode="numeric" name="phoneCli" value={clienteData.phoneCli}
                        onChange={(e) => setClienteData((p) => ({ ...p, phoneCli: e.target.value }))}
                        placeholder="Ej: 3415551234"
                        autoComplete="off"
                    />
                    {formErrors.phoneCli && <span className="error-message">{formErrors.phoneCli}</span>}
                </div>

                <div className={`form-group full-width ${formErrors.emailCli ? "has-error" : ""}`}>
                    <label htmlFor="cl-email">Email *</label>
                    <input id="cl-email" type="email" name="emailCli" value={clienteData.emailCli}
                        onChange={(e) => setClienteData((p) => ({ ...p, emailCli: e.target.value }))}
                        placeholder="Ej: maria@correo.com"
                        autoComplete="off"
                    />
                    {formErrors.emailCli && <span className="error-message">{formErrors.emailCli}</span>}
                    <span className="hint-message">Sin usuario, la cuenta de acceso queda con el email.</span>
                </div>

                <div className={`form-group full-width ${formErrors.addressCli ? "has-error" : ""}`}>
                    <label htmlFor="cl-address">Dirección *</label>
                    <input id="cl-address" type="text" name="addressCli" value={clienteData.addressCli}
                        onChange={(e) => setClienteData((p) => ({ ...p, addressCli: e.target.value }))}
                        placeholder="Ej: Av. Pellegrini 1234"
                    />
                    {formErrors.addressCli && <span className="error-message">{formErrors.addressCli}</span>}
                </div>

                <div className={`form-group full-width ${formErrors.city ? "has-error" : ""}`}>
                    <label htmlFor="cl-city">Ciudad *</label>
                    <CityAutocomplete
                        id="cl-city"
                        name="cityInput"
                        value={ciudades.cityInput}
                        locations={locations}
                        placeholder="Ej: Rosario"
                        hasError={Boolean(formErrors.city)}
                        onSelect={(loc) => setCiudades({ cityInput: loc.city, postalCode: loc.zipCode })}
                    />
                    {formErrors.city && <span className="error-message">{formErrors.city}</span>}
                </div>
            </div>
        </>
    );

    return (
        <div className="page-wrapper">
            <div className="table-list-dashboard">

                {/* Header */}
                <header className="dashboard-header-flex">
                    <div className="header-title-group">
                        <div className="header-icon">
                            <IconShield />
                        </div>
                        <div>
                            <h1>Usuarios del Sistema</h1>
                            <p>Administradores y cuentas de clientes de STYLO</p>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="btn-back-panel" onClick={() => navigate("/admin-home")}>
                            <IconArrowLeft /> Volver al Panel
                        </button>
                        <button className="btn-submit-cyan" onClick={abrirNuevo}>
                            <IconPlus /> Nuevo Usuario
                        </button>
                    </div>
                </header>

                {/* Filtros + buscador */}
                <div className="user-filter-bar">
                    <div className="user-tabs" role="tablist">
                        {[
                            ["todos", `Todos (${rows.length - desactivados.length})`],
                            ["administrador", `Administradores (${contar("administrador")})`],
                            ["cliente", `Clientes (${contar("cliente")})`],
                            ["desactivados", `Desactivados (${contarDesactivados})`]
                        ].map(([val, label]) => (
                            <button
                                key={val}
                                role="tab"
                                className={`user-tab ${filtro === val ? "active" : ""}`}
                                onClick={() => setFiltro(val)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="user-search">
                        <IconSearch />
                        <input
                            type="text"
                            name="busqueda"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por nombre, apellido o DNI…"
                            aria-label="Buscar por nombre, apellido o DNI"
                            autoComplete="off"
                        />
                        {busqueda && (
                            <button
                                type="button"
                                className="user-search-clear"
                                onClick={() => setBusqueda("")}
                                title="Limpiar búsqueda"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabla */}
                <div className="form-card full-width">
                    <div className="card-body-table">
                        {loading ? (
                            <p className="loading-text">Cargando usuarios...</p>
                        ) : (
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Cuenta de Acceso</th>
                                        <th>Persona</th>
                                        <th>Tipo de Usuario</th>
                                        <th style={{ textAlign: "center" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibles.length > 0 ? (
                                        visibles.map((row) => (
                                            <tr key={row.key}>
                                                <td className="font-semibold">{row.username}</td>
                                                <td>{row.nombre || <span className="dimmed">—</span>}</td>
                                                <td>
                                                    <span className={`rol-badge ${row.inactivo ? "rol-inactiva" : row.tipo === "cliente" ? "rol-cliente" : "rol-admin"}`}>
                                                        {row.inactivo
                                                            ? "Desactivado"
                                                            : row.tipo === "administrador" ? "Administrador" : "Cliente"}
                                                    </span>
                                                    {!row.inactivo && row.username === USUARIO_RAIZ && (
                                                        <span className="root-chip" title="Cuenta raíz: no se puede eliminar">
                                                            <IconShield /> raíz
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {row.inactivo ? (
                                                        <div className="actions-cell">
                                                            <button
                                                                type="button"
                                                                className="btn-action-restore"
                                                                onClick={() => setRowToReactivate(row)}
                                                                title="Reactivar"
                                                            >
                                                                <IconRestore />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                    <div className="actions-cell">
                                                        <button
                                                            type="button"
                                                            className="btn-action-edit"
                                                            onClick={() => abrirEditar(row)}
                                                            title="Editar"
                                                        >
                                                            <IconEdit />
                                                        </button>

                                                        {puedeEliminar(row) && (
                                                            <button
                                                                type="button"
                                                                className="btn-action-delete"
                                                                onClick={() => setRowToDelete(row)}
                                                                title="Eliminar"
                                                            >
                                                                <IconTrash />
                                                            </button>
                                                        )}
                                                    </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="empty-table">
                                                {busqueda
                                                    ? "No hay usuarios que coincidan con la búsqueda."
                                                    : "No hay usuarios que mostrar en esta vista."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal alta/edición */}
            {formOpen && (
                <div className="modal-backdrop">
                    <div className="modal-card-form">
                        <div className="modal-header-styled">
                            <h2>
                                {editing
                                    ? editing.tipo === "administrador"
                                        ? "Editar Administrador"
                                        : "Editar Cliente"
                                    : "Nuevo Usuario"}
                            </h2>
                            <button className="btn-close" onClick={() => setFormOpen(false)}>✕</button>
                        </div>

                        {editing === null && (
                            <div className="user-role-banner">
                                <IconShield />
                                <span>
                                    Completá los datos y al final elegí el <strong>tipo de cuenta</strong>:
                                    se crea con ese rol de una sola vez.
                                </span>
                            </div>
                        )}

                        <form onSubmit={handleSave} className="modal-edit-form">
                            {(editing === null || editing.tipo === "administrador") && (
                            <>
                            <span className="section-label">Datos de Acceso</span>

                            <div className="form-grid-2">
                                <div className={inputClass("username")}>
                                    <label htmlFor="username-admin">Nombre de Usuario</label>
                                    <input
                                        id="username-admin"
                                        type="text"
                                        name="username"
                                        value={creds.username}
                                        onChange={(e) => {
                                            setCreds((p) => ({ ...p, username: e.target.value }));
                                            if (formErrors.username) setFormErrors((p) => ({ ...p, username: null }));
                                        }}
                                        placeholder={editing?.tipo === "cliente" ? "Vacío: queda el email" : "Ej: admin.insumos"}
                                        autoComplete="off"
                                    />
                                    {formErrors.username && <span className="error-message">{formErrors.username}</span>}
                                </div>

                                <div className={`form-group user-password-group ${formErrors.password ? "has-error" : ""}`}>
                                    <label htmlFor="password-admin">
                                        {editing ? "Nueva Contraseña (opcional)" : "Contraseña Provisoria"}
                                    </label>
                                    <div className="user-password-wrapper">
                                        <input
                                            id="password-admin"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={creds.password}
                                            onChange={(e) => {
                                                setCreds((p) => ({ ...p, password: e.target.value }));
                                                if (formErrors.password) setFormErrors((p) => ({ ...p, password: null }));
                                            }}
                                            placeholder={editing ? "Dejar vacío para conservar la actual" : "Automática, la podés editar"}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            className="user-eye"
                                            onClick={() => setShowPassword((v) => !v)}
                                            title={showPassword ? "Ocultar" : "Mostrar"}
                                        >
                                            {showPassword ? <IconEyeOff /> : <IconEye />}
                                        </button>
                                    </div>
                                    {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                                    {!editing && (
                                        <button type="button" className="user-btn-generate" onClick={regenerarPassword}>
                                            Generar otra contraseña
                                        </button>
                                    )}
                                </div>
                            </div>
                            </>
                            )}

                            {renderClienteSection()}

                            {/* SELECTOR DE TIPO — en edición el tipo ya está fijado */}
                            {editing === null && (
                                <>
                                    <span className="section-label tipo-required">
                                        Tipo de Cuenta a Crear *
                                    </span>

                                    <div className="tipo-cards">
                                        <button
                                            type="button"
                                            className={`tipo-card ${tipo === "administrador" ? "active" : ""}`}
                                            onClick={() => {
                                                setTipo("administrador");
                                                if (formErrors.tipo) setFormErrors((p) => ({ ...p, tipo: null }));
                                            }}
                                        >
                                            <IconShield />
                                            <span className="tipo-title">Administrador</span>
                                            <span className="tipo-desc">Acceso total al panel de gestión</span>
                                        </button>

                                        <button
                                            type="button"
                                            className={`tipo-card ${tipo === "cliente" ? "active" : ""}`}
                                            onClick={() => {
                                                setTipo("cliente");
                                                if (formErrors.tipo) setFormErrors((p) => ({ ...p, tipo: null }));
                                            }}
                                        >
                                            <IconUser />
                                            <span className="tipo-title">Cliente</span>
                                            <span className="tipo-desc">Reserva salones y ve sus contratos</span>
                                        </button>
                                    </div>
                                    {formErrors.tipo && <span className="error-message">{formErrors.tipo}</span>}
                                </>
                            )}

                            {formErrors._form && (
                                <span className="error-message user-form-error">{formErrors._form}</span>
                            )}

                            <div className="modal-footer-right">
                                <button type="button" className="btn-j-link-secondary" onClick={() => setFormOpen(false)} disabled={saving}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-submit-cyan" disabled={saving}>
                                    {saving ? "Guardando..." : editing ? "Guardar Cambios" : "Crear Usuario"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Credenciales del usuario creado */}
            {createdCredentials && (
                <div className="modal-backdrop">
                    <div className="modal-card-j">
                        <div className="modal-body-j">
                            <div className={`modal-icon-circle ${createdCredentials.tipo === "cliente" ? "created-cliente" : "created"}`}>
                                {createdCredentials.tipo === "cliente" ? <IconUser /> : <IconShield />}
                            </div>

                            <div className="modal-content-j">
                                <h3 className="user-created-title">
                                    {createdCredentials.tipo === "administrador" ? "Administrador creado" : "Cliente creado"}
                                </h3>
                                <p className="modal-text-j">
                                    Pasale estos datos de acceso. Su contraseña es provisoria:
                                    el sistema le pedirá definirla propia al iniciar sesión.
                                </p>
                                <div className="user-credentials-box">
                                    <div className="user-credential-row">
                                        <span>Usuario</span>
                                        <strong>{createdCredentials.username}</strong>
                                    </div>
                                    <div className="user-credential-row">
                                        <span>Rol</span>
                                        <strong className={`rol-badge ${createdCredentials.tipo === "cliente" ? "rol-cliente" : "rol-admin"}`}>
                                            {createdCredentials.tipo === "administrador" ? "Administrador" : "Cliente"}
                                        </strong>
                                    </div>
                                    <div className="user-credential-row">
                                        <span>Contraseña</span>
                                        <strong>{createdCredentials.password}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer-right user-full">
                                <button className="btn-j-primary" onClick={() => setCreatedCredentials(null)}>
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmación de reactivación */}
            {rowToReactivate && (
                <div className="modal-backdrop">
                    <div className="modal-card-j">
                        <div className="modal-body-j">
                            <div className="modal-icon-circle created">
                                <IconRestore />
                            </div>

                            <div className="modal-content-j">
                                <p className="modal-text-j">
                                    ¿Está seguro de que desea reactivar la cuenta de{" "}
                                    <strong>
                                        {rowToReactivate.nombre !== "—"
                                            ? rowToReactivate.nombre
                                            : rowToReactivate.username}
                                    </strong>
                                    ? Volverá a tener acceso al sistema con los mismos datos de antes.
                                </p>

                                <button
                                    type="button"
                                    className="btn-j-cyan"
                                    onClick={handleConfirmReactivate}
                                    disabled={reactivating}
                                >
                                    {reactivating ? "Reactivando..." : "Sí, reactivar"}
                                </button>

                                <button
                                    type="button"
                                    className="btn-j-link-secondary"
                                    onClick={() => setRowToReactivate(null)}
                                    disabled={reactivating}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmación de eliminación */}
            {rowToDelete && (
                <div className="modal-backdrop">
                    <div className="modal-card-j">
                        <div className="modal-body-j">
                            <div className="modal-icon-circle danger">
                                <IconTrashWarning />
                            </div>

                            <div className="modal-content-j">
                                <p className="modal-text-j">
                                    ¿Está seguro de que desea eliminar
                                    {rowToDelete.tipo === "administrador"
                                        ? <> la cuenta de <strong> {rowToDelete.nombre !== "—" ? rowToDelete.nombre : rowToDelete.username} </strong>? Perderá todo acceso al sistema como administrador.</>
                                        : <> la cuenta de <strong> {rowToDelete.nombre} </strong>? Ya no podrá iniciar sesión ni acceder a sus reservas.</>}
                                </p>

                                <button
                                    type="button"
                                    className="btn-j-danger"
                                    onClick={handleConfirmDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? "Eliminando..." : "Estoy seguro, dar de baja"}
                                </button>

                                <button
                                    type="button"
                                    className="btn-j-link-secondary"
                                    onClick={() => setRowToDelete(null)}
                                    disabled={deleting}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsuariosList;
