import RealEstate from './RealEstate.js';
import User from './User.js';
import Prices from './Prices.js';
import Categories from './Categories.js';
import Message from './Message.js';
// import Sequelize from 'sequelize';

RealEstate.belongsTo(Prices, { foreignKey: 'priceId' });
RealEstate.belongsTo(Categories, { foreignKey: 'categoryId' });
RealEstate.belongsTo(User, { foreignKey: 'userId' });
RealEstate.hasMany(Message, { foreignKey: 'realEstateId' });

Message.belongsTo(RealEstate, { foreignKey: 'realEstateId'  });
Message.belongsTo(User, { foreignKey: 'userId'  });

export {
    RealEstate,
    User,
    Prices,
    Categories,
    Message,
}