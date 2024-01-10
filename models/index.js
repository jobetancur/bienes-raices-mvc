import RealEstate from './RealEstate.js';
import User from './User.js';
import Prices from './Prices.js';
import Categories from './Categories.js';
// import Sequelize from 'sequelize';

RealEstate.belongsTo(Prices);
RealEstate.belongsTo(Categories);
RealEstate.belongsTo(User);

export {
    RealEstate,
    User,
    Prices,
    Categories,
}