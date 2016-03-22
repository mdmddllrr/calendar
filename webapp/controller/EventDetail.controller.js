sap.ui.define([
	"CalendarExample/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(BaseController,MessageBox,MessageToast) {
	"use strict";

	return BaseController.extend("CalendarExample.controller.EventDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf CalendarExample.view.EventDetail
		 */
		onInit: function() {
			var oModel = sap.ui.getCore().getModel();
			this.getView().setModel(oModel);
			this.oModel = oModel;
			this.getRouter().getRoute("detailpage").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
			var sDate = oEvent.getParameter("arguments").selectedDate;
		},
		onSaveEvent: function() {
			var that = this;
			var oCal = this.oModel.getProperty("/details");
			var sDate = this.byId("inputDate").getValue();
			var sStart = this.byId("inputStart").getValue();
			var sEnd = this.byId("inputEnd").getValue();
			var oFmt = sap.ui.core.format.DateFormat.getInstance({
				pattern: "yyyy-MM-dd HH:ss"
			});
			var st_date = oFmt.parse(sDate + " " + sStart);
			var end_date = oFmt.parse(sDate + " " + sEnd);
			window.plugins.calendar.createEvent(oCal.title,
				oCal.location, oCal.notes,
				st_date,
				end_date,
				function(message) {
					MessageToast.show("Success");
					that.onNavBack();
				},
				function(message) {
					MessageBox.show("Error: " + JSON.stringify(message));
				}
			);
		},
		onDeleteEvent: function() {
			var that = this;
			var oCal = this.oModel.getProperty("/details");
			MessageBox.confirm(
				"Are you sure you want to delete this event?", {
					title: "Confirm",
					onClose: function(oAction) {
						if (MessageBox.Action.OK === oAction) {
							window.plugins.calendar.deleteEvent(oCal.title,
								oCal.location, oCal.notes, oCal.startTime, oCal.endTime,
								function(message) {
									MessageToast.show("Success");
									that.onNavBack();
								},
								function(message) {
									MessageBox.show("Error: " + JSON.stringify(message));
								}
							);
						}
					}
				}
			);
		}

	});

});