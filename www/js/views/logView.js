/**
 * Created by Babis on 02/04/2015.
 */


AGENTI.log.renderLog = function (result) {
    /*Variable declaration*******************/
    var html = "";
    /*End of variable declaration************/

    $.each(result, function () {
        html += '<li><p style="font-size:x-small;">' + this.logTimestamp + ' ' + this.logIp + '</p><p style="font-size:x-small;">' + this.logDescr + '</p></li>';
    });

    $('#log').html(html).listview("refresh");
};
