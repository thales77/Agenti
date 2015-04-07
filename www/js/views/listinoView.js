/**
 * Created by Babis on 02/04/2015.
 */

// function to render the data from the searchItem function
AGENTI.listino.renderList =  function (result) {

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
};


//Function to render the Item details to html
AGENTI.listino.renderItemDetails = function () {
    /*Variable declaration*******************/
    var item = AGENTI.listino;
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

    //show the promotional message if the listino is in promotion
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

};


// Render the listino's sales history under the button
AGENTI.listino.renderItemsSalesHistory = function (result) {
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