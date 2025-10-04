/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"Transfer_Delivery_app/ZTRANSFER/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});