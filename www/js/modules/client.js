/**
 * Created by Babis on 02/04/2015.
 */

AGENTI.client = (function () {

    var codice = "",
        ragSociale = "",
        indirizzo = "",
        indirizzo2 = "",
        indirizziAlt = [],
        parIva = "",
        categoriaSconto = "",
        noTelefono = "",
        noCell = "",
        noFax = "",
        email = "",
        fattCorrente = "",
        fattPrecedente = "",
        saldoProfessional = "",
        SaldoService = "",
        SaldoSpa = "",
        stato = "",
        pagamento = "",
        historyShown = "",
        majorHistoryShown = "";

    /*MODELS*/

//function to get the client list in json format from the server
    var getClientList = function () {
        var searchString = $.trim($('#searchTerm').val()), //String to search for in server
            clientOptionString = JSON.stringify($('#clientSearchOptions').val()),//json.stringify this to pass search options to server via json
            userName = AGENTI.db.getItem('username'),
            queryData = {
                action: 'searchClient',
                searchTerm: searchString,
                clientSearchOptions: clientOptionString,
                user: userName
            };

        if (searchString !== "") {
            //get Client list from remote server
            //make ajax call
            AGENTI.getData(queryData, renderList);
        }
    };

// get the client's recent sales history
    var getSalesHistory = function () {
        if ((historyShown !== 'true') || (AGENTI.utils.pagination.getOffset() > 0)) {
            /*Variable declaration ***************************/
            var codCliente = codice,
                userName = AGENTI.db.getItem('username'),
                queryData = {action: 'ultimiAcquisti', clientId: codCliente, user: userName};
            /*End of variable declaration********************/

            //get data from the server
            AGENTI.getData(queryData, renderSalesHistory);

        }
    };

//Get the client's most important recent sales
    var getMajorSalesHistory = function () {
        if ((majorHistoryShown !== 'true') || (AGENTI.utils.pagination.getOffset() > 0)) {
            /*Variable declaration ***************************/
            var codCliente = codice,
                userName = AGENTI.db.getItem('username'),
                queryData = {action: 'aqcuistiMaggiori', clientId: codCliente, user: userName};
            /*End of variable declaration********************/

            //get data from the server
            AGENTI.getData(queryData, renderMajorSalesHistory);
        }
    };


    /*VIEWS*/

//function to render the client list in a ul at the search client page
    var renderList = function (result) {

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
        clientList.append(html);
        clientList.listview("refresh");
    };


//function for passing data stored in DOM to client detail page
//TODO change this, you already have this data in memory you don't have to store in DOM
    var selectClient = function (e) {

        AGENTI.utils.vibrate();

        codice = $(this).attr('data-codice');
        ragSociale = $(this).attr('data-ragSociale');
        indirizzo = $(this).attr('data-indirizzo');
        indirizzo2 = $(this).attr('data-indirizzo2');
        indirizziAlt = $(this).attr('data-indirizziAlt');
        parIva = $(this).attr('data-parIva');
        categoriaSconto = $(this).attr('data-categoriaSconto');
        noTelefono = $(this).attr('data-noTelefono');
        noCell = $(this).attr('data-noCell');
        noFax = $(this).attr('data-noFax');
        email = $(this).attr('data-email');
        fattCorrente = $(this).attr('data-fattCorrente');
        fattPrecedente = $(this).attr('data-fattPrecedente');
        saldoProfessional = $(this).attr('data-saldoProfessional');
        SaldoService = $(this).attr('data-SaldoService');
        SaldoSpa = $(this).attr('data-SaldoSpa');
        stato = $(this).attr('data-stato');
        pagamento = $(this).attr('data-pagamento');
        $.mobile.changePage("#clientDetail", {transition: "flip"});
        e.preventDefault();
    };


//function to render the Client detail information in the client detail page
//TODO bloody use a templating library , mustache, handlebars underscore etc
    var renderClientDetails = function () {
        /*Variable declaration *********************/
        var html = "",
            currentYear = Date.today().getFullYear(),
            lastYear = Date.today().getFullYear() - 1,
            numStatoCliente = stato,
            statoCliente = "",
            clientDetailList = $('#clientDetailList'),
            arrayLength = "", //length of previous array for caching
            indirizzoAlt = {}; //Object to hold each alternative address' properties
        /*End of variable declaration***************/

        historyShown = 'false';
        majorHistoryShown = 'false';

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

        html += '<li><p>' + codice + '</p><h4>' + ragSociale + '</h4>' + '<p>P.Iva: ' + parIva + '</p></li>' + '<li class="mapLink" data-address="' + indirizzo + indirizzo2 + ', ITALIA"><a href="#"><p>' + indirizzo + '</p><p>' + indirizzo2 + '</p></a></li>';

        //don't render these if null
        //Check if client has alternative addresses and render them
        if (indirizziAlt !== '') {

            indirizziAlt = AGENTI.utils.parseAltAddress(indirizziAlt);
            arrayLength = indirizziAlt.length;

            for (var i = 0; i < arrayLength; i++) {

                indirizzoAlt = indirizziAlt[i];

                html += '<li class="mapLink" data-address="' + indirizzoAlt.address + '"><a href="#"><p style="white-space: normal;">' + indirizzoAlt.addressType + ': ' + indirizzoAlt.address + '</p></a></li>';
            }
        }

        if (categoriaSconto !== 'null') {
            html += '<li><p>Categoria: ' + categoriaSconto + '</p></li>';
        }

        if (noTelefono !== 'null') {
            html += '<li><a href="tel:' + noTelefono + '"><p>Tel: ' + noTelefono + '</p></a></li>';
        }

        if (noCell !== 'null') {
            html += '<li><a href="tel:' + noCell + '"><p>Cell: ' + noCell + '</p></a></li>';
        }

        if (noFax !== 'null') {
            html += '<li><p>Fax: ' + noFax + '</p></li>';
        }

        if (email !== 'null') {
            html += '<li><a href="mailto:' + email + '"><p>Email: ' + email + '</p></a></li>';
        }

        html += '<li><p>Fatturato  ' + currentYear + ': &#8364;' + fattCorrente + '</p>' + '<p>Fatturato  ' + lastYear + ': &#8364;' + fattPrecedente + '</p></li>';

        if (saldoProfessional !== 'null') {
            html += '<li><p>Saldo Professional: &#8364;' + saldoProfessional + '</p>';
        } else {
            html += '<li><p>Saldo Professional: &#8364;0,00</p>';
        }

        if (SaldoService !== 'null') {
            html += '<p>Saldo Service: &#8364;' + SaldoService + '</p>';
        } else {
            html += '<p>Saldo Service: &#8364;0,00</p>';
        }

        if (SaldoSpa !== 'null') {
            html += '<p>Saldo spa: &#8364;' + SaldoSpa + '</p></li>';
        } else {
            html += '<p>Saldo spa: &#8364;0,00</p></li>';
        }

        html += '<li><p>Pagamento: ' + pagamento + '</p></li><li><p>Stato cliente: ' + statoCliente + '</p></li>';

        clientDetailList.html(html);
        clientDetailList.listview("refresh");

        //set the page title to the client's name
        $('clientDetail').find('h5').html(ragSociale);

        //bind click on address to open map in client detail page
        clientDetailList.on('tap', '.mapLink', function () {
            AGENTI.utils.openMap($(this).attr('data-address'));
        });
    };


// render the client's recent sales history
    var renderSalesHistory = function (result) {
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

        historyShown = 'true';
        $('#history').append(html).listview("refresh");
    };


//render the client's recent major sales history
    var renderMajorSalesHistory = function (result) {
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

        majorHistoryShown = 'true';
        $('#mainSalesList').append(html).listview("refresh");
    };

    return {
        getClientList: getClientList,
        getMajorSalesHistory: getMajorSalesHistory,
        getSalesHistory: getSalesHistory,
        renderClientDetails: renderClientDetails,
        renderList: renderList,
        renderMajorSalesHistory: renderMajorSalesHistory,
        renderSalesHistory: renderSalesHistory,
        selectClient: selectClient,
        categoriaSconto : function () {
            return categoriaSconto;
        }
    };

})();