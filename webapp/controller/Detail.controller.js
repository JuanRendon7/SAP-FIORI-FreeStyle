sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/bootcamp/sapui5/freestyle/utils/HomeHelper"
], (Controller, HomeHelper) => {
    "use strict";
    return Controller.extend("com.bootcamp.sapui5.freestyle.controller.Detail", {
        /**
         * Inicializa el controlador de detalle y configura el evento de navegación.
         * @description Obtiene el router y adjunta un manejador al evento de coincidencia de patrón
         * de la ruta "detail" para actualizar la vista cuando se navega a un producto específico.
         * @public
         */
        onInit() {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
        },

        /**
         * Maneja la navegación al detalle de un producto específico.
         * @description Se ejecuta cuando la ruta "detail" coincide con la navegación actual.
         * Obtiene el ProductID de los parámetros de la URL y enlaza la vista al contexto
         * del producto correspondiente, expandiendo también los Order_Details relacionados.
         * @param {sap.ui.base.Event} oEvent - Evento de coincidencia de patrón de ruta
         * @private
         */
        _onObjectMatched: function (oEvent) {
            // Obtener el ProductID de la URL y enlazar el contexto
            let sProductID = oEvent.getParameter("arguments").ProductID;
            this.getView().bindElement({
                path: "/Products(" + sProductID + ")",
                parameters: {
                    expand: "Order_Details"
                }
            });
        }
    });
});