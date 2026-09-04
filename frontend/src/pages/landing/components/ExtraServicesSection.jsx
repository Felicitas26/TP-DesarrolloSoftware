import { useEffect, useState } from "react";
import "./ExtraServicesSection.css";

function ExtraServicesSection() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/extraservice"
                );

                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error(
                    "Error al cargar los servicios extra:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    if (loading) {
        return (
            <section
                id="servicios-extra"
                className="extra-services-section"
            >
                <h2>SERVICIOS EXTRA</h2>
                <p className="extra-services-loading">
                    Cargando servicios...
                </p>
            </section>
        );
    }

    return (
        <section
            id="servicios-extra"
            className="extra-services-section"
        >
            <div className="extra-services-header">
                <span className="extra-services-eyebrow">
                    PERSONALIZÁ TU EVENTO
                </span>

                <h2>SERVICIOS EXTRA</h2>

                <p>
                    Sumá servicios adicionales para hacer de tu
                    celebración una experiencia única.
                </p>
            </div>

            <div className="extra-services-grid">
                {services.map((service) => (
                    <article
                        className="extra-service-card"
                        key={service.idService}
                    >
                        <span className="extra-service-number">
                            0{service.idService}
                        </span>

                        <h3>{service.nameService}</h3>

                        <p className="extra-service-detail">
                            {service.detailService}
                        </p>

                        <div className="extra-service-price">
                            <span>DESDE</span>

                            <strong>
                                $
                                {Number(service.cost).toLocaleString(
                                    "es-AR"
                                )}
                            </strong>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ExtraServicesSection;