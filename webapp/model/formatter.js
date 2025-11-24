sap.ui.define([], function () {
        "use strict";
        return {

            getStateUnit(value) {
                if (value < 10) {
                    return 'Success';
                } else if (value >= 10 && value < 50) {
                    return 'Warning';
                } else {
                    return 'Error';
                }
            }
        }
    }
);