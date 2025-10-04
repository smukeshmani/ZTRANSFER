sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function(Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("Transfer_Delivery_app.ZTRANSFER.controller.View", {
        
        onUploadChange: function(oEvent) {
            var file = oEvent.getParameter("files")[0];
            if (!file) {
                MessageToast.show("Please select a file first");
                return;
            }
            console.log("XLSX available?", typeof XLSX);

            var that = this;
            var reader = new FileReader();

            reader.onload = function(e) {
                try {
                    var data = new Uint8Array(e.target.result);
                    var workbook = XLSX.read(data, { type: 'array' });

                    // Get first sheet
                    var firstSheet = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[firstSheet];

                    // Convert to array of arrays
                    var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    // First row as header
                    var headers = jsonData[0];
                    var formattedData = [];

                    for (var i = 1; i < jsonData.length; i++) {
                        var row = {};
                        for (var j = 0; j < headers.length; j++) {
                            row[headers[j]] = jsonData[i][j];
                        }
                        formattedData.push(row);
                    }

                    // Set to model
                    var oModel = new JSONModel(formattedData);
                    that.getView().setModel(oModel, "excelData");

                    MessageToast.show("Excel file processed successfully!");
                } catch (err) {
                    MessageToast.show("Error reading Excel file");
                    console.error(err);
                }
            };

            reader.readAsArrayBuffer(file);
        },
        onShowJson: function() {
    var oModel = this.getView().getModel("excelData");
    if (!oModel) {
        sap.m.MessageToast.show("No data available. Please upload an Excel file first.");
        return;
    }

    var aData = oModel.getData();
    var sJson = JSON.stringify(aData, null, 4); // pretty format

    // Create JSON payload dialog
    if (!this._oDialog) {
        this._oDialog = new sap.m.Dialog({
            title: "JSON Payload",
            contentWidth: "600px",
            contentHeight: "400px",
            resizable: true,
            draggable: true,
            content: [
                new sap.m.TextArea({
                    value: sJson,
                    width: "100%",
                    height: "100%",
                    editable: false,
                    growing: true,
                    growingMaxLines: 50
                })
            ],
            beginButton: new sap.m.Button({
                text: "Close",
                press: function() {
                    this._oDialog.close();
                }.bind(this)
            })
        });
        this.getView().addDependent(this._oDialog);
    } else {
        // update value if dialog already created
        this._oDialog.getContent()[0].setValue(sJson);
    }

    this._oDialog.open();
}

    });
});
