import { Sequelize } from "sequelize";
import db from "../config/db.js";

const Message = db.define('messages', {
    message: {
        type: Sequelize.STRING(300),
        allowNull: false,
    },
});

export default Message;