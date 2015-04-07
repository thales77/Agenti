/**
 * Created by Babis on 07/04/2015.
 */

AGENTI.log.getLog = function () {
    /*Variable declaration*******************/
    var that = AGENTI.log,
        userName = AGENTI.db.getItem('username'),
        queryData = {action: 'getLog', user: userName};
    /*End of variable declaration************/

    //get data from the server
    AGENTI.getData(queryData, that.renderLog);

};