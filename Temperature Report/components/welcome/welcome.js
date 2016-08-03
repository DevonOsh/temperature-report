(function(temp,$){
	var welcome = null,
		app = temp.app = temp.app || {};
		
	app.welcome = {
		onShow: function() {
			
		},
		onHide: function() {
			//What should happen once the view is hidden.
			//Called from data-hide in HTML
		},
        createNewReport: function() {},
        checkForReport: function() {}
	}
})(window, jQuery);