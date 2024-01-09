import Prices from "../models/Prices.js";
import Categories from "../models/Categories.js";

// GET de mis-propiedades
const getMyRealEstates = (req, res) => {
    res.render('real-estates/my-real-estates', {
        page: 'Mis propiedades',
        description: 'Administra tus propiedades',
        user: req.user,
        header: true,
    });
}

// GET /mis-propiedades/crear-propiedad
const getCreateRealEstate = async (req, res) => {
    // Consultar precio y categoría
    const [ categories, prices ] = await Promise.all([
        Categories.findAll(),
        Prices.findAll(),
    ]);

    res.render('real-estates/create-real-estate', {
        page: 'Crear propiedad',
        description: 'Crea una nueva propiedad',
        user: req.user,
        header: true,
        categories, // Object literal shorthand. Al tener el mismo nombre no es necesario poner categories: categories.
        prices, // Object literal shorthand. Al tener el mismo nombre no es necesario poner prices: prices.
    });
}

export {
    getMyRealEstates,
    getCreateRealEstate,
}