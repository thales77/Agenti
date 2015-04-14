/**
 * Created by Babis Boikos on 02/04/2015.
 *
 * requires: Jquery, app, utils, client
 *
 * exports: getItemList, getItemDetails, getItemSalesHistory, renderItemDetails, prezzo, descArt
 */


AGENTI.listino = (function () {

    var client = AGENTI.client,
        codiceArticolo = "",
        descArt = "",
        fornitoreArticolo = "",
        codForn1 = "",
        codForn2 = "",
        dispCa = "",
        dispCe = "",
        dispPo = "",
        prezzoLordo = "",
        sconto1 = "",
        sconto2 = "",
        prezzo = "",
        prezzoAgenti = "",
        descPromo = "",
        scadenzaPromo = "",
        queryData = {};

    /*MODELS*/

//Get the item list from the server in json format
    var getItemList = function () {
        /*Variable declaration ***************************/
        var itemSearchString = $.trim($('#itemSearchString').val()),
            searchOptionsString = JSON.stringify($('#itemSearchOptions').val());
        /*End of variable declaration********************/


        if (itemSearchString !== "") {

            queryData = {
                action: 'searchItem',
                searchTerm: itemSearchString,
                fasciaSconto: client.categoriaSconto(),
                itemSearchOptions: searchOptionsString,
                user: AGENTI.db.getItem('username')
            };

            //get data from the server
            AGENTI.getData(queryData, _renderList);
        }
    };


//Get a single items's details from the server in json format
    var getItemDetails = function (id, type) {
        /*Variable declaration*******************/
        var prezzoProm = "";
        /*End of variable declaration************/


        if (type === "codice") {
            queryData = {
                action: 'getItemById',
                codiceArticolo: id,
                fasciaSconto: client.categoriaSconto(),
                user: AGENTI.db.getItem('username')
            };
        } else if (type === "barcode") {
            queryData = {
                action: 'getItemByBarcode',
                barcode: id,
                fasciaSconto: client.categoriaSconto(),
                user: AGENTI.db.getItem('username')
            };
        } else {
            return;
        }

        AGENTI.utils.vibrate(AGENTI.deviceType);

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

                    codiceArticolo = $.trim(result.codiceArticolo);
                    descArt = $.trim(result.descrizione);
                    fornitoreArticolo = $.trim(result.fornitoreArticolo);
                    codForn1 = $.trim(result.codForn1);
                    codForn2 = $.trim(result.codForn2);
                    dispCa = $.trim(result.dispCa);
                    dispCe = $.trim(result.dispCe);
                    dispPo = $.trim(result.dispPo);
                    prezzoLordo = $.trim(result.prezzoLordo);
                    sconto1 = $.trim(result.sconto1);
                    sconto2 = $.trim(result.sconto2);


                    $.mobile.changePage("#itemDetail");
                } else {
                    navigator.notification.alert('Articolo non trovato');
                }
            });
    };


//handles the button to bring up sales history for the listino diplayed
    var getItemSalesHistory = function () {

        queryData = {
            action: 'storicoPrezzi',
            clientId: client.codice(),
            itemId: codiceArticolo,
            user: AGENTI.db.getItem('username')
        };

        //get data from the server
        AGENTI.getData(queryData, _renderItemsSalesHistory);
    };

    /*VIEWS*/

// function to render the data from the searchItem function
    var _renderList = function (result) {

        /*Variable declaration*******************/
        var html = "",
            moreBtn = $('#listino .moreBtn').closest('.ui-btn'),
        //Total number of records for the search term entered.
            totalRecords = parseInt(result.numOfRows, 10),
            listaArticoli = $('#listaArticoli');
        /*End of variable declaration************/

        if (typeof result.record !== "undefined") {
            $.each(result.record, function () {

                html += '<li data-codiceArticolo="' + this.codiceArticolo + '" >' +
                '<a href="#">' +
                '<p style="font-style: italic;">' + this.codiceArticolo + '</p>' +
                '<p>' + this.fornitoreArticolo + '</p> <p>Art. ' + this.codForn1 + '</p>' +
                '<p style="color:yellow;font-weight:bold;font-style:italic">' + this.descrizione + '</p>' +
                '<span class="ui-li-count">Disp:' + this.dispTot + '</span></a></li>';
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
    };


//Function to render the Item details to html
    var renderItemDetails = function () {


        $("#itemsSalesHistory").hide();
        $('#scadenzaPromo').text("");
        $('#prezzoLordo').closest('li').show();

        $('#codiceArticolo').text(codiceArticolo);
        $('#descArt').text(descArt);
        $('#codForn1').text(codForn1);
        $('#codForn2').text(codForn2);
        $('#fornitoreArticolo').text(fornitoreArticolo);
        $('#dispCa').text(dispCa);
        $('#dispCe').text(dispCe);
        $('#dispPo').text(dispPo);
        $('#prezzoLordo').text(prezzoLordo);
        $('#sconto1').text(sconto1);
        $('#sconto2').text(sconto2);
        $('#Prezzo').text('€' + prezzo);
        $('#PrezzoAgenti').text('€' + prezzoAgenti);

        //show the promotional message if the listino is in promotion
        $('#promotion').hide();
        $('#PrezzoAgenti').closest('li').hide();

        //show the promotion li if there is a promotional price
        if (descPromo !== "") {
            $('#scadenzaPromo').text('In promozione fino: ' + scadenzaPromo);
            $('#prezzoLordo').closest('li').hide();
            $('#descPromo').text(descPromo);
            $('#promotion').show();
        }

        //show the special agenti price if there is one
        if (prezzoAgenti !== null) {
            $('#PrezzoAgenti').closest('li').show();
        }


        //apply jquery mobile formatting
        $('#itemDetailList').listview("refresh");

    };


// Render the listino's sales history under the button
    var _renderItemsSalesHistory = function (result) {
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
    };

    // private variables for exporting
    var getPrezzo = function () {
        return prezzo;
    };

    var getDescArt = function () {
        return descArt;
    };

    var getCodiceArticolo = function () {
      return codiceArticolo;
    };


    return {
        getItemList: getItemList,
        getItemDetails: getItemDetails,
        getItemSalesHistory: getItemSalesHistory,
        renderItemDetails: renderItemDetails,
        prezzo: getPrezzo,
        descArt: getDescArt,
        codiceArticolo : getCodiceArticolo
    };

})();