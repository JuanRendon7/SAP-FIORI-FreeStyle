sap.ui.define([
], function () {
    "use strict";
    return {

        /**
         * Lee los productos del servicio OData con filtros opcionales.
         * @description Ejecuta una llamada OData para leer la entidad '/Products', aplicando los filtros
         * proporcionados. Envuelve la llamada en una Promise para permitir el uso de async/await.
         * Utiliza Promise.all para soportar múltiples peticiones en paralelo (aunque actualmente solo
         * ejecuta una petición).
         * @param {sap.ui.model.odata.v2.ODataModel} oModel - Modelo OData de Northwind
         * @param {Array<sap.ui.model.Filter>} oFilter - Array de filtros para aplicar a la consulta
         * @returns {Promise<Array>} Promesa que resuelve con un array de resultados de productos
         * @async
         * @public
         */
        readProducts: async function (oModel, oFilter) {
            const aRequestsPromises = [
                new Promise(function (resolve, reject) {
                    oModel.read('/Products', {
                        filters: oFilter,
                        success: resolve,
                        error: reject,
                    })
                }.bind(this))
            ];
            return Promise.all(aRequestsPromises);
        },

    }
});
