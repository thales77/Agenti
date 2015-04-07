/**
 * Created by Babis on 02/04/2015.
 */

//This function handles all the api calls to the remote server
AGENTI.getData = function (data, callback) {

    var queryData = $.extend({}, data, AGENTI.utils.pagination.getProperties()),
        errorHandler = function () {
            navigator.notification.alert('Errore di comunicazione con il server');
        };

    $.ajax({
        type: 'GET',
        beforeSend: function () {
            $.mobile.loading('show');
        }, //Show spinner
        complete: function () {
            $.mobile.loading('hide');
        }, //Hide spinner
        async: "true",
        dataType: 'json',
        data: queryData,
        url: AGENTI.remoteUrl,
        cache: false,
        timeout: 20000,
        success: callback,
        error: errorHandler
    });

};