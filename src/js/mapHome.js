(function () {
    const lat = 6.2363764;
    const lng = -75.5946371;
    const mapHome = L.map('map-home').setView([lat, lng ], 12);
    let markers = new L.FeatureGroup().addTo(mapHome);
    let realEstates = [];
    // Filtros
    const filters = {
        category: '',
        price: '',
    }
    const selectedCategory = document.querySelector('#category');
    const selectedPrice = document.querySelector('#price');

    // Evento para guardar la categoría seleccionada
    selectedCategory.addEventListener('change', e => {
        filters.category = Number(e.target.value);
        filterRealEstates();
    });

    // Evento para guardar el precio seleccionado
    selectedPrice.addEventListener('change', e => {
        filters.price = Number(e.target.value);
        filterRealEstates();
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapHome);

    // Obtener propiedades de la API de Real Estate
    const getRealEstates = async () => {
        try {
            const response = await fetch('/api/propiedades');
            realEstates = await response.json();
            viewRealEstates(realEstates);
        } catch (error) {
            console.log(error);
        }
    }

    const viewRealEstates = (realEstates) => {
        realEstates.forEach(realEstate => {
            const {id, title, street, lat, lng, price, image, category} = realEstate;
            const popupOptions = L.popup()
                .setContent(`<h1 class='font-bold'>${title}</h1>
                            <p>${street}</p>
                            <p>${price.price}</p>
                            <img class='mb-4 rounded-md' src="uploads/${image}" alt="${title}" width="200" height="150" />
                            <a href="/propiedad/${id}" class='block p-2 uppercase rounded text-sm text-center font-extrabold text-white'>Ver más</a>`);
            const marker = new L.marker([lat, lng], {popupOptions}).bindPopup(popupOptions);
            markers.addLayer(marker);
        });
        markers.addTo(mapHome);
        mapHome.fitBounds(markers.getBounds());
    }

    const filterRealEstates = () => {
        
        // Método chaining para filtrar por categoría y precio. De esta forma se pueden combinar múltiples filtros.
        const result = realEstates.filter(filterByCategory).filter(filterByPrice);

        // Eliminar los marcadores del mapa para que se generen nuevamente con los filtros aplicados.
        markers.clearLayers();
        
        // Mostrar los marcadores filtrados en el mapa por categoría y precio.
        viewRealEstates(result);
        
    }

    const filterByCategory = realEstate => filters.category ? realEstate.category.id === filters.category : realEstate;
    const filterByPrice = realEstate => filters.price ? realEstate.price.id === filters.price : realEstate;

    getRealEstates()
    
}) ()