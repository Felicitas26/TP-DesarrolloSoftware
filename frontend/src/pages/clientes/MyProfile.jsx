import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyProfile.css";

function MyProfile() {

    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const getProfile = async () => {

            const token = localStorage.getItem("sty_token");

            try {

                const response = await fetch(
                    "http://localhost:3000/api/client/me",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "No se pudo obtener el perfil."
                    );
                }

                setClient(data);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getProfile();

    }, []);

    if (loading) {
        return (
            <div className="my-profile-container">
                <p className="my-profile-message">
                    Cargando perfil...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-profile-container">
                <p className="my-profile-message">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="my-profile-container">

            <div className="my-profile-background">
                <div className="my-profile-glow my-profile-glow-purple" />
                <div className="my-profile-glow my-profile-glow-cyan" />
                <div className="my-profile-grid-overlay" />
            </div>

            <div className="my-profile-overlay" />

            <header className="my-profile-bar">

                <div className="my-profile-logo">
                    SALON STYLO
                </div>

                <button
                    className="my-profile-back-button"
                    onClick={() => navigate("/client-home")}
                >
                    Volver al menú
                </button>

            </header>

            <main className="my-profile-content">

                <div className="my-profile-title">

                    <h1>
                        Mi perfil
                    </h1>

                    <p>
                        Información de tu cuenta
                    </p>

                </div>

                {client && (
                    <div className="my-profile-card">

                        <div className="my-profile-field">
                            <span>Nombre</span>
                            <p>{client.nameCli}</p>
                        </div>

                        <div className="my-profile-field">
                            <span>Apellido</span>
                            <p>{client.surnameCli}</p>
                        </div>

                        <div className="my-profile-field">
                            <span>DNI</span>
                            <p>{client.dniCli}</p>
                        </div>

                        <div className="my-profile-field">
                            <span>Teléfono</span>
                            <p>{client.phoneCli}</p>
                        </div>

                        <div className="my-profile-field">
                            <span>Email</span>
                            <p>{client.emailCli}</p>
                        </div>

                        <div className="my-profile-field">
                            <span>Dirección</span>
                            <p>{client.addressCli}</p>
                        </div>

                        <div className="my-profile-field">
                            <span>Ciudad</span>
                            <p>{client.location?.city}</p>
                        </div>

                        <div className="my-profile-field">
                            <span>Código Postal</span>
                            <p>{client.location?.zipCode}</p>
                        </div>

                        <div className="my-profile-buttons">

                            <button
                                className="my-profile-edit-button"
                                onClick={() =>
                                    navigate("/client/edit/me")
                                }
                            >
                                Editar perfil
                            </button>

                        </div>

                    </div>
                )}

            </main>

            <footer className="my-profile-footer">

                <span>
                    © {new Date().getFullYear()} STYLO. Todos los derechos reservados.
                </span>

            </footer>

        </div>
    );
}

export default MyProfile;