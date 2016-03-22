sap.ui.define([
	"CalendarExample/controller/BaseController",
	"sap/m/MessageBox"
], function(BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("CalendarExample.controller.EventList", {

		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel({});
			sap.ui.getCore().setModel(oModel)
			this.getView().setModel(sap.ui.getCore().getModel());
			this.oModel = sap.ui.getCore().getModel();
			this.getRouter().getRoute("eventpage").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			var that = this;
			var sDate = oEvent.getParameter("arguments").selectedDate;
			var Datestring = oEvent.getParameter("arguments").Datestring;
			this.oModel.setProperty("/dateString", sDate);
			var oFmt = sap.ui.core.format.DateFormat.getInstance({
				pattern: "yyyy-MM-dd HH:mm:ss"
			});
			var sStart = "00:00";
			var sEnd = "23:59";

			var st_date = oFmt.parse(sDate + " " + sStart);
			var end_date = oFmt.parse(sDate + " " + sEnd);

			var sTitle = '';
			window.plugins.calendar.findEvent(sTitle, null, null, st_date, end_date, function(aEvents) {

				if (typeof(aEvents) === "string") {
					aEvents = [];
				}
				$.each(aEvents, function(idx, val) {
					val.startTime = oFmt.parse(val.startDate).getTime();
					val.endTime = oFmt.parse(val.endDate).getTime();
					val.notes = val.message;
					val.message = "[" + val.startDate.substr(11, 5) + "] " + val.message;
				});
				that.oModel.setProperty("/events", aEvents);
			}, function(error) {
				MessageBox.show("Error: " + JSON.stringify(message));
			});

		},
		onCreateEvent: function(oEvent) {
			var sDate = this.oModel.getProperty("/dateString");
			var oFmt = sap.ui.core.format.DateFormat.getInstance({
				pattern: "yyyy-MM-dd HH:mm:ss"
			});
			var st_date = oFmt.parse(sDate + " 12:00");
			var end_date = oFmt.parse(sDate + " 12:00");

			sap.ui.getCore().getModel().setProperty("/details", {
				dateString: sDate,
				startTime: st_date,
				endTime: end_date,
				deletable: false,
				editable: true
			});

			this.getRouter().navTo("detailpage", {
				selectedDate: sDate
			});
		},
		onListItemPress: function(oEvent) {
			var oFmt = sap.ui.core.format.DateFormat.getInstance({pattern: "yyyy-MM-dd"});
			var oCtx = oEvent.getSource().getBindingContext();
			var oCal = oCtx.getObject();
			var sDate = this.oModel.getProperty("/dateString");
			sap.ui.getCore().getModel().setProperty("/details", {
				id: oCal.id,
				title: oCal.title,
				dateString: oFmt.format(new Date(oCal.startTime)),
				startTime: typeof(oCal.startTime) === "number" ? new Date(oCal.startTime) : oCal.startTime,
				endTime: typeof(oCal.endTime) === "number" ? new Date(oCal.endTime) : oCal.endTime,
				notes: oCal.notes,
				location: oCal.location,
				deletable: true,
				editable: false
			});
			this.getRouter().navTo("detailpage", {
				selectedDate: sDate
			});
		},

	});

});