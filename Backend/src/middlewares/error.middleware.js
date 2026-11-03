export function notFound(req, res, next) {
    const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
}

const PRISMA_ERRORS = {
    P1001: { statusCode: 503, message: "El servicio de base de datos no está disponible. Intentá de nuevo en unos segundos." },
    P2002: {
        statusCode: 409,
        message: (err) => {
            const fields = err.meta?.target?.join(", ") || "el campo";
            return `El valor ingresado ya existe en el sistema (${fields}).`
        }
    },
    P2003: {
        statusCode: 409,
        message: (err) => {
            const field = err.meta?.constraint?.[0] || "un campo";
            return `No se puede completar la operación porque hay datos relacionados en ${field}. Verificá que no queden registros asociados.`
        }
    },
    P2025: { statusCode: 404, message: "El registro solicitado no existe o ya fue eliminado." }
};


export function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || "Error en la solicitud.";

    const known = PRISMA_ERRORS[err.code];
    if (known) {
        statusCode = known.statusCode;
        message = typeof known.message === "function" ? known.message(err) : known.message;
    }

    if (statusCode >= 500) {
        console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);
        message = "Error interno del servidor.";
    }

    res.status(statusCode).json({ error: message });
}
