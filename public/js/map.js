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

/***/ "./src/js/map.js":
/*!***********************!*\
  !*** ./src/js/map.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n    const lat = document.querySelector('#lat').value || 6.2363764;\r\n    const lng = document.querySelector('#lng').value || -75.5946371;\r\n    const map = L.map('map').setView([lat, lng ], 12);\r\n    let market;\r\n\r\n    // Leer el nombre de la calle\r\n    const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(map);\r\n\r\n    // pin\r\n    market = new L.marker([lat, lng], {\r\n        draggable: true, // Permite arrastrar el pin.\r\n        autoPan: true // Mueve el mapa cuando se arrastra el pin.\r\n    }).addTo(map); // Agrega el pin al mapa.\r\n\r\n    // Leer coordenadas del pin\r\n    market.on('moveend', function(e) {\r\n        market = e.target;\r\n        const position = market.getLatLng();\r\n        console.log(position);\r\n        map.panTo(new L.LatLng(position.lat, position.lng));\r\n        // Reverse Geocoding, cuando el usuario reubica el pin.\r\n\r\n        geocodeService.reverse().latlng(position, 13).run(function(error, result) {\r\n            // console.log(result);\r\n            market.bindPopup(result.address.LongLabel); // Muestra la dirección en el pin.\r\n            market.openPopup(); // Abre el popup.\r\n            // fillInputs(result);\r\n\r\n            // Llenar los inputs\r\n            document.querySelector('.street').textContent = result.address.Address || '';\r\n            document.querySelector('#street').value = result.address.Address || '';\r\n            document.querySelector('#lat').value = result.latlng.lat || '';\r\n            document.querySelector('#lng').value = result.latlng.lng || '';\r\n        });\r\n\r\n\r\n    });\r\n\r\n    \r\n\r\n})()\n\n//# sourceURL=webpack://bienes-raices-mvc/./src/js/map.js?");

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
/******/ 	__webpack_modules__["./src/js/map.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;