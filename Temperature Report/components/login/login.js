(function (temp, $) {
    var loginViewModel,
        app = temp.app = temp.app || {};

    app.user = {
        firstName: "",
        lastName: "",
        userName: ""
    }

    app.loginViewModel = kendo.observable({
        userName: '',
        password: '',
        validateData: function (data) {
            if (!data.userName) {
                alert('Missing userName');
                return false;
            }

            if (!data.password) {
                alert('Missing password');
                return false;
            }

            return true;
        },
        signin: function () {
            var model = app.loginViewModel,
                userName = model.userName,
                password = model.password;

            if (!model.validateData(model)) {
                return false;
            }

            //app.loginJSDO.fill();

            var loginDataSource = new kendo.data.DataSource({
                type: "jsdo",
                serverFiltering: false,
                serverSorting: false,
                transport: {
                    jsdo: app.loginJSDO
                },
                error: function (e) {
                    console.log("Error: ", e);
                },
                filter: {
                    field: "USERNAME",
                    operator: "eq",
                    value: userName
                }
            });

            var view = loginDataSource.view(),
                USERNAME = view[0].USERNAME,
                PASSWORD = view[0].PASSWORD;
            alert("Username: " + USERNAME + "\n" +
                "Password: " + PASSWORD);

            if ((USERNAME === userName) && (PASSWORD === password)) {
                return true;
                var user = app.user;
                app.goToScan();
            }
        }
    });

})(window, jQuery);