/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapHome.js":
/*!***************************!*\
  !*** ./src/js/mapHome.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const lat = 6.2363764;\r\n    const lng = -75.5946371;\r\n    const mapHome = L.map('map-home').setView([lat, lng ], 12);\r\n    let markers = new L.FeatureGroup().addTo(mapHome);\r\n    let realEstates = [];\r\n    // Filtros\r\n    const filters = {\r\n        category: '',\r\n        price: '',\r\n    }\r\n    const selectedCategory = document.querySelector('#category');\r\n    const selectedPrice = document.querySelector('#price');\r\n\r\n    // Evento para guardar la categoría seleccionada\r\n    selectedCategory.addEventListener('change', e => {\r\n        filters.category = Number(e.target.value);\r\n        filterRealEstates();\r\n    });\r\n\r\n    // Evento para guardar el precio seleccionado\r\n    selectedPrice.addEventListener('change', e => {\r\n        filters.price = Number(e.target.value);\r\n        filterRealEstates();\r\n    });\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapHome);\r\n\r\n    // Obtener propiedades de la API de Real Estate\r\n    const getRealEstates = async () => {\r\n        try {\r\n            const response = await fetch('/api/propiedades');\r\n            realEstates = await response.json();\r\n            viewRealEstates(realEstates);\r\n        } catch (error) {\r\n            console.log(error);\r\n        }\r\n    }\r\n\r\n    const viewRealEstates = (realEstates) => {\r\n        realEstates.forEach(realEstate => {\r\n            const {id, title, street, lat, lng, price, image, category} = realEstate;\r\n            const popupOptions = L.popup()\r\n                .setContent(`<h1 class='font-bold'>${title}</h1>\r\n                            <p>${street}</p>\r\n                            <p>${price.price}</p>\r\n                            <img class='mb-4 rounded-md' src=\"uploads/${image}\" alt=\"${title}\" width=\"200\" height=\"150\" />\r\n                            <a href=\"/propiedad/${id}\" class='block p-2 uppercase rounded text-sm text-center font-extrabold text-white'>Ver más</a>`);\r\n            const marker = new L.marker([lat, lng], {popupOptions}).bindPopup(popupOptions);\r\n            markers.addLayer(marker);\r\n        });\r\n        markers.addTo(mapHome);\r\n        mapHome.fitBounds(markers.getBounds());\r\n    }\r\n\r\n    const filterRealEstates = () => {\r\n        \r\n        // Método chaining para filtrar por categoría y precio. De esta forma se pueden combinar múltiples filtros.\r\n        const result = realEstates.filter(filterByCategory).filter(filterByPrice);\r\n\r\n        // Eliminar los marcadores del mapa para que se generen nuevamente con los filtros aplicados.\r\n        markers.clearLayers();\r\n        \r\n        // Mostrar los marcadores filtrados en el mapa por categoría y precio.\r\n        viewRealEstates(result);\r\n        \r\n    }\r\n\r\n    const filterByCategory = realEstate => filters.category ? realEstate.category.id === filters.category : realEstate;\r\n    const filterByPrice = realEstate => filters.price ? realEstate.price.id === filters.price : realEstate;\r\n\r\n    getRealEstates()\r\n    \r\n}) ()\n\n//# sourceURL=webpack://bienes-raices-mvc/./src/js/mapHome.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapHome.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;