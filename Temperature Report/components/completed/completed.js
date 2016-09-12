(function(temp,$) {
    var completed = null,
        app = temp.app = temp.app || {};
    
    app.completed = {
        onShow: function () {} 
    }
    
    app.completedDetailModel = kendo.observable({
        reportID: '',
        locationID: '',
        locationName: '',
        inRange: '',
        employee: '',
        temp: '',
        stampDT: '',
        stampTM: ''
    });
    
    app.completedDetail = {
        
    }
})(window,jQuery);