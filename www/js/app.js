/**
 * Created by Babis on 02/04/2015.
 */
/*Object for app name space*/
var AGENTI = {
    //remoteUrl: "http://85.33.180.83/test/phonegapsrv/",
    //remoteUrl: "http://85.33.180.83/phonegapsrv/",
    remoteUrl: "http://95.110.224.136/phonegapsrv/",
    deviceType: "",
    appVersion: "",
    db: localStorage
};

/*Function to detect device type, Setup UI event bindings, check if the user is already logged in*/
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

    //initialise sqlite database
    //TODO add this functionality at some point --> see "saveOfferta" in offerta.js
    //AGENTI.sqliteDB = window.sqlitePlugin.openDatabase({name: "agenti.db"});

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
        AGENTI.utils.pagination.resetOffset();
        //Set the max number of records we want per ajax request (default is 20)
        AGENTI.utils.pagination.setRecordsPerPage(20);
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
            AGENTI.client.createContact();
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

        /* //if no order is inserted disable invio offerta button
         if (AGENTI.offerta.detail.length > 0) {
         $('#offertaDetailBtn').removeClass('ui-disabled');
         } else {
         $('#offertaDetailBtn').addClass('ui-disabled');
         }*/

        //render client details
        AGENTI.client.renderClientDetails();
    });

    //code to check for android back button in client detail page while an offerta has been created
    //also it checks if the user taps the Android back button on the home screen and asks to terminate the app.

    document.addEventListener("backbutton", function(e){
        var activePage = $.mobile.activePage.attr('id');

        if(activePage == 'ordini' || activePage == 'home' || activePage == 'clienti' || activePage == 'loginPage') {

            var onConfirm = function (buttonIndex) {
                if (buttonIndex == 1) {
                    navigator.app.exitApp();
                }
            };

            navigator.notification.confirm('Uscire dall\' app?', onConfirm, 'Termina' , ['Si', 'No']);

        }
        else if(activePage ==  'clientDetail'){

            AGENTI.offerta.checkIsInserted();

        }
        else {
            navigator.app.backHistory();
        }
    }, false);

    //Storico acquisti page
    $('#clientSalesHistory').on('pageshow', function () {
        //Reset the page offset
        AGENTI.utils.pagination.resetOffset();
        //Set the max number of records we want per ajax request (default is 20)
        AGENTI.utils.pagination.setRecordsPerPage(30);
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

    //Click on sales history list to see listino details
    $('#history').on('tap', 'li', function () {
        AGENTI.listino.getItemDetails($(this).attr('data-codiceArticolo'), "codice");
    });


    //Acquisti maggiori page
    $('#majorSalesHistory').on('pageshow', function () {
        //Reset the page offset
        AGENTI.utils.pagination.resetOffset();
        //Set the max number of records we want per ajax request (default is 20)
        AGENTI.utils.pagination.setRecordsPerPage(30);
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

    //Click on major sales history list to see listino details
    $('#mainSalesList').on('tap', 'li', function () {
        AGENTI.listino.getItemDetails($(this).attr('data-codiceArticolo'), "codice");
    });
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
    //listino page bindings

    $('#listino').on('pageinit', function () {
        //hide the more results button in listino page
        $('#listino .moreBtn').closest('.ui-btn').hide();
    });


    //Item Search page
    $('#itemSearchForm').on('tap', ':submit', function () {
        //Reset the listino list
        $("#listaArticoli").empty();
        //hide the more results button
        $('#listino .moreBtn').closest('.ui-btn').hide();
        //reset the page offset
        AGENTI.utils.pagination.resetOffset();
        //Set the max number of records we want per ajax request (default is 20)
        AGENTI.utils.pagination.setRecordsPerPage(25);
        AGENTI.listino.getItemList();
    });

    $('#listino').on('tap', '.moreBtn', function () {
        AGENTI.listino.getItemList();
    });

    //prevent submiting the form when the user taps the 'go' key on the virtual keyboard
    $('#itemSearchForm').on('submit', function (event) {
        event.preventDefault();
        return false;
    });

    //Change the listino page title and hide "more" btn
    $('#listino').on('pageshow', function () {
        $('#listino').find('h4').text('Listino ' + AGENTI.client.ragSociale());
    });

    //Ajax call to get listino details
    $('#listaArticoli').on('tap', 'li', function () {
        AGENTI.listino.getItemDetails($(this).attr('data-codiceArticolo'), "codice");
    });


    //itemDetail Page
    $('#itemDetail').on('pageshow', function () {
        //set the page title to the listino's name
        $('#itemDetail').find('h5').html(AGENTI.listino.descArt());
        $('#itemSalesHistoryButton').removeClass('ui-disabled');
        AGENTI.listino.renderItemDetails();
    });

    //Sales history button in listino detail page
    $('#itemSalesHistoryButton').on('tap', function (){
        $(this).addClass('ui-disabled');
        AGENTI.listino.getItemSalesHistory();
    });

//-----------------------------------------------------------------------------------
    //Offerta page bindings

    //render offerta detail page on pageshow
    $('#offertaDetail').on('pageshow', function () {
        $('#offertaTable tbody').empty();
        AGENTI.offerta.renderOffertaDetail();
    });

    //invia offerta button in offerta detail page
    $('#inviaOfferta').on('tap', AGENTI.offerta.sendOfferta);

    //invia offerta button in offerta detail page
    $('#salvaOfferta').on('tap', AGENTI.offerta.saveOfferta);


    //Delete offerta button in offerta Details page
    $('#offertaDeleteBtn').on('tap', function () {
        if (AGENTI.offerta.detail().length !== 0) {
            AGENTI.offerta.checkIsInserted();
        }
    });

    //popup in item detail page to insert item to offerta
    $('#popupOfferta').on('popupafteropen', function() {
        var item = AGENTI.listino;
        $('#qtty').val("1").focus().select();
        $('#popupOfferta').popup("reposition", {
            y: 0 /* move it to top */
        });
        $('#prz').val(item.prezzo());
        $('#nota').val('');
    });

    //popup on 'inserisci articolo dal listino' button tap in offerta detail
    $('#insertLibItemToOffertaBtn').on('tap', function() {
        var codice = $('#codiceArtLib').val(),
            descrizione = $('#descArtLib').val(),
            qty = $('#qttyArtLib').val(),
            prezzo = $('#przArtLib').val(),
            nota = $('#notaArtLib').val();
        AGENTI.offerta.addItem(codice, descrizione, qty, prezzo, nota);
        $('#offertaTable tbody').empty();
        AGENTI.offerta.renderOffertaDetail();
        $("#addEmptyItemPopup").popup("close");
    });

    //popup on 'inserisci articolo non codificato' button tap in offerta detail
    $('#addEmptyItemPopup').on('popupafteropen', function() {
        $('#codiceArtLib').val('0000001');
        $('#descArtLib').val('ARTICOLI VARI DA CODIFICARE').focus().select();
        $('#qttyArtLib').val('');
        $('#przArtLib').val('');
        $('#notaArtLib').val('');
        $('#addEmptyItemPopup').popup("reposition", {
            y: 0 /* move it to top */
        });
    });

    //ok button press in add item popup dialog
    $('#insertItemToOffertaBtn').on('tap', function() {
        var item = AGENTI.listino,
            qty = $('#qtty').val(),
            prezzo = $('#prz').val(),
            nota = $('#nota').val();
        AGENTI.offerta.addItem(item.codiceArticolo(), item.descArt(), qty, prezzo, nota);
        $( "#popupOfferta" ).popup( "close" );
    });

    //delete item button press in offerta detail page - these buttons are dynamically generated so we bind the event on parent element
    $('#offertaTableBody').on('tap', '.deleteOffertaDetailRow', function () {
        AGENTI.offerta.deleteItem($(this), $('#totaleOfferta'));
    });
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
    //Log page bindings
    $('#admin').on('pageshow', function () {
        $("#log").empty();
        //getLog - element to render it in.
        AGENTI.log.getLog('#log');
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
        AGENTI.utils.vibrate(AGENTI.deviceType);
        $('#orderItemTable tbody').empty();
        $.mobile.changePage("#ordiniDetail");
        AGENTI.order.getOrderDetail($(this).attr('data-orderId'));
    });
//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
    //Navbar tap events
    var navBarDiv = $("div:jqmData(role='navbar')");

    navBarDiv.on('tap', '.homeNavBtn', function (e) {
        AGENTI.utils.vibrate(AGENTI.deviceType);
        $.mobile.changePage("#home");
        e.preventDefault();
    });

    navBarDiv.on('tap', '.clientiNavBtn', function (e) {
        AGENTI.utils.vibrate(AGENTI.deviceType);
        $.mobile.changePage("#clienti");
        e.preventDefault();
    });

    navBarDiv.on('tap', '.ordiniNavBtn', function (e) {
        AGENTI.utils.vibrate(AGENTI.deviceType);
        $.mobile.changePage("#ordini");
        e.preventDefault();
    });
//-----------------------------------------------------------------------------------




//-----------------------------------------------------------------------------------
    //Right panel bindings
    //vibrate on panel open
    var panel = $('.left-panel');
    panel.on('panelopen', function () {
        AGENTI.utils.vibrate(AGENTI.deviceType);
    });

    //vibrate on panel close
    panel.on('panelclose', function () {
        AGENTI.utils.vibrate(AGENTI.deviceType);
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
                    AGENTI.listino.getItemDetails(result.text, "barcode");
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




//start things up
$('#loginPage').on('pageinit', function () {
    $(document).on('deviceready', function () {
        AGENTI.init();
    });
});
