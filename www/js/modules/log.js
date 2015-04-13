/**
 * Created by Babis Boikos on 02/04/2015.
 */
AGENTI.log = (function () {

    var getLog = function (el) {
        /*Variable declaration*******************/
        var userName = AGENTI.db.getItem('username'),
            queryData;
        /*End of variable declaration************/

        queryData = {action: 'getLog', user: userName};
        //get data from the server
        AGENTI.getData(queryData, _renderLog, el);
    };

    var _renderLog = function (data, el) {
        /*Variable declaration*******************/
        var html = "";
        /*End of variable declaration************/

        $.each(data, function () {
            html += '<li><p style="font-size:x-small;">' + this.logTimestamp + ' ' + this.logIp + '</p><p style="font-size:x-small;">' + this.logDescr + '</p></li>';
        });

        $(el).html(html).listview("refresh");
    };

    return {
        getLog: getLog
    }
})();
