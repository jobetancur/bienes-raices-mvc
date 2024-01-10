import { validationResult } from "express-validator";
import { Prices, Categories, RealEstate } from "../models/index.js";

// GET de mis-propiedades
const getMyRealEstates = (req, res) => {
    res.render('real-estates/my-real-estates', {
        page: 'Mis propiedades',
        description: 'Administra tus propiedades',
        csrfToken: req.csrfToken(),
        realEstate: {},
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
        csrfToken: req.csrfToken(),
        realEstate: {},
        header: true,
        categories, // Object literal shorthand. Al tener el mismo nombre no es necesario poner categories: categories.
        prices, // Object literal shorthand. Al tener el mismo nombre no es necesario poner prices: prices.
    });
}

// POST para crear una propiedad en /mis-propiedades/crear-propiedad
const postCreateRealEstate = async (req, res) => {
    // Resultado de las validaciones

    let result= validationResult(req);

    // Si hay errores
    if (!result.isEmpty()) {
        // Consultar precio y categoría
        const [ categories, prices ] = await Promise.all([
            Categories.findAll(),
            Prices.findAll(),
        ]);

        res.render('real-estates/create-real-estate', {
            page: 'Crear propiedad',
            description: 'Crea una nueva propiedad',
            csrfToken: req.csrfToken(),
            realEstate: req.body,
            header: true,
            categories, // Object literal shorthand. Al tener el mismo nombre no es necesario poner categories: categories.
            prices, // Object literal shorthand. Al tener el mismo nombre no es necesario poner prices: prices.
            errors: result.array(),
        });
    } 

    // Si no hay errores, se debe crear un registro
    // Desestructurar el body para obtener los valores. Price y category son reemplazados por priceId y categoryId. Esto con el fin de que dentro del try en el const newRealEstate se pueda usar priceId y categoryId y todo quede más limpio dentro del objeto que será enviado a la DB.
    const { title, description, rooms, parking, wc, street, lat, lng, price: priceId, category: categoryId } = req.body;
    
    // Este id de usuario es capturado desde la info de req.user que se obtiene en el middleware protectedRoute.js para el inicio de sesión.
    const {id: userId} = req.user;
    
    try {
        const newRealEstate = await RealEstate.create({
            title,
            description,
            rooms,
            parking,
            wc,
            street,
            lat,
            lng,
            priceId,
            categoryId,
            userId,
            image: '',
        });

        const { id } = newRealEstate;

        return res.redirect(`/mis-propiedades/agregar-imagen/${id}`);

    } catch (error) {
        console.log(error);
    }

}

export {
    getMyRealEstates,
    getCreateRealEstate,
    postCreateRealEstate,
}