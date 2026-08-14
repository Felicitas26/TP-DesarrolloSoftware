import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Location = sequelize.define("Location", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    locality: {
        type: DataTypes.STRING,
        allowNull: false
    },

    zipCode: {
        type: DataTypes.STRING,
        allowNull: false
    }

});

export default Location;
