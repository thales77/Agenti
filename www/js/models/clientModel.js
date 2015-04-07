/**
 * Created by Babis on 07/04/2015.
 */


//function to get the client list in json format from the server
AGENTI.client.getClientList = function () {
    var self = AGENTI.client,
        searchString = $.trim($('#searchTerm').val()), //String to search for in server
        clientOptionString = JSON.stringify($('#clientSearchOptions').val()),//json.stringify this to pass search options to server via json
        userName = AGENTI.db.getItem('username'),
        queryData = {action: 'searchClient', searchTerm: searchString, clientSearchOptions: clientOptionString, user: userName};

    if (searchString !== "") {
        //get Client list from remote server
        //make ajax call
        AGENTI.getData(queryData, self.renderList);
    }
};

// get the client's recent sales history
AGENTI.client.getSalesHistory = function () {
    if ((AGENTI.client.historyShown !== 'true') || (AGENTI.utils.pagination.getOffset() > 0)) {
        /*Variable declaration ***************************/
        var self = AGENTI.client,
            client = AGENTI.client,
            codCliente = client.codice,
            userName = AGENTI.db.getItem('username'),
            queryData = {action: 'ultimiAcquisti', clientId: codCliente, user: userName};
        /*End of variable declaration********************/

        //get data from the server
        AGENTI.getData(queryData, self.renderSalesHistory);

    }
};

//Get the client's most important recent sales
AGENTI.client.getMajorSalesHistory = function () {
    if ((AGENTI.client.majorHistoryShown !== 'true') || (AGENTI.utils.pagination.getOffset() > 0)) {
        /*Variable declaration ***************************/
        var that = AGENTI.client,
            client = AGENTI.client,
            codCliente = client.codice,
            userName = AGENTI.db.getItem('username'),
            queryData = {action: 'aqcuistiMaggiori', clientId: codCliente, user: userName};
        /*End of variable declaration********************/

        //get data from the server
        AGENTI.getData(queryData, that.renderMajorSalesHistory);
    }
};
