/**
 * Crea un error con código HTTP para que el middleware centralizado
 * (@see middlewares/error.middleware.js) lo informe de forma adecuada.
 * @param {number} statusCode
 * @param {string} message
 * @returns {Error}
 */
export function httpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

export default httpError;
