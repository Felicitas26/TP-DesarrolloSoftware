import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./newCardDetail.css";

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

function NewCardDetail() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        menuStage: "",
        detail: "",
        budget: ""
    });

    const [saving, setSaving] = useState(false);

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
                "http://localhost:3000/api/cardDetail",
                {
                    method: "POST",
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
                    data.error || "No se pudo crear el menú."
                );
            }

            navigate("/cardDetail");

        } catch (error) {

            alert(error.message);

        } finally {

            setSaving(false);

        }
    };

    return (
        <div className="page-wrapper">

            <div className="client-dashboard">

                <header className="dashboard-header-flex">

                    <div className="header-title-group">

                        <div className="header-icon">
                            <IconMenu />
                        </div>

                        <div>
                            <h1>Nuevo Menú</h1>
                            <p>
                                Agregá un nuevo menú para los eventos de STYLO
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
                                        placeholder="Ej: Menú de hamburguesas"
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
                                        placeholder="Ej: 15000"
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
                                        placeholder="Descripción del menú..."
                                        required
                                    />

                                </div>

                            </div>

                            <div className="modal-footer-right">

                                <button
                                    type="button"
                                    className="btn-j-link-secondary"
                                    onClick={() => navigate("/cardDetail")}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn-submit-cyan"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Guardando..."
                                        : "Crear Menú"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default NewCardDetail;