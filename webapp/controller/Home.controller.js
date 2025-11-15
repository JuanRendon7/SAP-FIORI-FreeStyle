sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/bootcamp/sapui5/freestyle/utils/HomeHelper",
    "sap/m/MessageBox"
], (Controller, HomeHelper, MessageBox) => {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.freestyle.controller.Home", {
        onInit() {
        },

        onPress: async function () {
            const oTable = this.byId("idProductsTable");

            try {
                oTable.setBusy(true);
                let oDatos = await HomeHelper.getDataProducts();
                await HomeHelper.setProductModel(this, oDatos[0].results);
                MessageBox.success(this.oResourceBundle = this.getView().getModel("i18n").getResourceBundle().getText("MessageSuccess"));
            } catch (error) {
                MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("errorLoadingProducts"));
                console.error("Error loading products:", error);
            } finally {
                oTable.setBusy(false);
            }
        }
    });
});