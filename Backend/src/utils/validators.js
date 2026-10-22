import { httpError } from "./httpError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIGITS_REGEX = /^\d+$/;
const USERNAME_REGEX = /^[A-Za-z0-9._@-]{3,150}$/;

export const PASSWORD_MIN_LENGTH = 6;
export const DNI_MIN_LENGTH = 7;
export const DNI_MAX_LENGTH = 9;
export const PHONE_MIN_LENGTH = 6;
export const PHONE_MAX_LENGTH = 20;

export function isBlank(value) {
    return (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
    );
}

export function requireFields(data, fields) {
    for (const field of fields) {
        if (isBlank(data[field])) {
            throw httpError(400, "Todos los campos son obligatorios.");
        }
    }
}

export function validateEmail(email, { required = true } = {}) {
    if (isBlank(email)) {
        if (required) throw httpError(400, "El email es obligatorio.");
        return null;
    }

    const normalized = String(email).trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalized)) {
        throw httpError(400, "El email ingresado no es válido.");
    }

    return normalized;
}

export function validateDni(dni, { required = true } = {}) {
    if (isBlank(dni)) {
        if (required) throw httpError(400, "El DNI es obligatorio.");
        return null;
    }

    const value = String(dni).trim();

    if (!DIGITS_REGEX.test(value)) {
        throw httpError(400, "El DNI solo puede contener números.");
    }

    if (value.length < DNI_MIN_LENGTH || value.length > DNI_MAX_LENGTH) {
        throw httpError(
            400,
            `El DNI debe tener entre ${DNI_MIN_LENGTH} y ${DNI_MAX_LENGTH} dígitos numéricos.`
        );
    }

    return Number(value);
}

export function validatePhone(phone, { required = true } = {}) {
    if (isBlank(phone)) {
        if (required) throw httpError(400, "El teléfono es obligatorio.");
        return null;
    }

    const value = String(phone).trim();

    if (!DIGITS_REGEX.test(value)) {
        throw httpError(400, "El teléfono solo puede contener números.");
    }

    if (value.length < PHONE_MIN_LENGTH || value.length > PHONE_MAX_LENGTH) {
        throw httpError(
            400,
            `El teléfono debe tener entre ${PHONE_MIN_LENGTH} y ${PHONE_MAX_LENGTH} dígitos.`
        );
    }

    return value;
}

export function validateName(value, label, { required = true } = {}) {
    if (isBlank(value)) {
        if (required) throw httpError(400, `El ${label} es obligatorio.`);
        return null;
    }

    const trimmed = String(value).trim();

    if (trimmed.length < 2 || trimmed.length > 100) {
        throw httpError(
            400,
            `El ${label} debe tener entre 2 y 100 caracteres.`
        );
    }

    return trimmed;
}

export function validateAddress(address, { required = true } = {}) {
    if (isBlank(address)) {
        if (required) throw httpError(400, "La dirección es obligatoria.");
        return null;
    }

    const trimmed = String(address).trim();

    if (trimmed.length < 3 || trimmed.length > 200) {
        throw httpError(400, "La dirección debe tener entre 3 y 200 caracteres.");
    }

    return trimmed;
}

export function validatePassword(password, { required = true } = {}) {
    if (isBlank(password)) {
        if (required) throw httpError(400, "La contraseña es obligatoria.");
        return null;
    }

    const value = String(password);

    if (value.length < PASSWORD_MIN_LENGTH) {
        throw httpError(
            400,
            `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`
        );
    }

    if (value.length > 100) {
        throw httpError(400, "La contraseña no puede superar los 100 caracteres.");
    }

    return value;
}

export function validateUsername(username, { required = true } = {}) {
    if (isBlank(username)) {
        if (required) throw httpError(400, "El nombre de usuario es obligatorio.");
        return null;
    }

    const trimmed = String(username).trim();

    if (!USERNAME_REGEX.test(trimmed)) {
        throw httpError(
            400,
            "El nombre de usuario debe tener entre 3 y 150 caracteres y solo puede contener letras, números, punto, guion, guion bajo o arroba."
        );
    }

    return trimmed;
}

export function validateId(value, label = "identificador") {
    if (isBlank(value)) {
        throw httpError(400, `El ${label} es obligatorio.`);
    }

    const num = Number(value);

    if (!Number.isInteger(num) || num <= 0) {
        throw httpError(400, `El ${label} no es válido.`);
    }

    return num;
}
