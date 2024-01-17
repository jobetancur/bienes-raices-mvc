(function () {
    const lat = 6.2363764;
    const lng = -75.5946371;
    const mapHome = L.map('map-home').setView([lat, lng ], 12);
    let markers = new L.FeatureGroup().addTo(mapHome);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapHome);

    // Obtener propiedades de la API de Real Estate
    const getRealEstates = async () => {
        try {
            const response = await fetch('/api/propiedades');
            const realEstates = await response.json();
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
                            <a href="/propiedad/${id}" class='bg-indigo-600 block p-2 uppercase rounded text-sm text-center font-extrabold text-white'>Ver más</a>`);
            const marker = new L.marker([lat, lng], {popupOptions}).bindPopup(popupOptions);
            markers.addLayer(marker);
        });
        markers.addTo(mapHome);
        mapHome.fitBounds(markers.getBounds());
    }

    getRealEstates()
    
}) ()