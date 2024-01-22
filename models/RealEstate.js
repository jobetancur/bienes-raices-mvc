import { Sequelize } from "sequelize";
import db from "../config/db.js";

const RealEstate = db.define('realestates', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    rooms: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    parking: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    wc: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    street: {
        type: Sequelize.STRING(60),
        allowNull: false,
    },
    lat: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lng: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    public: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});

export default RealEstate;