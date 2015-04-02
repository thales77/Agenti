/**
 * Created by Babis on 02/04/2015.
 */

AGENTI.log = {
    getLog: function () {
        /*Variable declaration*******************/
        var that = AGENTI.log,
            userName = AGENTI.db.getItem('username'),
            queryData = {action: 'getLog', user: userName};
        /*End of variable declaration************/

        //get data from the server
        AGENTI.getData(queryData, that.renderLog);

    },
    renderLog: function (result) {
        /*Variable declaration*******************/
        var html = "";
        /*End of variable declaration************/

        $.each(result, function () {
            html += '<li><p style="font-size:x-small;">' + this.logTimestamp + ' ' + this.logIp + '</p><p style="font-size:x-small;">' + this.logDescr + '</p></li>';
        });

        $('#log').html(html).listview("refresh");
    }
};
