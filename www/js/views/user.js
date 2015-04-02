/**
 * Created by Babis on 02/04/2015.
 */
//Handles user login logout
AGENTI.user = {
    //checks username and password against server database
    login: function () {
        /*Variable declaration*******************/
        var form = $('#loginForm').serialize();
        /*End of variable declaration************/

        //disable the button so we can't resubmit while we wait
        $("#loginBtn").attr("disabled", "disabled");
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: AGENTI.remoteUrl,
            data: form,
            dataType: 'json',
            timeout: 8000,
            success: function (result) {
                if (result.status === 'ok') {
                    AGENTI.db.setItem("username", $("#loginForm #username").val());
                    AGENTI.db.setItem("password", $("#loginForm #password").val());
                    AGENTI.db.setItem("full_name", result.full_name);
                    AGENTI.db.setItem("email", result.email);
                    AGENTI.db.setItem("usertype", result.usertype);
                    AGENTI.db.setItem("idAgente", result.idAgente);
                    //Go to main screen
                    $.mobile.changePage("#home");
                    //Change the name in the main screen welcome message
                    $('#nomeUtente').text(AGENTI.db.getItem('username'));

                    //If the user is admin, give him extra menu items
                    if (result.usertype !== 'admin') {

                        //remove all admin elements
                        $('.admin').hide();
                    } else {
                        $('.admin').show();
                    }
                    console.log("Login success!");
                } else {
                    $.mobile.loading('hide');
                    navigator.notification.alert("Utente/password errato");
                    console.log(result.status);
                }
            },
            error: function () {
                $.mobile.loading('hide');
                navigator.notification.alert('Impossibile comunicare con il server');
            }
        });
        $("#loginBtn").removeAttr("disabled");
    },
    //deletes the locally stored username and password
    logout: function () {
        AGENTI.db.clear();
        if (AGENTI.deviceType === 'Android') {
            navigator.app.exitApp();
        } else {
            $.mobile.changePage('#loginPage');
        }
        console.log('logout succesful');
    }
};
