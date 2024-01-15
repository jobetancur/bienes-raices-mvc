import { unlink } from "node:fs/promises";
import {validationResult} from "express-validator";
import {Prices, Categories, RealEstate} from "../models/index.js";

// GET de mis-propiedades
const getMyRealEstates = async (req, res) => {
    const {id} = req.user; // id del usuario autenticado

    // Consultar las propiedades del usuario autenticado
    const realEstates = await RealEstate.findAll({
        where: {
            userId: id,
        },
        include: [
            {model: Prices, as: 'price'},
            {model: Categories, as: 'category'},
        ],
    });

    res.render('real-estates/my-real-estates', {
        page: 'Mis propiedades',
        description: 'Administra tus propiedades',
        realEstates,
        csrfToken: req.csrfToken(),
    });
}

// GET /mis-propiedades/crear-propiedad
const getCreateRealEstate = async (req, res) => {
    // Consultar precio y categoría
    const [categories, prices] = await Promise.all([
        Categories.findAll(),
        Prices.findAll(),
    ]);

    res.render('real-estates/create-real-estate', {
        page: 'Crear propiedad',
        description: 'Crea una nueva propiedad',
        csrfToken: req.csrfToken(),
        realEstate: {},
        categories, // Object literal shorthand. Al tener el mismo nombre no es necesario poner categories: categories.
        prices, // Object literal shorthand. Al tener el mismo nombre no es necesario poner prices: prices.
    });
}

// POST para crear una propiedad en /mis-propiedades/crear-propiedad
const postCreateRealEstate = async (req, res) => {
    // Resultado de las validaciones

    let result = validationResult(req);

    // Si hay errores
    if (!result.isEmpty()) {
        // Consultar precio y categoría
        const [categories, prices] = await Promise.all([
            Categories.findAll(),
            Prices.findAll(),
        ]);

        res.render('real-estates/create-real-estate', {
            page: 'Crear propiedad',
            description: 'Crea una nueva propiedad',
            csrfToken: req.csrfToken(),
            realEstate: req.body,
            categories, // Object literal shorthand. Al tener el mismo nombre no es necesario poner categories: categories.
            prices, // Object literal shorthand. Al tener el mismo nombre no es necesario poner prices: prices.
            errors: result.array(),
        });
    }

    // Si no hay errores, se debe crear un registro
    // Desestructurar el body para obtener los valores. Price y category son reemplazados por priceId y categoryId. Esto con el fin de que dentro del try en el const newRealEstate se pueda usar priceId y categoryId y todo quede más limpio dentro del objeto que será enviado a la DB.
    const {title, description, rooms, parking, wc, street, lat, lng, price: priceId, category: categoryId} = req.body;

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

        const {id} = newRealEstate;

        return res.redirect(`/mis-propiedades/agregar-imagen/${id}`);

    } catch (error) {
        console.log(error);
    }

}

const getUploadRealEstateImage = async (req, res) => {

    const {id} = req.params;

    // Validar que la propiedad exista
    const realEstate = await RealEstate.findByPk(id);
    if (!realEstate) {
        res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad no esté publicada
    if (realEstate.public === 1) {
        res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad le pertenezca al usuario que visita la ruta
    if (realEstate.userId.toString() !== req.user.id.toString()) {
        res.redirect('/mis-propiedades');
    }

    res.render('real-estates/upload-real-estate-image', {
        page: `Agregar imagen para: ${realEstate.title}`,
        csrfToken: req.csrfToken(),
        realEstate,
    });
}

const postUploadRealEstateImage = async (req, res, next) => {
    // Validar que la propiedad exista
    const {id: userId} = req.user;
    const {id} = req.params;
    const realEstate = await RealEstate.findByPk(id);
    if (!realEstate) {
        res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad no esté publicada
    if (realEstate.public === 1) {
        res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad le pertenezca al usuario que visita la ruta
    if (realEstate.userId.toString() !== req.user.id.toString()) {
        res.redirect('/mis-propiedades');
    }

    try {
        // Si hay una imagen
        if (req.file) { // req.file.filename es el nombre de la imagen que se subió por multer.
            realEstate.image = req.file.filename;
            realEstate.public = 1;
        }
        // Guardar en la DB
        await realEstate.save();

        next();

    } catch (error) {
        console.log(error);
    }

}

const editRealEstate = async (req, res) => {
    const {id} = req.params;

    // Validar que la propiedad exista
    const realEstate = await RealEstate.findByPk(id);

    if (!realEstate) {
        res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad le pertenezca al usuario que visita la ruta
    if (realEstate.userId.toString() !== req.user.id.toString()) {
        res.redirect('/mis-propiedades');
    }

    // Consultar precios y categorías para listar en los select
    const [categories, prices] = await Promise.all([
        Categories.findAll(),
        Prices.findAll(),
    ]);

    res.render('real-estates/edit-real-estate', {
        page: `Editar propiedad: ${realEstate.title}`,
        description: 'Edita una propiedad',
        csrfToken: req.csrfToken(),
        realEstate,
        categories,
        prices,
    });

}

// POST para guardar los cambios editados en la propiedad.
const postEditRealEstate = async (req, res) => {
    // Si no hay errores, se debe crear un registro
    const {id} = req.params;

    // Validar que la propiedad exista
    const realEstate = await RealEstate.findByPk(id);
    
    // Resultado de las validaciones
    let result = validationResult(req);

    // Si hay errores
    if (!result.isEmpty()) {
        // Consultar precio y categoría
        const [categories, prices] = await Promise.all([
            Categories.findAll(),
            Prices.findAll(),
        ]);

        return res.render('real-estates/edit-real-estate', {
            page: 'Editar propiedad',
            description: 'Edita una propiedad',
            csrfToken: req.csrfToken(),
            realEstate: { ...req.body, userId: realEstate.userId },
            categories, // Object literal shorthand. Al tener el mismo nombre no es necesario poner categories: categories.
            prices, // Object literal shorthand. Al tener el mismo nombre no es necesario poner prices: prices.
            errors: result.array(),
        });
    }

    if (!realEstate) {
        res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad le pertenezca al usuario que visita la ruta
    // if (realEstate.userId.toString() !== req.user.id.toString()) {
    //     res.redirect('/mis-propiedades');
    // }

    // Si no hay errores, se debe actualizar el registro en la base de datos.
    // Desestructurar el body para obtener los valores. Price y category son reemplazados por priceId y categoryId. Esto con el fin de que dentro del try en el const newRealEstate se pueda usar priceId y categoryId y todo quede más limpio dentro del objeto que será enviado a la DB.
    
    try {
        const {title, description, rooms, parking, wc, street, lat, lng, price: priceId, category: categoryId} = req.body;

        // El método .set de Sequelize permite actualizar los valores de un registro.
        realEstate.set({
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
        })

        await realEstate.save();

        return res.redirect('/mis-propiedades');

    } catch (error) {
        console.log(error);
    }

}

const deleteRealEstate = async (req, res) => {
    const {id} = req.params;

    // Validar que la propiedad exista
    const realEstate = await RealEstate.findByPk(id);

    if (!realEstate) {
        res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad le pertenezca al usuario que visita la ruta
    if (realEstate.userId.toString() !== req.user.id.toString()) {
        res.redirect('/mis-propiedades');
    }

    // Eliminar la imágen asociada a la propiedad para depurar el storage y no dejar imagenes inutilizadas.
    // unlink es una función de node.js para eliminar archivos. Se debe importar de node:fs/promises.
    await unlink(`public/uploads/${realEstate.image}`);

    // Eliminar la propiedad. El método destroy() de Sequelize elimina el registro de la base de datos.
    await realEstate.destroy();

    res.redirect('/mis-propiedades');
}

export {
    getMyRealEstates,
    getCreateRealEstate,
    postCreateRealEstate,
    getUploadRealEstateImage,
    postUploadRealEstateImage,
    editRealEstate,
    postEditRealEstate,
    deleteRealEstate,
}