import {Prices, Categories, RealEstate} from "../models/index.js";

const apiRealEstates = async (req, res) => {
    const apiRealEstatesList = await RealEstate.findAll({
        include: [Prices, Categories],
    });
    res.json(apiRealEstatesList);

}

export {
    apiRealEstates,
}