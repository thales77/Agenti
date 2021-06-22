/**
 * Created by Babis on 02/04/2015.
 */

//This function handles all the api calls to the remote server
AGENTI.getData = function (query, callback, el) {

    var queryData;
    var data = "";

    queryData = $.extend({}, query, AGENTI.utils.pagination.getProperties());


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
        timeout: 20000
    })

        .done(
        function (result) {
            data = result;
            if (el) {
                callback(data, el);
            }
            else {
                callback(data);
            }

        })

        .fail(function (xhr) {
            switch (xhr.status) {
                case 404:
                    navigator.notification.alert(xhr.status + ' Non trovato');
                    break;

                /* add cases accordingly*/

                default:
                    navigator.notification.alert(xhr.status + ' Errore di comunicazione con il server');
            }

        });

};