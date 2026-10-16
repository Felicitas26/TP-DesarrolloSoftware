import { useEffect, useState } from "react";
import { loungeService, loungeTypeService, locationService } from "../../../services";
import LoungeCard from "./LoungeCard";
import "./LoungesSection.css";

function LoungesSection() {
    const [lounges, setLounges] = useState([]);
    const [loungeTypes, setLoungeTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [loungesData, typesData, locationsData] =
                    await Promise.all([
                        loungeService.getAll(),
                        loungeTypeService.getAll(),
                        locationService.getAll()
                    ]);

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
                {lounges.map((lounge) => (
                    <LoungeCard
                        key={lounge.idLounge}
                        lounge={lounge}
                        locationName={getLocationName(lounge.idLocation)}
                        loungeType={getLoungeType(lounge.idLounge)}
                    />
                ))}
            </div>
        </section>
    );
}

export default LoungesSection;