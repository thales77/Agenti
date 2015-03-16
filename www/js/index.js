var AGENTI = {
    //Server ip
    remoteUrl: "http://85.33.180.83/test/phonegapsrv/index.php",
    //test  urls
    //remoteUrl : "http://192.168.0.245/test/phonegapsrv/index.php",
    //remoteUrl : "http://localhost/index.php",
    //Check device type
    deviceType: "",
    appVersion: "",
    db: localStorage,
    getData: function (data, callback) {
        var queryData = $.extend({}, data, AGENTI.pagination.getProperties());

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
            error: AGENTI.errorHandler
        });
    },
    errorHandler: function () {
        navigator.notification.alert('Errore di comunicazione con il server');
    }
};

//Pagination module
AGENTI.pagination = (function () {
    //Private variables
    var noRecordsPerPage = 20,
        offset = 0;
    return {
        //Public methods
        addOffset: function (listOffset) {
            offset = offset + parseInt(listOffset, 10);
        },
        resetOffset: function () {
            offset = 0;
        },
        getOffset: function () {
            return offset;
        },
        setRecordsPerPage: function (recordsPerPage) {
            noRecordsPerPage = parseInt(recordsPerPage, 10);
        },
        getProperties: function () {
            return {
                listOffset: offset,
                perPage: noRecordsPerPage
            };
        }
    };
}());

//the client object with its methods
AGENTI.client = {
    //function to get the client list in json format from the server
    getClientList: function () {
        var that = AGENTI.client,
            searchString = $.trim($('#searchTerm').val()), //String to search for in server
            clientOptionString = JSON.stringify($('#clientSearchOptions').val()),//json.stringify this to pass search options to server via json
            userName = AGENTI.db.getItem('username'),
            queryData = {action: 'searchClient', searchTerm: searchString, clientSearchOptions: clientOptionString, user: userName};

        if (searchString !== "") {
            //get Client list from remote server
            //make ajax call
            AGENTI.getData(queryData, that.renderList);
        }
    },


    //function to render the client list in a ul
    renderList: function (result) {

        /*Variable declaration******************/
        var html = "",
        //Jquery selector caching
            clientList = $('#clientList'),
            moreBtn = $('#clienti').find('.moreBtn').closest('.ui-btn'),
        //Total number of records for the search term entered.
            totalRecords = parseInt(result.numOfRows, 10);
        /*End of variable declaration************/

        if (typeof result.record !== "undefined") {
            $.each(result.record, function () {
                /// Construct html for each <li> and embed html5 'data' attributes for passing to next page on tap
                html += '<li data-codice="' + $.trim(this.codice) +
                    '" data-ragSociale="' + $.trim(this.ragSociale) +
                    '" data-indirizzo="' + $.trim(this.indirizzo) + ' ' +
                    '" data-indirizzo2="' + $.trim(this.comune) + ' ' + $.trim(this.cap) + ' ' + $.trim(this.provincia) +
                    '" data-indirizziAlt="' + $.trim(this.indirizziAlt) +
                    '" data-parIva="' + $.trim(this.parIva) +
                    '" data-categoriaSconto="' + $.trim(this.categoriaSconto) +
                    '" data-noTelefono="' + this.noTelefono +
                    '" data-noCell="' + this.noCell +
                    '" data-noFax="' + this.noFax +
                    '" data-email="' + this.email +
                    '" data-fattCorrente="' + $.trim(this.fattCorrente) +
                    '" data-fattPrecedente="' + $.trim(this.fattPrecedente) +
                    '" data-saldoProfessional="' + this.saldoProfessional +
                    '" data-SaldoService="' + this.saldoService +
                    '" data-SaldoSpa="' + $.trim('n/d') +
                    '" data-stato="' + $.trim(this.stato) +
                    '" data-pagamento="' + $.trim(this.pagamento) +
                    '" >'
                    + '<a href="#">'
                    + '<p style="font-style:italic;">' + $.trim(this.codice) + '</p>'
                    + '<p style="font-weight:bold;color:yellow">' + $.trim(this.ragSociale) + '</p>'
                    + '<p>' + $.trim(this.indirizzo) + ', ' + $.trim(this.comune) + ' ' + $.trim(this.cap) + ' ' + $.trim(this.provincia) + '</p></a></li>';

            });

            //Update record offset by adding the number of records returned from this specific ajax call
            AGENTI.pagination.addOffset(parseInt(result.record.length, 10));

            //while there are more records show "more" button
            if (totalRecords > (AGENTI.pagination.getOffset())) {
                //show number of remaining records on bubble in the "more results" button
                moreBtn.find('.countBubble').text(totalRecords - AGENTI.pagination.getOffset());
                moreBtn.show();
            } else {
                moreBtn.hide();
            }
        } else {
            html = '<li>Nessun risultato</li>';
        }

        //Append to list and refresh
        clientList.append(html);
        clientList.listview("refresh");
    },
    //function for passing data to client detail page
    selectClient: function (e) {
        /*Variable declaration *********************/
        var client = AGENTI.client;
        /*End of variable declaration***************/

        AGENTI.utils.vibrate();

        client.codice = $(this).attr('data-codice');
        client.ragSociale = $(this).attr('data-ragSociale');
        client.indirizzo = $(this).attr('data-indirizzo');
        client.indirizzo2 = $(this).attr('data-indirizzo2');
        client.indirizziAlt = $(this).attr('data-indirizziAlt');
        client.parIva = $(this).attr('data-parIva');
        client.categoriaSconto = $(this).attr('data-categoriaSconto');
        client.noTelefono = $(this).attr('data-noTelefono');
        client.noCell = $(this).attr('data-noCell');
        client.noFax = $(this).attr('data-noFax');
        client.email = $(this).attr('data-email');
        client.fattCorrente = $(this).attr('data-fattCorrente');
        client.fattPrecedente = $(this).attr('data-fattPrecedente');
        client.saldoProfessional = $(this).attr('data-saldoProfessional');
        client.SaldoService = $(this).attr('data-SaldoService');
        client.SaldoSpa = $(this).attr('data-SaldoSpa');
        client.stato = $(this).attr('data-stato');
        client.pagamento = $(this).attr('data-pagamento');
        $.mobile.changePage("#clientDetail", { transition: "flip"});
        e.preventDefault();
    },
    //function to render the Client detail information in the client detail page
    renderClientDetails: function () {
        /*Variable declaration *********************/
        var html = "",
            currentYear = Date.today().getFullYear(),
            lastYear = Date.today().getFullYear() - 1,
            client = AGENTI.client,
            numStatoCliente = client.stato,
            statoCliente = "",
            clientDetailList = $('#clientDetailList'),
            indirizziAlt = [],//array of objects, holding client's alternative addresses
            arrayLength = "", //length of previous array for caching
            indirizzoAlt = {}; //Object to hold each alternative address' properties
        /*End of variable declaration***************/

        client.historyShown = 'false';
        client.majorHistoryShown = 'false';

        //Change stato cliente to a meaningful description

        if (numStatoCliente === '-2') {
            statoCliente = "<span style='color:crimson;'>Bloccato</span>";
            AGENTI.utils.blockedClientPopup();
            $('#clientBlocked').find('#stato').html(statoCliente);
        } else if (numStatoCliente === '-1') {
            statoCliente = "<span style='color:crimson;'>Contenzioso</span>";
            AGENTI.utils.blockedClientPopup();
            $('#clientBlocked').find('#stato').html(statoCliente);
        } else if (numStatoCliente === '0') {
            statoCliente = "Attivo";
        }

        html += '<li><p>' + client.codice + '</p><h4>' + client.ragSociale + '</h4>' + '<p>P.Iva: ' + client.parIva + '</p></li>' + '<li class="mapLink" data-address="' + client.indirizzo + client.indirizzo2 + ', ITALIA"><a href="#"><p>' + client.indirizzo + '</p><p>' + client.indirizzo2 + '</p></a></li>';

        //don't render these if null
        //Check if client has alternative addresses and render them
        if (client.indirizziAlt !== '') {

            indirizziAlt = AGENTI.utils.parseAltAddress(client.indirizziAlt);
            arrayLength = indirizziAlt.length;

            for (var i = 0; i < arrayLength; i++) {

                indirizzoAlt = indirizziAlt[i];

                html += '<li class="mapLink" data-address="' + indirizzoAlt.address + '"><a href="#"><p style="white-space: normal;">' + indirizzoAlt.addressType + ': ' + indirizzoAlt.address +'</p></a></li>';
            }
        }

        if (client.categoriaSconto !== 'null') {
            html += '<li><p>Categoria: ' + client.categoriaSconto + '</p></li>';
        }

        if (client.noTelefono !== 'null') {
            html += '<li><a href="tel:' + client.noTelefono + '"><p>Tel: ' + client.noTelefono + '</p></a></li>';
        }

        if (client.noCell !== 'null') {
            html += '<li><a href="tel:' + client.noCell + '"><p>Cell: ' + client.noCell + '</p></a></li>';
        }

        if (client.noFax !== 'null') {
            html += '<li><p>Fax: ' + client.noFax + '</p></li>';
        }

        if (client.email !== 'null') {
            html += '<li><a href="mailto:' + client.email + '"><p>Email: ' + client.email + '</p></a></li>';
        }

        html += '<li><p>Fatturato  ' + currentYear + ': &#8364;' + client.fattCorrente + '</p>' + '<p>Fatturato  ' + lastYear + ': &#8364;' + client.fattPrecedente + '</p></li>';

        if (client.saldoProfessional !== 'null') {
            html += '<li><p>Saldo Professional: &#8364;' + client.saldoProfessional + '</p>';
        } else {
            html += '<li><p>Saldo Professional: &#8364;0,00</p>';
        }

        if (client.SaldoService !== 'null') {
            html += '<p>Saldo Service: &#8364;' + client.SaldoService + '</p>';
        } else {
            html += '<p>Saldo Service: &#8364;0,00</p>';
        }

        if (client.SaldoSpa !== 'null') {
            html += '<p>Saldo spa: &#8364;' + client.SaldoSpa + '</p></li>';
        } else {
            html += '<p>Saldo spa: &#8364;0,00</p></li>';
        }

        html += '<li><p>Pagamento: ' + client.pagamento + '</p></li><li><p>Stato cliente: ' + statoCliente + '</p></li>';

        clientDetailList.html(html);
        clientDetailList.listview("refresh");

        //set the page title to the client's name
        $('clientDetail').find('h5').html(client.ragSociale);

        //bind click on address to open map in client detail page
        clientDetailList.on('tap', '.mapLink', function () {
            AGENTI.utils.openMap($(this).attr('data-address'));
        });
    },
    // get the client's recent sales history
    getSalesHistory: function () {
        if ((AGENTI.client.historyShown !== 'true') || (AGENTI.pagination.getOffset() > 0)) {
            /*Variable declaration ***************************/
            var that = AGENTI.client,
                client = AGENTI.client,
                codCliente = client.codice,
                userName = AGENTI.db.getItem('username'),
                queryData = {action: 'ultimiAcquisti', clientId: codCliente, user: userName};
            /*End of variable declaration********************/

            //get data from the server
            AGENTI.getData(queryData, that.renderSalesHistory);

        }
    },
    // render the client's recent sales history
    renderSalesHistory: function (result) {
        /*Variable declaration ***************************/
        var html = "",
            prevMonth = "",
            curMonth = "",
            curDate = "",
            curTextMonth = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
            curYear = "",
            moreBtn = $('#clientSalesHistory .moreBtn').closest('.ui-btn'),
        //Total number of records returned.
            totalRecords = parseInt(result.numOfRows, 10);
        /*End of variable declaration********************/


        if (typeof result.record !== "undefined") {
            $.each(result.record, function () {
                curDate = Date.parseExact(this.dataVendita, "d-MM-yyyy");
                curMonth = curDate.getMonth();
                curYear = curDate.getFullYear();

                if (prevMonth !== curMonth) {
                    html += '<li data-role="list-divider">' + curTextMonth[curMonth] + ' ' + curYear + '</li>';
                }
                prevMonth = curMonth;

                html += '<li data-codiceArticolo="' + this.codiceArticolo + '"><a href="#"><p style="font-size:small;">' + this.dataVendita + ' - Art: ' +
                    this.codiceArticolo + '</p><p style="font-size:small;font-weight:bold;font-style:italic;color:yellow"> ' + this.DescArt +
                    '</p><p style="font-size:small;">Qta: ' + this.quantitaVendita + ' - Prezzo: <strong>&#8364;' + this.prezzoVendita +
                    '</strong></p></a></li>';
            });

            //Update record offset by adding the number of records returned from this specific ajax call
            AGENTI.pagination.addOffset(parseInt(result.record.length, 10));

            //while there are more records show "more" button
            if (totalRecords > (AGENTI.pagination.getOffset())) {
                //show number of remaining records on bubble in the "more results" button
                moreBtn.find('.countBubble').text(totalRecords - AGENTI.pagination.getOffset());
                moreBtn.show();
            } else {
                moreBtn.hide();
            }

        } else {
            html = '<li>Nessun risultato</li>';
        }

        AGENTI.client.historyShown = 'true';
        $('#history').append(html).listview("refresh");
    },


    //Get the client's most important recent sales  
    getMajorSalesHistory: function () {
        if ((AGENTI.client.majorHistoryShown !== 'true') || (AGENTI.pagination.getOffset() > 0)) {
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
    },

    //render the client's recent major sales history
    renderMajorSalesHistory: function (result) {
        /*Variable declaration ***************************/
        var html = "",
            moreBtn = $('#majorSalesHistory .moreBtn').closest('.ui-btn'),
        //Total number of records returned.
            totalRecords = parseInt(result.numOfRows, 10);
        /*End of variable declaration********************/

        if (typeof result.record !== "undefined") {
            $.each(result.record, function () {
                html += '<li data-codiceArticolo="' + this.codiceArticolo + '"><a href="#"><p style="font-size:small; font-style: italic;">' + this.codiceArticolo + '</p><p style="color:yellow;font-weight:bold"> ' + this.DescArt +
                    '</p><p style="font-size:small;">Qta: ' + this.quantitaVendita + ' - Prezzo medio: &#8364;' + this.prezzoMedio + '</p>' +
                    '<p style="font-size:small;">Ha speso: <span style="color: crimson; font-weight: bold;">&#8364;' + this.valoreReale + '</span></p></a></li>';
            });

            //Update record offset by adding the number of records returned from this specific ajax call
            AGENTI.pagination.addOffset(parseInt(result.record.length, 10));

            //while there are more records show "more" button
            if (totalRecords > (AGENTI.pagination.getOffset())) {
                //show number of remaining records on bubble in the "more results" button
                moreBtn.find('.countBubble').text(totalRecords - AGENTI.pagination.getOffset());
                moreBtn.show();
            } else {
                moreBtn.hide();
            }

        } else {
            html = '<li>Nessun risultato</li>';
        }

        AGENTI.client.majorHistoryShown = 'true';
        $('#mainSalesList').append(html).listview("refresh");
    }

};


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
            AGENTI.pagination.addOffset(parseInt(result.record.length, 10));

            //while there are more records show "more" button
            if (totalRecords > (AGENTI.pagination.getOffset())) {
                //show number of remaining records on bubble in the "more results" button
                moreBtn.find('.countBubble').text(totalRecords - AGENTI.pagination.getOffset());
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

AGENTI.offerta = {
    header: {},
    detail: [],

    addItemToOfferta: function (itemId, itemDesc, qty, prezzo) {
        var offertaDetail = AGENTI.offerta.detail;

            offertaDetail.push({
                itemId : itemId,
                itemDesc : itemDesc,
                qty : qty,
                prezzo : prezzo

        });
        $( "#popupOfferta" ).popup( "close" );
        //navigator.notification.alert("articolo aggiunto all' offerta");
    },

    renderOffertaDetail: function () {
        /*Variable declaration*******************/
        var i = 0,
            offerta = AGENTI.offerta;
        /*End of variable declaration************/

        $('#offertaDetail').find('h5').text('Offerta a ' + AGENTI.client.ragSociale);
        $.each(offerta.detail, function () {
            i += 1;
            $('#offertaTable tbody').append('<tr><th></th><td>' + this.itemId + '</td><td style=" font-weight: bold">' + this.itemDesc + '</td>\n\
            <td>' + this.qty + '</td><td>' + this.prezzo + '</td></tr>');
        });

        $('#offertaTable').table("refresh");
    },

    checkIsInserted: function (e) {



        var offertaDetail = AGENTI.offerta.detail;

        if (offertaDetail.length !== 0) {

            AGENTI.utils.vibrate();
            navigator.notification.confirm(
                "C'è un' offerta inserita per questo cliente, come vuoi procedere?", // message
                AGENTI.offerta.deleteCurrent,            // callback to invoke with index of button pressed
                'Attenzione',           // title
                ['Elimina offerta', 'Annulla']         // buttonLabels
            );
        } else {
            $.mobile.changePage('#clienti');
        }
        if(e) {
            e.preventDefault();
        }

    },

    deleteCurrent: function (buttonIndex) {


        if (buttonIndex === 1) {
            AGENTI.offerta.detail.length = 0; //empty offerta detail array
            AGENTI.offerta.header = null; //empty offerta header obj
            $('#offertaTable tbody').empty(); // empty table in offerta detail page


            navigator.notification.alert('Offerta cancellata');
            $.mobile.changePage( "#clienti", { transition: "flip"});
        }

    },

    inviaOfferta: function () {
        var offerta = AGENTI.offerta,
        /*      emailProperties = { to: AGENTI.client.email,
                cc: 'g.marra@siderprofessional.com',
                subject: 'Offerta Sidercampania Professional srl ',
                isHtml:  true} Disabled for testing*/
            emailProperties = { to: 'xboikos@gmail.com',
                subject: 'Offerta Sidercampania Professional srl ',
                isHtml:  true},
            tableData = [],
            columns = [],
            options = {},
            totaleRiga = 0,
            height = 180;


        //FIRST GENERATE THE PDF DOCUMENT
        offerta.pdfFileName = 'offerta.pdf';

        console.log("generating pdf...");
        var doc = new jsPDF('p', 'pt', 'a4');

        doc.setFontSize(20);
        doc.setFontType("bold");
        doc.text(20, 50, 'Sidercampania Professional srl');

        doc.setFontSize(12);
        doc.setFontType("normal");
        doc.text(20, 65, 'Offerta commerciale');

        doc.setFontSize(10);
        doc.text(20, 80, 'Spett.le: ' + AGENTI.client.ragSociale);
        doc.text(20, 95, AGENTI.client.indirizzo);
        doc.text(20, 110, AGENTI.client.indirizzo2);

        options = {
            padding: 3, // Vertical cell padding
            fontSize: 10,
            lineHeight: 15,
            renderCell: function (x, y, w, h, txt, fillColor, options) {
                doc.setFillColor.apply(this, fillColor);
                doc.rect(x, y, w, h, 'F');
                doc.text(txt, x + options.padding, y + doc.internal.getLineHeight());
            },
            margins: { horizontal: 20, top: 130, bottom: 40 }, // How much space around the table
            extendWidth: true // If true, the table will span 100% of page width minus horizontal margins.
        };

        columns = [
            {title: "Codice", key: "codice"},
            {title: "Descrizione", key: "descrizione"},
            {title: "Qta", key: "qta"},
            {title: "Prezzo", key: "prezzo"},
            {title: "Totale", key: "totale"}
        ];

        offerta.header.totaleOfferta = 0;

        $.each(offerta.detail, function () {

            //ugly as fuck replaces strings with floats to perform in order to sum, also sunstitutes comas with dots.
            totaleRiga = (parseFloat(this.qty.replace(/,/g , "."))) * (parseFloat(this.prezzo.replace(/,/g , ".")));
            offerta.header.totaleOfferta = offerta.header.totaleOfferta  + totaleRiga; //summing the grand total of the offerta

            tableData.push({
                "codice": this.itemId,
                "descrizione": this.itemDesc,
                "qta": this.qty,
                "prezzo": this.prezzo,
                "totale": totaleRiga.toFixed(2).replace(/\./g , ",") //change into string again and replace dots with comas
            });
            height = height + 20;
        });

        doc.autoTable(columns, tableData, options);
        //height = doc.drawTable(tableData, {xstart:15,ystart:20,tablestart:50,marginleft:50, xOffset:5, yOffset:5});

        doc.setFontType("bolditalic");
        doc.setFontSize(12);
        doc.text(400, height, 'Totale offerta: ' +  offerta.header.totaleOfferta.toFixed(2).replace(/\./g , ",") + ' +IVA');

        doc.setFontType("bolditalic");
        doc.setFontSize(10);
        doc.text(20, height + 30, 'La Sidercampania Professional srl non e responsabile per eventuali ritardi di consegna del materiale, dovuta ');
        doc.text(20, height + 45, 'ai nostri fornitori ed il loro ciclo di produzione e trasporto.');
        doc.text(20, height + 70, 'Validita\' offerta 15gg');

        doc.setFontType("normal");
        doc.text(20, height + 85, 'Nominativo addetto: ' +  AGENTI.db.getItem('full_name'));

        var pdfOutput = doc.output();
        console.log( pdfOutput );

        function pdfSave (name, data, success, fail) {

            var gotFileSystem = function (fileSystem) {

                offerta.pdfFilePath = fileSystem.root.nativeURL;

                fileSystem.root.getFile(name, { create: true, exclusive: false }, gotFileEntry, fail);
            };

            var gotFileEntry = function (fileEntry) {
                fileEntry.createWriter(gotFileWriter, fail);
            };

            var gotFileWriter = function (writer) {
                writer.onwrite = success;
                writer.onerror = fail;
                writer.write(data);
            };

            window.requestFileSystem(window.LocalFileSystem.PERSISTENT, data.length || 0, gotFileSystem, fail);
        }

        pdfSave(offerta.pdfFileName, pdfOutput, function () {
            // success! - generate email body
            emailProperties.body = Date.today().toString("dd-MM-yyyy") + '<h3>Spettabile cliente ' + AGENTI.client.ragSociale + '</h3>'+
                                    '<p>A seguito Vs. richiesta inviamo in allegato la ns. migliore offerta relativa agli articoli specificati.<br>' +
                                    'Attendiamo Vs. conferma per procedere con l&apos;evasione dell&apos;ordine.</p>' +
                                    '<p>Distini saluti,<br>' + AGENTI.db.getItem('full_name') + '<br>Sidercampania Professional srl<br>' +
                                    'tel. 0817580177<br>Fax 0815405590</p>';



            emailProperties.attachments = offerta.pdfFilePath + offerta.pdfFileName;

            cordova.plugins.email.open(emailProperties,function () {
                //navigator.notification.alert('invio annullato'); //fix this, it always executes his part
            }, this);





        }, function (error) {
            // handle error
            console.log(error);
            navigator.notification.alert(error);
        });

    }

};

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


AGENTI.order = {
    //get the list of orders for a specific agent        
    getOrderList: function () {
        /*Variable declaration*******************/
        var that = AGENTI.order,
            orderDateFrom = Date.parseExact($('#DateFrom').val(), 'dd-MM-yyyy').toString("yyyy-MM-dd"),
            orderDateTo = Date.parseExact($('#DateTo').val(), 'dd-MM-yyyy').toString("yyyy-MM-dd"),
            idAgente = AGENTI.db.getItem('idAgente'),
            userName = AGENTI.db.getItem('username'),
            queryData = {action: 'getOrderList', datefrom: orderDateFrom, dateto: orderDateTo, idAgente: idAgente, user: userName};
        /*End of variable declaration************/

        //get data from the server
        AGENTI.getData(queryData, that.renderOrderList);

    },
    //render the orders list in html
    renderOrderList: function (result) {
        /*Variable declaration*******************/
        var html = "",
            prevMonth = "",
            curMonth = "",
            curDate = "",
            curTextMonth = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
            curYear = "",
            statoOrdine = "";
        /*End of variable declaration************/

        $.each(result, function () {
            switch (this.stato) {
                case "O":
                    statoOrdine = "Offerta";
                    break;
                case "S":
                    statoOrdine = "Sospesa";
                    break;
                case "C":
                    statoOrdine = "Confermata";
                    break;
                case "F":
                    statoOrdine = "Fatturata";
                    break;
                case "E":
                    statoOrdine = "Evasa";
                    break;
                default:
                    statoOrdine = "";
            }

            curDate = Date.parse(this.dataRegist);
            curMonth = curDate.getMonth();
            curYear = curDate.getFullYear();

            if (prevMonth !== curMonth) {
                if (prevMonth !== "") {
                    html += '</ul></div>';
                }
                html += '<div class="month" data-role="collapsible" data-collapsed="true" data-theme="a" data-inset="true" ><h3>' + curTextMonth[curMonth] + ' ' + curYear + '</h3>';
                html += '<ul class="orderList" data-role="listview" data-theme="b">';

            }
            prevMonth = curMonth;

            html += '<li data-orderId="' + this.orderId + '"><a href="#"><p style="font-size:small;">' + curDate.toString("d-M-yyyy") + ' - No: ' + this.numDoc + ' - ' + this.descAgente +'</p>\n\
                         <p style="color:yellow;font-weight:bold;font-style:italic">' + this.codCliente + ' - ' + this.desCli + '</p>\n\
                         <p style="font-size:small;">Totale: €<span style="font-weight:bold;font-style:italic">' + this.totImp + '</span> + IVA - ' + statoOrdine + '</p></a></li>';
        });
        html += '</ul></div>';

        $('#orderListContainer').append(html);
        $('.month').collapsible({refresh: true});
        $('.orderList').listview({refresh: true});
    },


    //get the details for the order clicked in the list
    getOrderDetail: function (id) {
        /*Variable declaration*******************/
        var that = AGENTI.order,
            username = AGENTI.db.getItem('username'),
            queryData = {action: 'getOrderDetail', orderId: id, user: username};
        /*End of variable declaration************/
        AGENTI.order.id = id;


        //get data from the server       
        AGENTI.getData(queryData, that.renderOrderDetail);
    },

    renderOrderDetail: function (result) {
        /*Variable declaration*******************/
        var i = 0;
        /*End of variable declaration************/

        $('#ordiniDetail').find('h5').text('Ordine No ' + AGENTI.order.id);
        $.each(result, function () {
            i += 1;
            $('#orderItemTable  tbody').append('<tr><th>' + i + '</th><td>' + this.codArt + '</td><td style=" font-weight: bold">' + this.descArt + '</td>\n\
            <td>' + this.qta + '</td><td>' + this.quantSped + '</td><td>' + this.quantRes + ' </td><td style="font-weight: bold"> €' + this.prezzoNetto + '</td></tr>');
        });

        $('#orderItemTable').table("refresh");
    }
};


//Handles user login logout
AGENTI.user = {
    //checks username and password against server database        
    login: function () {
        /*Variable declaration*******************/
        var form = $('#loginForm').serialize();
        /*End of variable declaration************/

        //disable the button so we can't resubmit while we wait
        $("#loginBtn").attr("disabled", "disabled");
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: AGENTI.remoteUrl,
            data: form,
            dataType: 'json',
            timeout: 8000,
            success: function (result) {
                if (result.status === 'ok') {
                    AGENTI.db.setItem("username", $("#loginForm #username").val());
                    AGENTI.db.setItem("password", $("#loginForm #password").val());
                    AGENTI.db.setItem("full_name", result.full_name);
                    AGENTI.db.setItem("usertype", result.usertype);
                    AGENTI.db.setItem("idAgente", result.idAgente);
                    //Go to main screen
                    $.mobile.changePage("#home");
                    //Change the name in the main screen welcome message
                    $('#nomeUtente').text(AGENTI.db.getItem('username'));

                    //If the user is admin, give him extra menu items
                    if (result.usertype !== 'admin') {

                        //remove all admin elements
                        $('.admin').hide();
                    } else {
                        $('.admin').show();
                    }
                    console.log("Login success!");
                } else {
                    $.mobile.loading('hide');
                    navigator.notification.alert("Utente/password errato");
                    console.log(result.status);
                }
            },
            error: function () {
                $.mobile.loading('hide');
                navigator.notification.alert('Impossibile comunicare con il server');
            }
        });
        $("#loginBtn").removeAttr("disabled");
    },
    //deletes the locally stored username and password
    logout: function () {
        AGENTI.db.clear();
        if (AGENTI.deviceType === 'Android') {
            navigator.app.exitApp();
        } else {
            $.mobile.changePage('#loginPage');
        }
        console.log('logout succesful');
    }
};


AGENTI.utils = {

    // pop-up for blocked clients
    blockedClientPopup: function () {
        //Check if the popup has not been shown already
        if (AGENTI.client.popUpShown !== 'true') {
            //set popup to shown
            AGENTI.client.popUpShown = 'true';
            setTimeout(function () {
                $('#clientBlocked').popup({
                    history: false
                });
                $('#clientBlocked').popup('open');
                //navigator.notification.beep(1);
                navigator.notification.vibrate(1000);
            }, 1000);
        }
    },
    //Open the map in native maps app
    //add blackberry support?
    openMap: function (address) {
        if (AGENTI.deviceType === 'Android') {
            window.location = "geo:0,0?q=" + address;
        } else {
            window.location = "maps:q=" + address;
        }
    },

    //parse the alternative addresses array string as returned by the server and split in separate records.
    parseAltAddress: function(string) {

        var altAddress = {};
        var addressesArray =[];

        var addressesTempArray = string.split(';');
        var arrayLength = addressesTempArray.length;
        var addressType = "";

        for (var i=0; i < arrayLength; i++){

            switch (addressesTempArray[i].substr(0,1)) {
                case "M":
                    addressType = "Magazzino";
                    break;
                case "F":
                    addressType = "Fatturazione";
                    break;
                case "E":
                    addressType = "Entrambi";
                    break;
                case "A":
                    addressType = "Altro";
                    break;
                default:
                    addressType = "";
            }

            addressesArray.push({

                addressType : addressType,
                address : addressesTempArray[i].substr(2)

            });
        }
    return addressesArray;
    },

    createContact: function () {

        // create a new contact
        var contact = navigator.contacts.create();
        contact.displayName =  AGENTI.client.ragSociale;
        contact.nickname =  AGENTI.client.ragSociale;

        // populate some fields
        var name = new ContactName();
        name.givenName = AGENTI.client.ragSociale;
        contact.name = name;

        // store contact phone numbers in ContactField[]
        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('work', AGENTI.client.noTelefono, true);
        phoneNumbers[1] = new ContactField('mobile', AGENTI.client.noCell, false);
        contact.phoneNumbers = phoneNumbers;

        // store contact emails in ContactField[]
        var emails = [];
        emails[0] = new ContactField('work', AGENTI.client.email, true);
        contact.emails = emails;
        /*
        var address = new ContactAddress();
        address.formatted = AGENTI.client.indirizzo + " " + AGENTI.client.indirizzo2;
        address.type = 'work';
        address.pref = true;
        contact.address = address;*/

        // save the contact
        contact.save(onSuccess,onError);

        function onSuccess(contact) {
            navigator.notification.alert("Contatto aggiunto nella rubrica del telefono");
        };

        function onError(contactError) {
            navigator.notification.alert("Errore di salvataggio  = " + contactError.code);
        };


    },

    vibrate: function (){
        //shake it baby
        if (AGENTI.deviceType === 'Android') {
            //this doesn't work well in ios
            navigator.notification.vibrate(10);
        }
    }

};


//Initialise the app setup UI event bindings
AGENTI.init = function () {
    console.log("App initialising...");
//-----------------------------------------------------------------------------------
//detect device type, this needs to run after deviceReady
    AGENTI.deviceType = device.platform;

//detect app version from config.xml (plugin used - AppVersion by telerik cordova plugin add https://github.com/Telerik-Verified-Plugins/AppVersion)
    cordova.getAppVersion().then(function (version) {
        AGENTI.appVersion = version;
        $('#appVersion').text('Version ' + AGENTI.appVersion); //Version info in login page
        $('#appInfo').text(AGENTI.appVersion); //version info in side panel
    });
//-----------------------------------------------------------------------------------
    //Login page button bindinds
    $('#loginForm').on('tap', '#loginBtn', AGENTI.user.login);
    //prevent submiting the form when the user taps the 'go' key on the virtual keyboard
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        return false;
    });

//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
    //Client page bindings

    //client search page
    $('#clienti').on('pageinit', function () {
        //hide the more results button
        $('#clienti .moreBtn').closest('.ui-btn').hide();
    });

    //client search page
    $('#clienti').on('pageshow', function () {
        //this resets the blockedClientPopup
        AGENTI.client.popUpShown = 'false';
        //Empty heavy Orders list
        $("#orderListContainer").empty();
    });

    $('#searchClientForm').on('tap', ':submit', function () {
        //hide the more results button
        $('#clienti .moreBtn').closest('.ui-btn').hide();
        $("#clientList").empty(); //clear the list
        //Reset the page offset
        AGENTI.pagination.resetOffset();
        //Set the max number of records we want per ajax request (default is 20)
        AGENTI.pagination.setRecordsPerPage(20);
        AGENTI.client.getClientList();
    });

    //More results button
    $('#clienti').on('tap', '.moreBtn', function () {
        AGENTI.client.getClientList();
    });

    //prevent submiting the form when the user taps the 'go' key on the virtual keyboard
    $('#searchClientForm').on('submit', function (event) {
        event.preventDefault();
        return false;
    });

    $('#clientList').on('tap', 'li',  AGENTI.client.selectClient);

    //Client detail page
    $('#clientDetail').on('pageinit', function () {

        $('#addContact').on('tap', function () {
            AGENTI.utils.createContact();
        });

        $('#clientDetail #bckbtn').on('tap', AGENTI.offerta.checkIsInserted);

    });




    $('#clientDetail').on('pageshow', function () {
        //reset heavy lists in child pages
        $("#listaArticoli").empty();
        $("#history").empty();
        $("#mainSalesList").empty();
        $('#offertaTable tbody').empty(); // empty table in offerta detail page
        //hide the more results button in sales history page
        $('#clientSalesHistory .moreBtn').closest('.ui-btn').hide();
        //hide the more results button in major sales history page
        $('#majorSalesHistory .moreBtn').closest('.ui-btn').hide();
        //hide the more results button in listino page
        $('#listino .moreBtn').closest('.ui-btn').hide();
        //set the page title to the client's name
        $('#clientDetail .pageTitle').text(AGENTI.client.ragSociale);
        //render client details
        AGENTI.client.renderClientDetails();
    });

    //code to check for android back button in client detail page while an offerta has been created
    document.addEventListener("backbutton", function(e){
        if($.mobile.activePage.is('#clientDetail')){
            /*
             Event preventDefault/stopPropagation not required as adding backbutton
             listener itself override the default behaviour. Refer below PhoneGap link.
             */
            //e.preventDefault();
            AGENTI.offerta.checkIsInserted();
            //navigator.app.exitApp();
        }
        else {
            navigator.app.backHistory();
        }
    }, false);

    //Storico acquisti page
    $('#clientSalesHistory').on('pageshow', function () {
        //Reset the page offset
        AGENTI.pagination.resetOffset();
        //Set the max number of records we want per ajax request (default is 20)
        AGENTI.pagination.setRecordsPerPage(30);
        //Change page title
        $('#clientSalesHistory').find('h4').html(AGENTI.client.ragSociale);
        AGENTI.client.getSalesHistory();
    });

    //More results button
    $('#clientSalesHistory').on('tap', '.moreBtn', function () {
        AGENTI.client.getSalesHistory();
    });

    $('#clientSalesHistory').on('pageinit', function () {
        //hide the more results button
        $('#clientSalesHistory .moreBtn').closest('.ui-btn').hide();
    });

    //Click on sales history list to see item details
    $('#history').on('tap', 'li', function () {
        AGENTI.item.getItemDetails($(this).attr('data-codiceArticolo'), "codice");
    });


    //Acquisti maggiori page
    $('#majorSalesHistory').on('pageshow', function () {
        //Reset the page offset
        AGENTI.pagination.resetOffset();
        //Set the max number of records we want per ajax request (default is 20)
        AGENTI.pagination.setRecordsPerPage(30);
        //Change page title
        $('#majorSalesHistory').find('h4').html(AGENTI.client.ragSociale);
        //change the year in the help text of this page
        $('#lastYear').html(Date.today().getFullYear() - 1);
        AGENTI.client.getMajorSalesHistory();
    });

    //More results button
    $('#majorSalesHistory').on('tap', '.moreBtn', function () {
        AGENTI.client.getMajorSalesHistory();
    });

    $('#majorSalesHistory').on('pageinit', function () {
        //hide the more results button
        $('#majorSalesHistory .moreBtn').closest('.ui-btn').hide();
    });

    //Click on major sales history list to see item details
    $('#mainSalesList').on('tap', 'li', function () {
        AGENTI.item.getItemDetails($(this).attr('data-codiceArticolo'), "codice");
    });
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
    //Item page bindings

    $('#listino').on('pageinit', function () {
        //hide the more results button in listino page
        $('#listino .moreBtn').closest('.ui-btn').hide();
    });


    //Item Search page
    $('#itemSearchForm').on('tap', ':submit', function () {
        //Reset the item list
        $("#listaArticoli").empty();
        //hide the more results button
        $('#listino .moreBtn').closest('.ui-btn').hide();
        //reset the page offset
        AGENTI.pagination.resetOffset();
        //Set the max number of records we want per ajax request (default is 20)
        AGENTI.pagination.setRecordsPerPage(25);
        AGENTI.item.getItemList();
    });

    $('#listino').on('tap', '.moreBtn', function () {
        AGENTI.item.getItemList();
    });

    //prevent submiting the form when the user taps the 'go' key on the virtual keyboard
    $('#itemSearchForm').on('submit', function (event) {
        event.preventDefault();
        return false;
    });

    //Change the listino page title and hide "more" btn
    $('#listino').on('pageshow', function () {
        $('#listino').find('h4').text('Listino ' + AGENTI.client.ragSociale);
    });

    //Ajax call to get item details
    $('#listaArticoli').on('tap', 'li', function () {
        AGENTI.item.getItemDetails($(this).attr('data-codiceArticolo'), "codice");
    });


    //itemDetail Page
    $('#itemDetail').on('pageshow', function () {
        //set the page title to the item's name
        $('#itemDetail').find('h5').html(AGENTI.item.descArt);
        $('#itemSalesHistoryButton').removeClass('ui-disabled');
        AGENTI.item.renderItemDetails();
    });

    //Sales history button in item detail page
    $('#itemSalesHistoryButton').on('tap', function (){
        $(this).addClass('ui-disabled');
        AGENTI.item.getItemSalesHistory();
    });

    $('#popupOfferta').on('popupafteropen', function() {
        var item = AGENTI.item;
        $('#qtty').val("1");
        $('#prz').val(item.Prezzo);
    });

    $('#insertItemToOffertaBtn').on('tap', function() {
        var item = AGENTI.item,
            qty = $('#qtty').val(),
            prezzo = $('#prz').val();

        AGENTI.offerta.addItemToOfferta(item.codiceArticolo, item.descArt, qty, prezzo);
    });
//-----------------------------------------------------------------------------------
    //Offerta detail page bindings
    $('#offertaDetail').on('pageshow', AGENTI.offerta.renderOffertaDetail);

    $('#inviaOfferta').on('tap', AGENTI.offerta.inviaOfferta);



//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
    //Log page bindings
    $('#admin').on('pageshow', function () {
        $("#log").empty();
        AGENTI.log.getLog();
    });
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
    //Order page bindings
    $('#ordini').on('pageshow', function () {
        $('#DateFrom').val(Date.today().add(-2).months().toString("dd-MM-yyyy"));
        $('#DateTo').val(Date.today().toString("dd-MM-yyyy"));
    });

    $('#ordini').on('tap', '#orderSearchButton', function () {
        $("#orderListContainer").empty();
        AGENTI.order.getOrderList();
    });

    $('#orderListContainer').on('tap', 'div.month ul.orderList li', function () {
        AGENTI.utils.vibrate();
        $('#orderItemTable tbody').empty();
        $.mobile.changePage("#ordiniDetail");
        AGENTI.order.getOrderDetail($(this).attr('data-orderId'));
    });
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
    //Navbar tap events
    var navBarDiv = $("div:jqmData(role='navbar')");

    navBarDiv.on('tap', '.homeNavBtn', function (e) {
        AGENTI.utils.vibrate();
        $.mobile.changePage("#home");
        e.preventDefault();
    });

    navBarDiv.on('tap', '.clientiNavBtn', function (e) {
        AGENTI.utils.vibrate();
        $.mobile.changePage("#clienti");
        e.preventDefault();
    });

    navBarDiv.on('tap', '.ordiniNavBtn', function (e) {
        AGENTI.utils.vibrate();
        $.mobile.changePage("#ordini");
        e.preventDefault();
    });
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
    //the import data dialog bindings
    /*    $('#importazione').on('tap', '#dataImport', function (e) {
     AGENTI.utils.importData();
     e.preventDefault();
     });*/
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
    //Right panel bindings
    //vibrate on panel open
    var panel = $('.left-panel');
    panel.on('panelopen', function () {
        AGENTI.utils.vibrate();
    });

    //vibrate on panel close
    panel.on('panelclose', function () {
        AGENTI.utils.vibrate();
    });

    $('#logoutDialog').on('tap', '#appExitbtn', AGENTI.user.logout);

//-----------------------------------------------------------------------------------

//Barcode scanner--------------------------------------------------------------------
    //Initialise the scanner plugin
    try {
        AGENTI.scanner = cordova.plugins.barcodeScanner;
        //cordova.require("cordova/plugin/BarcodeScanner");

        //navigator.notification.alert('scanner loaded');
    } catch (e) {
        navigator.notification.alert('scanner could not be loaded');
    }

    $('#listino').on('tap', '#scan', function () {
        try {
            AGENTI.scanner.scan(
                function (result) {
                    AGENTI.item.getItemDetails(result.text, "barcode");
                    /*navigator.notification.alert("We got a barcode\n" +
                     "Result: " + result.text + "\n" +
                     "Format: " + result.format + "\n" +
                     "Cancelled: " + result.cancelled);*/
                },
                function (error) {
                    navigator.notification.alert("Scansione fallita: " + error);
                }
            );
        } catch (e) {
            navigator.notification.alert(e.message);
        }
    });
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
    //Check if username and password is in localstorage and if yes login the user
    if (AGENTI.db.getItem('username') && AGENTI.db.getItem('password')) {
        $("#username").val(AGENTI.db.getItem('username'));
        $("#password").val(AGENTI.db.getItem('password'));
        console.log("login initialised");
        AGENTI.user.login();
    }
//-----------------------------------------------------------------------------------
    console.log("App initialized, device is '" + AGENTI.deviceType + "'");
//-----------------------------------------------------------------------------------
};


//start
$('#loginPage').on('pageinit', function () {
    $(document).on('deviceready', function () {
        AGENTI.init();
    });
});
