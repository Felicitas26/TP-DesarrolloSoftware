import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.css";

const NOTIFICATION_LABEL = {
    modificacion_solicitada: "Solicitud de modificación",
    modificacion_aprobada: "Modificación aprobada",
    modificacion_rechazada: "Modificación rechazada",
    contrato_revisado: "Revisión de contrato",
    contrato_firmado: "Contrato firmado",
    modificacion_descartada: "Modificación descartada",
    contrato_cancelado: "Evento cancelado",
    reserva_cancelada: "Reserva cancelada"
};

const IconBell = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const IconLogout = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

function NotificationBell() {
    const navigate = useNavigate();
    const token = localStorage.getItem("sty_token");

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const ref = useRef(null);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/api/notificacion",
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            const data = await response.json();
            if (response.ok) {
                setNotifications(data.notifications || []);
                setUnread(data.unread || 0);
            }
        } catch {
            // silencioso
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openBell = async () => {
        if (!open) {
            setOpen(true);
            setLoading(true);
            try {
                const response = await fetch(
                    "http://localhost:3000/api/notificacion",
                    { headers: { "Authorization": `Bearer ${token}` } }
                );
                const data = await response.json();
                if (response.ok) {
                    setNotifications(data.notifications || []);
                    setUnread(data.unread || 0);
                }
            } catch {
                setNotifications([]);
            } finally {
                setLoading(false);
            }
            const mark = await fetch(
                "http://localhost:3000/api/notificacion/marcar-todas",
                {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${token}` }
                }
            );
            if (mark.ok) setUnread(0);
        } else {
            setOpen(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const goTo = (idContract) => {
        setOpen(false);
        if (idContract) {
            navigate(`/contract/${idContract}`);
        }
    };

    return (
        <div className="bell-wrapper" ref={ref}>
            <button
                type="button"
                className="bell-button"
                onClick={openBell}
                aria-label="Notificaciones"
            >
                <IconBell />
                {unread > 0 && (
                    <span className="bell-badge">{unread > 99 ? "99+" : unread}</span>
                )}
            </button>

            {open && (
                <div className="bell-dropdown">
                    <div className="bell-dropdown-header">
                        <h3>Notificaciones</h3>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="bell-close"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="bell-list">
                        {loading ? (
                            <p className="bell-empty">Cargando...</p>
                        ) : notifications.length === 0 ? (
                            <p className="bell-empty">No tenés notificaciones.</p>
                        ) : (
                            notifications.map((n) => (
                                <button
                                    type="button"
                                    key={n.idNotificacion}
                                    className={`bell-item ${n.leida ? "read" : "unread"}`}
                                    onClick={() => goTo(n.idContract)}
                                >
                                    <span className="bell-item-tag">
                                        {NOTIFICATION_LABEL[n.tipo] || "Notificación"}
                                    </span>
                                    <span className="bell-item-text">{n.mensaje}</span>
                                    <span className="bell-item-date">{formatDate(n.fecha)}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;