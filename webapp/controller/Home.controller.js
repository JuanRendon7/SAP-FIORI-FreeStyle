sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/bootcamp/sapui5/freestyle/utils/HomeHelper",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "com/bootcamp/sapui5/freestyle/model/formatter"
], (Controller, HomeHelper, Filter, FilterOpeator, MessageBox, formatter) => {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.freestyle.controller.Home", {
        Formatter: formatter,

        /**
         * Inicializa el controlador Home y obtiene la referencia al router de la aplicación.
         * @description Se ejecuta automáticamente al crear la vista. Configura el router para
         * permitir la navegación a otras vistas.
         * @public
         */
        onInit() {
            this.oRouter = this.getOwnerComponent().getRouter();
        },

        /**
         * Carga todos los productos sin aplicar filtros (método antiguo).
         * @description Obtiene todos los productos del servicio OData y los muestra en la tabla.
         * Muestra un indicador de carga durante el proceso y mensajes de éxito o error al finalizar.
         * Este método incluye una llamada a functionFor como demostración.
         * @async
         * @public
         * @deprecated Usar onPress() en su lugar
         */
        onPress_old: async function () {
            this.functionFor(8);
            const oTable = this.byId("idProductsTable");

            try {
                oTable.setBusy(true);
                let oDatos = await HomeHelper.getDataProducts();
                await HomeHelper.setProductModel(this, oDatos[0].results);
                MessageBox.success(this.getView().getModel("i18n").getResourceBundle().getText("MessageSuccess"));
            } catch (error) {
                MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("errorLoadingProducts"));
                console.error("Error loading products:", error);
            } finally {
                oTable.setBusy(false);
            }
        },


        /**
         * Carga productos aplicando filtros basados en los valores del modelo local.
         * @description Obtiene los valores de filtrado desde LocalDataModel (ProductID y CategoryID)
         * y los aplica a la consulta OData. Actualiza el modelo de productos con los resultados filtrados.
         * @async
         * @public
         */
        onPress: async function () {
            let oFilter = [];
            //let sValue = this.byId("inputID").getValue();
            //let sKeyCombo = this.byId("comboboxID").getSelectedKey();

            const oDataLocalModel = this.getOwnerComponent().getModel("LocalDataModel").getData();

            if (oDataLocalModel.valueInput) {
                oFilter.push(new Filter("ProductID", FilterOpeator.EQ, oDataLocalModel.valueInput));
            }

            if (oDataLocalModel.selectedKey) {
                oFilter.push(new Filter("CategoryID", FilterOpeator.EQ, oDataLocalModel.selectedKey));
            }

            let oDatos = await HomeHelper.getDataProducts(oFilter);
            await HomeHelper.setProductModel(this, oDatos[0].results);
        },

        /**
         * Función de demostración para probar conceptos de JavaScript.
         * @description Demuestra la mutabilidad de objetos, bucles for y manejo de variables
         * const y let. Esta función es únicamente educativa y no tiene impacto funcional en la aplicación.
         * @param {number} cont - Número de iteraciones para el bucle for
         * @public
         */
        functionFor: function (cont) {

            const oProduct = { sID: "P001", sNombre: "Laptop" };
            console.log(oProduct.sID);
            oProduct.sID = "SAPeros";
            console.log(oProduct.sID);

            for (let i = 0; i < cont; i++) {
                console.log("iteracion número: " + (i + 1));
            }

            // Ejemplo con let
            const bAprobado = false;
            let sEstado = "pendiente"; // Estado inicial
            console.log(sEstado);
            if (bAprobado) {
                sEstado = "aprobado"; //Cambia completamente
            } else {
                sEstado = "rechazado"; // Cambia completamente
            }
            console.log(sEstado);
        },
        /**
         * Manejador del evento onChange (actualmente deshabilitado).
         * @description Esta función está comentada. Originalmente filtraba la tabla por ProductID
         * en tiempo real cuando el usuario escribía en un campo de entrada.
         * @param {sap.ui.base.Event} oEvent - Evento de cambio del control
         * @public
         */
        onChange: function (oEvent) {
            // let oFilter = [];
            //let oSource = oEvent.getSource();
            //let oTable = this.getView().byId("idProductsTable")
            //let OBinding = oTable.getBinding("items");

            //if (oSource.getValue()) {
            //     oFilter = new Filter("ProductID", FilterOpeator.EQ, oSource.getValue());
            //}
            //OBinding.filter(oFilter);
        },

        /**
         * Filtra los productos por categoría cuando cambia la selección del ComboBox.
         * @description Aplica un filtro de cliente a la tabla de productos basado en la categoría
         * seleccionada. Si no hay datos cargados, muestra un mensaje de error. Si no hay selección,
         * elimina el filtro y muestra todos los productos.
         * @param {sap.ui.base.Event} oEvent - Evento de cambio de selección del ComboBox
         * @async
         * @public
         */
        onSelectionChange: async function (oEvent) {
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            let oFilter = [];
            const oComboBox = oEvent.getSource(),
                oTable = this.getView().byId("idProductsTable"),
                oBindingItems = oTable.getBinding("items");

                if(!oBindingItems){
                     MessageBox.error(oResourceBundle.getText("NoData"));
                     return;
                }

            const sKeyCombo = oComboBox.getSelectedKey();

            if (sKeyCombo) {
                oFilter = new Filter("CategoryID", FilterOpeator.EQ, sKeyCombo);
            }

            oBindingItems.filter(oFilter);
        },
        
        /**
         * Navega a la vista de detalle del producto seleccionado.
         * @description Obtiene el ProductID del item presionado y navega a la ruta "detail"
         * pasando el ID como parámetro de navegación.
         * @param {sap.ui.base.Event} oEvent - Evento de presionar un item de la lista
         * @public
         */
        onItemPress: function (oEvent) {
            let oSource = oEvent.getSource();
            let oDatos = oSource.getBindingContext("ProductCollection").getObject();

            this.oRouter.navTo("detail", {
                ProductID: oDatos.ProductID
            });
        }


    });
});