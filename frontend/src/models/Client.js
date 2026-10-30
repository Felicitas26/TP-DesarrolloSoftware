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
    constructor(data = {}) {
        Object.assign(this, data);
    }


    static from(json) {
        return new Client(json);
    }

    get fullName() {
        return [this.nameCli, this.lastNameCli].filter(Boolean).join(" ");
    }

    get isAdmin() {
        return this.rol === "administrador";
    }
}
