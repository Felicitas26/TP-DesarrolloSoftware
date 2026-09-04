import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editCardDetail.css";

const IconMenu = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
    </svg>
);

const IconArrowLeft = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const IconTrash = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

function EditCardDetail() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        menuStage: "",
        detail: "",
        budget: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchCardDetail = async () => {

        try {

            const response = await fetch(
                `http://localhost:3000/api/cardDetail/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("sty_token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "No se pudo cargar el menú."
                );
            }

            setForm({
                menuStage: data.menuStage || "",
                detail: data.detail || "",
                budget: data.budget || ""
            });

        } catch (error) {

            alert(error.message);
            navigate("/cardDetail");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchCardDetail();
    }, [id]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);

        try {

            const response = await fetch(
                `http://localhost:3000/api/cardDetail/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("sty_token")}`
                    },
                    body: JSON.stringify({
                        menuStage: form.menuStage,
                        detail: form.detail,
                        budget: Number(form.budget)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "No se pudo actualizar el menú."
                );
            }

            alert("Menú actualizado correctamente.");

            navigate("/cardDetail");

        } catch (error) {

            alert(error.message);

        } finally {

            setSaving(false);

        }
    };

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            "¿Está seguro de que desea eliminar este menú?"
        );

        if (!confirmDelete) {
            return;
        }

        setDeleting(true);

        try {

            const response = await fetch(
                `http://localhost:3000/api/cardDetail/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("sty_token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "No se pudo eliminar el menú."
                );
            }

            alert("Menú eliminado correctamente.");

            navigate("/cardDetail");

        } catch (error) {

            alert(error.message);

        } finally {

            setDeleting(false);

        }
    };

    if (loading) {

        return (
            <div className="page-wrapper">

                <div className="client-dashboard">

                    <p className="loading-text">
                        Cargando menú...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="page-wrapper">

            <div className="client-dashboard">

                <header className="dashboard-header-flex">

                    <div className="header-title-group">

                        <div className="header-icon">
                            <IconMenu />
                        </div>

                        <div>
                            <h1>Editar Menú</h1>
                            <p>
                                Modificá los datos del menú seleccionado
                            </p>
                        </div>

                    </div>

                    <button
                        className="btn-back-panel"
                        onClick={() => navigate("/cardDetail")}
                    >
                        <IconArrowLeft />
                        Volver a Menúes
                    </button>

                </header>

                <div className="form-card">

                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="form-grid-2">

                                <div className="form-group">

                                    <label>Nombre del Menú</label>

                                    <input
                                        type="text"
                                        name="menuStage"
                                        value={form.menuStage}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>Presupuesto</label>

                                    <input
                                        type="number"
                                        name="budget"
                                        value={form.budget}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>Detalle</label>

                                    <textarea
                                        name="detail"
                                        value={form.detail}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                            <div className="modal-footer-right">

                                <button
                                    type="button"
                                    className="btn-j-link-secondary"
                                    onClick={() => navigate("/cardDetail")}
                                    disabled={saving || deleting}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="button"
                                    className="btn-j-danger"
                                    onClick={handleDelete}
                                    disabled={saving || deleting}
                                >
                                    <IconTrash />
                                    {deleting
                                        ? "Eliminando..."
                                        : "Eliminar Menú"}
                                </button>

                                <button
                                    type="submit"
                                    className="btn-submit-cyan"
                                    disabled={saving || deleting}
                                >
                                    {saving
                                        ? "Guardando..."
                                        : "Guardar Cambios"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default EditCardDetail;