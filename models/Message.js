import { DataTypes } from 'sequelize';
import db from "../config/db.js";

const Message = db.define('messages', {
    message: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },
});

export default Message;