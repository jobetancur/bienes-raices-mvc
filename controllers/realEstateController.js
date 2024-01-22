import { unlink } from "node:fs/promises";
import {validationResult} from "express-validator";
import {Prices, Categories, RealEstate, Message, User} from "../models/index.js";
import { isSeller } from "../helpers/index.js";

// GET de mis-propiedades
const getMyRealEstates = async (req, res) => {

    // Leer QueryString
    const currentPage = req.query.pagina;

    // Expresión regular para validar y comparar que currentPage sea un número positivo y entero.
    const regex = /^[1-9]+$/;

    // Validar que currentPage sea un número positivo y entero.
    if (!regex.test(currentPage)) {
        return res.redirect('/mis-propiedades?pagina=1');
    } 

    try {
        const {id} = req.user; // id del usuario autenticado

        // Limites y offset para la paginación
        const limit = 5;
        const offset = currentPage ? (parseInt(currentPage) - 1) * limit : 0; 
        // Si currentPage es undefined, se le asigna 0. Si currentPage es un número, se le resta 1 y se multiplica por el límite. Esto con el fin de que la paginación empiece desde 0 y no desde 1. Ejemplo: currentPage = 2, offset = (2 - 1) * 5 = 5. Esto quiere decir que se obtendrán los registros desde el 5 hasta el 10. currentPage = 1, offset = (1 - 1) * 5 = 0. Esto quiere decir que se obtendrán los registros desde el 0 hasta el 5. currentPage = undefined, offset = 0. Esto quiere decir que se obtendrán los registros desde el 0 hasta el 5. currentPage = 0, offset = (0 - 1) * 5 = -5. Esto quiere decir que se obtendrán los registros desde el -5 hasta el 0. Esto no es posible porque no hay registros con índice negativo. Por eso se le asigna 0 a currentPage si es undefined.

        // Consultar las propiedades del usuario autenticado
        const [ realEstates, total ] = await Promise.all([
            RealEstate.findAll({
                limit,
                offset,
                where: {
                    userId: id,
                },
                include: [
                    {model: Prices, as: 'price'},
                    {model: Categories, as: 'category'},
                    {model: Message, as: 'messages'},
                ],
            }),
            RealEstate.count({ // count() es un método de Sequelize que cuenta los registros de una tabla.
                where: {
                    userId: id,
                },
            }),
        ]);

        // Calcular el total de páginas
        const totalPages = Math.ceil(total / limit);

        // Validar que currentPage sea menor o igual al total de páginas
        if (currentPage > totalPages) {
            return res.redirect(`/mis-propiedades?pagina=${totalPages}`);
        }

        res.render('real-estates/my-real-estates', {
            page: 'Mis propiedades',
            description: 'Administra tus propiedades',
            realEstates,
            csrfToken: req.csrfToken(),
            totalPages,
            currentPage,
            total,
            offset,
            limit,
        });
    } catch (error) {
        console.log(error);
    }
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

// Cambiar estado de la propiedad (publicada o no publicada)
const changeStateRealEstate = async (req, res) => {
    const {id} = req.params;

    // Validar que la propiedad exista
    const realEstate = await RealEstate.findByPk(id);

    if (!realEstate) {
        res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad le pertenezca al usuario que visita la ruta
    if (realEstate?.userId.toString() !== req?.user?.id.toString()) {
        res.redirect('/mis-propiedades');
    }

    // Cambiar el estado de la propiedad
    realEstate.public = !realEstate.public;

    // Guardar en la DB
    await realEstate.save();

    res.json({
        result: 'ok' 
    });
    
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

// GET para mostrar una propiedad por id de manera pública.
const getRealEstateById = async (req, res) => {

    const {id} = req.params;

    // Validar que la propiedad exista
    const realEstate = await RealEstate.findByPk(id, {
        include: [
            {model: Prices, as: 'price'},
            {model: Categories, as: 'category'},
        ],
    });

    if (!realEstate) {
        res.redirect('/404');
    }

    // Validar que la propiedad esté publicada
    if (realEstate?.public == 0) {
        res.redirect('/propiedad-no-publicada');
    }
    
    res.render('real-estates/real-estate', {
        page: realEstate?.title,
        description: 'Propiedad',
        realEstate,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, realEstate.userId),
    });
}

const sendMessage = async (req, res) => {
    const {id} = req.params;

    // Validar que la propiedad exista
    const realEstate = await RealEstate.findByPk(id, {
        include: [
            {model: Prices, as: 'price'},
            {model: Categories, as: 'category'},
        ],
    });

    if (!realEstate) {
        res.redirect('/404');
    }

    // Validar errores con validationResult
    // Resultado de las validaciones
    let result = validationResult(req);

    // Si hay errores
    if (!result.isEmpty()) {
        return res.render('real-estates/real-estate', {
            page: realEstate?.title,
            realEstate,
            csrfToken: req.csrfToken(),
            user: req.user,
            isSeller: isSeller(req.user?.id, realEstate.userId),
            errors: result.array(),
        });
    }

    // Almacenar el mensaje en la base de datos

    await Message.create({
        message: req.body.message,
        realEstateId: id,
        userId: req.user.id,
    });

    res.redirect('/');
}

// Leer mensajes recibidos de una propiedad
const getMessages = async (req, res) => {

    const {id} = req.params;

    // Validar que la propiedad exista
    const realEstate = await RealEstate.findByPk(id, {
        include: [
            { 
                model: Message, as: 'messages',
                include: [
                    {model: User.scope('deletePassword'), as: 'user'},

                ], 
            },
        ],
    });

    if (!realEstate) {
        return res.redirect('/404');
    }

    // Validar que la propiedad le pertenezca al usuario que visita la ruta
    if (realEstate?.userId.toString() !== req.user?.id.toString()) {
        return res.redirect('/');
    }

    res.render('real-estates/messages-view', {
        page: 'Mensajes',
        csrfToken: req.csrfToken(),
        messages: realEstate.messages.sort((a, b) => b.id - a.id),
    })
}

export {
    getMyRealEstates,
    getCreateRealEstate,
    postCreateRealEstate,
    getUploadRealEstateImage,
    postUploadRealEstateImage,
    changeStateRealEstate,
    editRealEstate,
    postEditRealEstate,
    deleteRealEstate,
    getRealEstateById,
    sendMessage,
    getMessages,
}