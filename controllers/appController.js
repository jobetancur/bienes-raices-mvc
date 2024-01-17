
const home = (req, res) => {
    res.render('home', { 
        title: 'Home', 
        page: 'Home',
    });
}

const categories = (req, res) => {
    res.render('categories', { title: 'Categories' });
}

const errorPage = (req, res) => {
    res.render('404', { title: '404' });
}

const search = (req, res) => {
    res.render('search', { title: 'Search' });
}

export {
    home,
    categories,
    errorPage,
    search,
}