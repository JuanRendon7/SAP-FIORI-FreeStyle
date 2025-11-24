sap.ui.define([
    "com/bootcamp/sapui5/freestyle/utils/HomeService",
    "sap/ui/model/json/JSONModel"
], function (HomeService, JSONModel) {
    "use strict";
    return {
        /**
         * Inicializa el helper guardando la referencia al modelo OData de Northwind.
         * @description Este método debe ser llamado antes de usar cualquier otra función del helper.
         * Guarda el modelo OData en una propiedad privada para uso posterior en las operaciones de datos.
         * @param {sap.ui.model.odata.v2.ODataModel} oNorthwindModel - Modelo OData de Northwind
         * @public
         */
        init: function (oNorthwindModel) {
            this._oNorthwindModel = oNorthwindModel;
        },

        /**
         * Obtiene los datos de productos desde el servicio OData.
         * @description Delega la lectura de productos al HomeService, pasando el modelo OData
         * y los filtros especificados. Retorna una promesa con los resultados.
         * @param {Array<sap.ui.model.Filter>} oFilters - Array de filtros para aplicar a la consulta OData
         * @returns {Promise<Array>} Promesa que resuelve con un array de resultados de productos
         * @async
         * @public
         */
        getDataProducts: async function (oFilters) {
            //let oFilters = [];
            return HomeService.readProducts(this._oNorthwindModel, oFilters);
        },

        /**
         * Crea o actualiza el modelo JSON de productos (ProductCollection).
         * @description Si el modelo ProductCollection no existe, lo crea con un límite de tamaño de 1,000,000 items
         * y lo establece en el componente. Luego actualiza el modelo con los datos de productos recibidos.
         * @param {sap.ui.core.mvc.Controller} oController - Referencia al controlador que solicita la actualización
         * @param {Array} oDatos - Array de objetos de productos para establecer en el modelo
         * @returns {Promise<void>} Promesa que se resuelve cuando el modelo ha sido actualizado
         * @async
         * @public
         */
        setProductModel: async function (oController, oDatos) {
            let oListModel = oController.getOwnerComponent().getModel('ProductCollection');
            if (!oListModel) {
                const oModel = new JSONModel([]);
                oModel.setSizeLimit(1000000);
                oController.getOwnerComponent().setModel(oModel, "ProductCollection");
                oListModel = oController.getOwnerComponent().getModel('ProductCollection');
            }
            oListModel.setData(oDatos);
        },

        /**
         * Inicializa el modelo local de datos para almacenar valores de filtros.
         * @description Crea un modelo JSON llamado "LocalDataModel" con la estructura inicial
         * para almacenar los valores de los filtros de búsqueda (valueInput para ProductID
         * y selectedKey para CategoryID). Este modelo se usa para mantener el estado de los filtros.
         * @param {sap.ui.core.UIComponent} oComponent - Componente de la aplicación donde se establecerá el modelo
         * @public
         */
        setInitModelLocalData: function (oComponent) {
            oComponent.setModel(new JSONModel({
                valueInput: '',
                selectedKey: ''
            }), "LocalDataModel");


        }

    };
})