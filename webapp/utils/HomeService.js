sap.ui.define([
], function () {
    "use strict";
    return {

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
