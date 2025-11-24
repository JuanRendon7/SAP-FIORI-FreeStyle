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

        onInit() {
            this.oRouter = this.getOwnerComponent().getRouter();
        },

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
        
        onItemPress: function (oEvent) {
            let oSource = oEvent.getSource(); 
            let oDatos = oSource.getBindingContext("ProductCollection").getObject();
            
            this.oRouter.navTo("detail", { 
                ProductID: oDatos.ProductID 
            });
        }


    });
});