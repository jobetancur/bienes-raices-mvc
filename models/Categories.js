import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Categories = db.define('categories', {
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
});

export default Categories;