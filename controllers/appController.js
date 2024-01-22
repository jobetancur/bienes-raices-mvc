import { Sequelize } from 'sequelize';
import {Prices, Categories, RealEstate} from '../models/index.js'

const home = async (req, res) => {

    const [houses, apartments, prices, categories] = await Promise.all([
        RealEstate.findAll({
            limit: 3,
            where: {
                categoryId: 1,
            },
            include: [
                {
                    model: Prices,
                },
                {
                    model: Categories,
                },
            ],
            order: [
                ['createdAt', 'DESC'],
            ],
        }),
        RealEstate.findAll({
            limit: 3,
            where: {
                categoryId: 2,
            },
            include: [
                {
                    model: Prices,
                },
                {
                    model: Categories,
                },
            ],
            order: [
                ['createdAt', 'DESC'],
            ],
        }),
        Prices.findAll({
            raw: true,
        }),
        Categories.findAll({
            raw: true,
        })
    ]);

    res.render('home', { 
        title: 'Home', 
        page: 'Home',
        houses,
        apartments,
        prices,
        categories,
        csrfToken: req.csrfToken(),
    });
}

const categories = async (req, res) => {
    const { id } = req.params;
    
    // Comprobar que el id de la categoría exista
    const category = await Categories.findByPk(id);

    if (!category) {
        return res.redirect('/404');
    }

    // Obtener las propiedades de la categoría
    const realEstates = await RealEstate.findAll({
        where: {
            categoryId: id,
        },
        include: [
            {
                model: Prices,
            },
            {
                model: Categories,
            },
        ]
    });

    res.render('category-view', { 
        title: 'Categorías', 
        page: `${category.name}`,
        realEstates,
        category,
        csrfToken: req.csrfToken(),
    });

}

const errorPage = (req, res) => {
    res.render('404', { 
        title: '404', 
        page: '404',
        csrfToken: req.csrfToken(), 
    });
}

const notPublished = (req, res) => {
    res.render('not-published', { 
        title: 'Propiedad no publicada', 
        page: 'Propiedad no publicada',
        csrfToken: req.csrfToken(), 
    });
}

const search = async (req, res) => {
    
    const { termino } = req.body;

    // Validar que termino no esté vacío
    if (!termino.trim()) {
        return res.redirect('back');
    }

    // Consultar las propiedades
    const realEstates = await RealEstate.findAll({
        where: {
            title: {
                [Sequelize.Op.like]: `%${termino}%`,
            },
        },
        include: [
            {
                model: Prices,
            },
            {
                model: Categories,
            },
        ],
    });

    res.render('search', { 
        title: 'Búsqueda', 
        page: 'Resultado de la búsqueda',
        realEstates,
        csrfToken: req.csrfToken(),
    });
    
}

export {
    home,
    categories,
    errorPage,
    search,
    notPublished,
}