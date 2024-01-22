import { DataTypes } from "sequelize";
import db from "../config/db.js";

const RealEstate = db.define('realestates', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    parking: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    wc: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    street: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    lat: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lng: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    public: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});

export default RealEstate;