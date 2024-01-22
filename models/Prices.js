import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Prices = db.define('prices', {
    price: {
        type: DataTypes.STRING(30),
        allowNull: false,
    }
});

export default Prices;