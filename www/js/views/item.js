/**
 * Created by Babis on 02/04/2015.
 */

//the item object with its methods
AGENTI.item = {
    //Get the item list from the server in json format
    getItemList: function () {
        /*Variable declaration ***************************/
        var that = AGENTI.item,
            itemSearchString = $.trim($('#itemSearchString').val()),
            client = AGENTI.client,
            fasciaSconto = client.categoriaSconto,
            searchOptionsString = JSON.stringify($('#itemSearchOptions').val()),
            userName = AGENTI.db.getItem('username'),
            queryData = {action: 'searchItem', searchTerm: itemSearchString, fasciaSconto: fasciaSconto, itemSearchOptions: searchOptionsString, user: userName};
        /*End of variable declaration********************/

        if (itemSearchString !== "") {
            //get data from the server
            AGENTI.getData(queryData, that.renderList);
        }
    },

    // function to render the data from the searchItem function
    renderList: function (result) {

        /*Variable declaration*******************/
        var html = "",
            moreBtn = $('#listino .moreBtn').closest('.ui-btn'),
        //Total number of records for the search term entered.
            totalRecords = parseInt(result.numOfRows, 10),
            listaArticoli = $('#listaArticoli');
        /*End of variable declaration************/

        if (typeof result.record !== "undefined") {
            $.each(result.record, function () {

                html += '<li data-codiceArticolo="' + $.trim(this.codiceArticolo) + '" >' +
                '<a href="#">' +
                '<p style="font-style: italic;">' + $.trim(this.codiceArticolo) + '</p>' +
                '<p>' + $.trim(this.fornitoreArticolo) + '</p> <p>Art. ' + $.trim(this.codForn1) + '</p>' +
                '<p style="color:yellow;font-weight:bold;font-style:italic">' + $.trim(this.descrizione) + '</p>' +
                '<span class="ui-li-count">Disp:' + $.trim(this.dispTot) + '</span></a></li>';
            });

            //Update record offset by adding the number of records returned from this specific ajax call
            AGENTI.utils.pagination.addOffset(parseInt(result.record.length, 10));

            //while there are more records show "more" button
            if (totalRecords > (AGENTI.utils.pagination.getOffset())) {
                //show number of remaining records on bubble in the "more results" button
                moreBtn.find('.countBubble').text(totalRecords - AGENTI.utils.pagination.getOffset());
                moreBtn.show();
            } else {
                moreBtn.hide();
            }

        } else {
            html = '<li>Nessun risultato</li>';
        }

        //Append to list and refresh
        listaArticoli.append(html);
        listaArticoli.listview("refresh");
    },
    //Get a single item's details from the server in json format
    getItemDetails: function (id, type) {
        /*Variable declaration*******************/
        var client = AGENTI.client,
            fasciaSconto = client.categoriaSconto,
            scadenzaPromo = "",
            descPromo = "",
            prezzo = "",
            prezzoProm = "",
            prezzoAgenti = "",
            userName = AGENTI.db.getItem('username'),
            item = AGENTI.item,
            queryData = {};

        if (type === "codice") {
            queryData = {action: 'getItemById', codiceArticolo: id, fasciaSconto: fasciaSconto, user: userName};
        } else if (type === "barcode") {
            queryData = {action: 'getItemByBarcode', barcode: id, fasciaSconto: fasciaSconto, user: userName};
        } else {
            return;
        }

        /*End of variable declaration************/

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
    },
    //Function to render the Item details to html
    renderItemDetails: function () {
        /*Variable declaration*******************/
        var item = AGENTI.item;
        /*End of variable declaration************/

        $("#itemsSalesHistory").hide();
        $('#scadenzaPromo').text("");
        $('#prezzoLordo').closest('li').show();

        $('#codiceArticolo').text(item.codiceArticolo);
        $('#descArt').text(item.descArt);
        $('#codForn1').text(item.codForn1);
        $('#codForn2').text(item.codForn2);
        $('#fornitoreArticolo').text(item.fornitoreArticolo);
        $('#dispCa').text(item.dispCa);
        $('#dispCe').text(item.dispCe);
        $('#dispPo').text(item.dispPo);
        $('#prezzoLordo').text(item.prezzoLordo);
        $('#sconto1').text(item.sconto1);
        $('#sconto2').text(item.sconto2);
        $('#Prezzo').text('€' + item.Prezzo);
        $('#PrezzoAgenti').text('€' + item.prezzoAgenti);

        //show the promotional message if the item is in promotion
        $('#promotion').hide();
        $('#PrezzoAgenti').closest('li').hide();

        //show the promotion li if there is a promotional price
        if (item.descPromo !== "") {
            $('#scadenzaPromo').text('In promozione fino: ' + item.scadenzaPromo);
            $('#prezzoLordo').closest('li').hide();
            $('#descPromo').text(item.descPromo);
            $('#promotion').show();
        }

        //show the special agenti price if there is one
        if (item.prezzoAgenti !== null) {
            $('#PrezzoAgenti').closest('li').show();
        }


        //apply jquery mobile formatting
        $('#itemDetailList').listview("refresh");

    },
    //the button to bring up sales history for the item diplayed
    getItemSalesHistory: function () {
        /*Variable declaration*******************/
        var that = AGENTI.item,
            client = AGENTI.client,
            clientId = $.trim(client.codice),
            itemId = that.codiceArticolo,
            userName = AGENTI.db.getItem('username'),
            queryData = {action: 'storicoPrezzi', clientId: clientId, itemId: itemId, user: userName};
        /*End of variable declaration************/

        //get data from the server
        AGENTI.getData(queryData, that.renderItemsSalesHistory);
    },
    // Render the item's sales history under the button
    renderItemsSalesHistory: function (result) {
        /*Variable declaration*******************/
        var html = "";
        /*End of variable declaration************/

        $.each(result, function () {
            html += '<li><p>' + this.dataVendita + ' - ' + this.filialeVendita + ' - ' + this.quantitaVendita + 'pz - <strong>&#8364;' +
            this.prezzoVendita + '</strong></p></li>';
        });

        if (!html) {
            html = "<li style='color:crimson'>Il cliente non ha mai acquistato questo articolo finora</li>";
        }

        //fill itemsSalesHistory ul
        $('#itemsSalesHistory').html(html).listview("refresh").slideToggle('fast');
    }
};