import "./FeedbackModal.css";

function FeedbackModal({
    type = "info",
    title,
    message,
    onClose,
    confirmLabel = "Cerrar",
    onConfirm,
    cancelLabel,
    onCancel
}) {

    return (
        <div
            className="feedback-modal-backdrop"
            onClick={onCancel || onClose}
        >
            <div
                className={`feedback-modal ${type}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="feedback-modal-close"
                    onClick={onCancel || onClose}
                >
                    ✕
                </button>

                {type !== "confirm" && (
                    <div className="feedback-modal-icon">
                        {type === "success" ? "✓" : type === "error" ? "!" : "i"}
                    </div>
                )}

                {title && (
                    <h3>
                        {title}
                    </h3>
                )}

                <p>
                    {message}
                </p>

                <div className="feedback-modal-actions">
                    {type === "confirm" && onCancel && (
                        <button
                            type="button"
                            className="secondary"
                            onClick={onCancel}
                        >
                            {cancelLabel || "Cancelar"}
                        </button>
                    )}
                    <button
                        type="button"
                        className={type === "confirm" ? "confirm" : type}
                        onClick={onConfirm || onClose}
                    >
                        {confirmLabel}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default FeedbackModal;
