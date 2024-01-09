import { Sequelize } from "sequelize";
import db from "../config/db.js";

const Prices = db.define('prices', {
    price: {
        type: Sequelize.STRING(60),
        allowNull: false,
    }
});

export default Prices;