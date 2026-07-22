import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Ubicacion = sequelize.define("Ubicacion", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    localidad: {
        type: DataTypes.STRING,
        allowNull: false
    },

    codigoPostal: {
        type: DataTypes.STRING,
        allowNull: false
    }

});

export default Ubicacion;
