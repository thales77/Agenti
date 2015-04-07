/**
 * Created by Babis on 02/04/2015.
 */

//function to render the client list in a ul at the search client page
AGENTI.client.renderList = function (result) {

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
AGENTI.client.selectClient = function (e) {
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
    $.mobile.changePage("#clientDetail", {transition: "flip"});
    e.preventDefault();
};


//function to render the Client detail information in the client detail page
//TODO bloody use a templating library , mustache, handlebars underscore etc
AGENTI.client.renderClientDetails = function () {
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

            html += '<li class="mapLink" data-address="' + indirizzoAlt.address + '"><a href="#"><p style="white-space: normal;">' + indirizzoAlt.addressType + ': ' + indirizzoAlt.address + '</p></a></li>';
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
};


// render the client's recent sales history
AGENTI.client.renderSalesHistory = function (result) {
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

    AGENTI.client.historyShown = 'true';
    $('#history').append(html).listview("refresh");
};


//render the client's recent major sales history
AGENTI.client.renderMajorSalesHistory = function (result) {
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

    AGENTI.client.majorHistoryShown = 'true';
    $('#mainSalesList').append(html).listview("refresh");
};