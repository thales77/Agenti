/**
 * Created by Babis on 07/04/2015.
 */

//Get the item list from the server in json format
AGENTI.listino.getItemList = function () {
    /*Variable declaration ***************************/
    var self = AGENTI.listino,
        itemSearchString = $.trim($('#itemSearchString').val()),
        client = AGENTI.client,
        fasciaSconto = client.categoriaSconto,
        searchOptionsString = JSON.stringify($('#itemSearchOptions').val()),
        userName = AGENTI.db.getItem('username'),
        queryData = {action: 'searchItem', searchTerm: itemSearchString, fasciaSconto: fasciaSconto, itemSearchOptions: searchOptionsString, user: userName};
    /*End of variable declaration********************/

    if (itemSearchString !== "") {
        //get data from the server
        AGENTI.getData(queryData, self.renderList);
    }
};



//Get a single items's details from the server in json format
AGENTI.listino.getItemDetails  = function (id, type) {
    /*Variable declaration*******************/
    var client = AGENTI.client,
        fasciaSconto = client.categoriaSconto,
        scadenzaPromo = "",
        descPromo = "",
        prezzo = "",
        prezzoProm = "",
        prezzoAgenti = "",
        userName = AGENTI.db.getItem('username'),
        item = AGENTI.listino,
        queryData = {};
    /*End of variable declaration************/


    if (type === "codice") {
        queryData = {action: 'getItemById', codiceArticolo: id, fasciaSconto: fasciaSconto, user: userName};
    } else if (type === "barcode") {
        queryData = {action: 'getItemByBarcode', barcode: id, fasciaSconto: fasciaSconto, user: userName};
    } else {
        return;
    }

    AGENTI.utils.vibrate();

    //get data from the server
    AGENTI.getData(queryData,
        //callback
        function (result) {
            if (result.codiceArticolo) {
                prezzoProm = result.prezzoProm;

                if (prezzoProm === null) {
                    scadenzaPromo = "";
                    descPromo = "";
                    prezzo = result.prezzoNetto;
                    prezzoAgenti = result.PrezzoNettoAgenti;
                } else {
                    scadenzaPromo = result.scadenzaProm;
                    descPromo = result.descProm;
                    prezzo = prezzoProm;
                    prezzoAgenti = result.PrezzoNettoAgenti;
                }

                item.codiceArticolo = $.trim(result.codiceArticolo);
                item.descArt = $.trim(result.descrizione);
                item.fornitoreArticolo = $.trim(result.fornitoreArticolo);
                item.codForn1 = $.trim(result.codForn1);
                item.codForn2 = $.trim(result.codForn2);
                item.dispCa = $.trim(result.dispCa);
                item.dispCe = $.trim(result.dispCe);
                item.dispPo = $.trim(result.dispPo);
                item.prezzoLordo = $.trim(result.prezzoLordo);
                item.sconto1 = $.trim(result.sconto1);
                item.sconto2 = $.trim(result.sconto2);
                item.Prezzo = prezzo;
                item.prezzoAgenti = prezzoAgenti;
                item.descPromo = descPromo;
                item.scadenzaPromo = scadenzaPromo;

                $.mobile.changePage("#itemDetail");
            } else {
                navigator.notification.alert('Articolo non trovato');
            }
        });
};


//handles the button to bring up sales history for the listino diplayed
AGENTI.listino.getItemSalesHistory = function () {
    /*Variable declaration*******************/
    var that = AGENTI.listino,
        client = AGENTI.client,
        clientId = $.trim(client.codice),
        itemId = that.codiceArticolo,
        userName = AGENTI.db.getItem('username'),
        queryData = {action: 'storicoPrezzi', clientId: clientId, itemId: itemId, user: userName};
    /*End of variable declaration************/

    //get data from the server
    AGENTI.getData(queryData, that.renderItemsSalesHistory);
};
