/**
 * @typedef {Object} ClientData
 * @property {number} idCli
 * @property {string} nameCli
 * @property {string} lastNameCli
 * @property {string} emailCli
 * @property {string} [phoneCli]
 * @property {string} [dniCli]
 * @property {"cliente"|"administrador"} [rol]
 */

export class Client {
    /** @param {Partial<ClientData>} [data] */
    constructor(data = {}) {
        Object.assign(this, data);
    }

    /**
     * Convierte la respuesta cruda del endpoint en una instancia de Client.
     * @param {ClientData} json
     * @returns {Client}
     */
    static from(json) {
        return new Client(json);
    }

    /** @returns {string} Nombre completo */
    get fullName() {
        return [this.nameCli, this.lastNameCli].filter(Boolean).join(" ");
    }

    /** @returns {boolean} */
    get isAdmin() {
        return this.rol === "administrador";
    }
}
