/**
 * Envuelve un handler async de Express para que cualquier error (throw o
 * promesa rechazada) se derive al middleware centralizado de errores.
 * @param {Function} handler
 * @returns {Function}
 */
export function asyncHandler(handler) {
    return (req, res, next) =>
        Promise.resolve(handler(req, res, next)).catch(next);
}

export default asyncHandler;
