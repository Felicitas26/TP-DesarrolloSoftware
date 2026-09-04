import { useEffect, useState } from "react";
import "./LoungesSection.css";

function LoungesSection() {
    const [lounges, setLounges] = useState([]);
    const [loungeTypes, setLoungeTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [loungesResponse, typesResponse, locationsResponse] =
                    await Promise.all([
                        fetch("http://localhost:3000/api/lounge"),
                        fetch("http://localhost:3000/api/loungeType"),
                        fetch("http://localhost:3000/api/locations")
                    ]);

                const loungesData = await loungesResponse.json();
                const typesData = await typesResponse.json();
                const locationsData = await locationsResponse.json();

                setLounges(loungesData);
                setLoungeTypes(typesData);
                setLocations(locationsData);
            } catch (error) {
                console.error("Error al cargar los salones:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getLocationName = (idLocation) => {
        const location = locations.find(
            (loc) =>
                String(loc.idLocation || loc.id) === String(idLocation)
        );

        return location ? location.city : "No asignada";
    };

    const getLoungeType = (idLounge) => {
        return loungeTypes.find(
            (type) => String(type.idLounge) === String(idLounge)
        );
    };

    if (loading) {
        return (
            <section id="salones" className="lounges-section">
                <h2>SALONES</h2>
                <p className="lounges-loading">Cargando salones...</p>
            </section>
        );
    }

    return (
        <section id="salones" className="lounges-section">
            <div className="lounges-header">
                <span className="lounges-eyebrow">NUESTROS ESPACIOS</span>
                <h2>SALONES</h2>
                <p>
                    Elegí el espacio ideal para celebrar tus momentos
                    especiales.
                </p>
            </div>

            <div className="lounges-grid">
                {lounges.map((lounge) => {
                    const loungeType = getLoungeType(lounge.idLounge);

                    return (
                        <article
                            className="lounge-card"
                            key={lounge.idLounge}
                        >
                            <div className="lounge-card-content">
                                <span className="lounge-number">
                                    0{lounge.idLounge}
                                </span>

                                <h3>{lounge.name}</h3>

                                <div className="lounge-info">
                                    <p>{lounge.loungeAddress}</p>
                                    <p>
                                        {getLocationName(lounge.idLocation)}
                                    </p>
                                </div>

                                {loungeType && (
                                    <div className="lounge-capacity">
                                        <span>CAPACIDAD</span>
                                        <strong>
                                            {loungeType.minQuantity} —{" "}
                                            {loungeType.maxQuantity}
                                        </strong>
                                        <span>PERSONAS</span>
                                    </div>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default LoungesSection;