import "./LoungesSection.css";

/**
 * Tarjeta presentacional de un salón.
 * Input properties: `lounge`, `locationName` y `loungeType` (datos que recibe
 * del componente contenedor).
 *
 * @param {Object} props
 * @param {import("../../../models").Lounge} props.lounge
 * @param {string} props.locationName
 * @param {import("../../../models").LoungeType|null} [props.loungeType]
 */
function LoungeCard({ lounge, locationName, loungeType }) {
    return (
        <article className="lounge-card">
            <div className="lounge-card-content">
                <span className="lounge-number">
                    0{lounge.idLounge}
                </span>

                <h3>{lounge.name}</h3>

                <div className="lounge-info">
                    <p>{lounge.loungeAddress}</p>
                    <p>{locationName}</p>
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
}

export default LoungeCard;
