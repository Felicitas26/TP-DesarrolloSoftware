export function notFound(req, res, next) {
    const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || err.status || 500;

    if (statusCode >= 500) {
        console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);
    }

    const message =
        statusCode >= 500
            ? "Error interno del servidor."
            : err.message || "Error en la solicitud.";

    res.status(statusCode).json({ error: message });
}
