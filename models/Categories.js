import { Sequelize } from "sequelize";
import db from "../config/db.js";

const Categories = db.define('categories', {
    name: {
        type: Sequelize.STRING(60),
        allowNull: false,
    }
});

export default Categories;