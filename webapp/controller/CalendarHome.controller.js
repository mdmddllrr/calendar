sap.ui.define([
	"CalendarExample/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox,History) {
	"use strict";

	return BaseController.extend("CalendarExample.controller.CalendarHome", {
		onInit: function() {
			var that = this;
			var oModel = new sap.ui.model.json.JSONModel({});
			this.getView().setModel(oModel);
			this.oModel = oModel;
			this.bindEvents();
		
		},
		bindEvents: function() {
			document.addEventListener("deviceready", jQuery.proxy(this.onDeviceReady,this), false);
		},

		onDeviceReady: function() {
			this.getView().setBusy(true);
			this._markOnCalendar();
		},
		_markOnCalendar: function() {
			var that = this;
			var oFmt = sap.ui.core.format.DateFormat.getInstance({
				pattern: "yyyy-MM-dd HH:mm:ss"
			});
			var today = new Date();
			var sDate = new Date(today);
			var eDate = new Date(today);
			sDate.setDate(sDate.getDate() - 183);
			eDate.setDate(eDate.getDate() + 183);
			var startDate = new Date(sDate);
			var endDate = new Date(eDate);
			var sTitle = '';
			var sLoc = '';
			var sNotes = '';
		
			window.plugins.calendar.findEvent(sTitle, sLoc, sNotes, startDate, endDate, function(aEvents) {
				
				var aMarks = [];
				if (typeof(aEvents) === "string") {
					aEvents = [];
				}
				$.each(aEvents, function(idx, val) {
					aMarks.push({
						"startDate": oFmt.parse(val.startDate)
					});
				});
				that.getView().setBusy(false);
				try {
					
					that.oModel.setProperty("/marks", aMarks);
					
				} catch (e) {
					console.log(e);
				}
			}, function(error) {
				that.getView().setBusy(false);
				MessageBox.show("Error: " + JSON.stringify(error));
			});
		},
		onCalSelect: function(oEvent) {
		
			var oCalendar = oEvent.getSource();
			var aSelectedDates = oCalendar.getSelectedDates();
			var oDate;
			if (aSelectedDates.length > 0) {
				oDate = aSelectedDates[0].getStartDate();
				var oFmt = sap.ui.core.format.DateFormat.getInstance({pattern: "yyyy-MM-dd"});
				var sDate = oFmt.format(oDate);
				this.getRouter().navTo("eventpage",{selectedDate:sDate});
			}
		},
		onRefresh:function(oEvent){
			this._markOnCalendar();
		}
		
	});

});