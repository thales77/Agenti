/**
 * Created by Babis on 02/04/2015.
 */

AGENTI.order = (function () {
    /*Variable declaration*******************/
    var queryData = {},
        userName = AGENTI.db.getItem('username'),
        idAgente = AGENTI.db.getItem('idAgente'),
        orderId = "";
    /*End of variable declaration************/

    /*MODELS*/
//get the list of orders for a specific agent
    var getOrderList = function () {
        /*Variable declaration*******************/
        var orderDateFrom = Date.parseExact($('#DateFrom').val(), 'dd-MM-yyyy').toString("yyyy-MM-dd"),
            orderDateTo = Date.parseExact($('#DateTo').val(), 'dd-MM-yyyy').toString("yyyy-MM-dd");
        /*End of variable declaration************/

        queryData = {
            action: 'getOrderList',
            datefrom: orderDateFrom,
            dateto: orderDateTo,
            idAgente: idAgente,
            user: userName
        };

        //get data from the server
        AGENTI.getData(queryData, _renderOrderList);

    };

//get the details for the order clicked in the list
    var getOrderDetail = function (id) {

        queryData = {action: 'getOrderDetail', orderId: id, user: userName}
        orderId = id;

        //get data from the server
        AGENTI.getData(queryData, _renderOrderDetail);
    };

    /*VIEWS*/
//render the orders list in html
    var _renderOrderList = function (result) {
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

            html += '<li data-orderId="' + this.orderId + '"><a href="#"><p style="font-size:small;">' + curDate.toString("d-M-yyyy") + ' - No: ' + this.numDoc + ' - ' + this.descAgente + '</p>\n\
                         <p style="color:yellow;font-weight:bold;font-style:italic">' + this.codCliente + ' - ' + this.desCli + '</p>\n\
                         <p style="font-size:small;">Totale: €<span style="font-weight:bold;font-style:italic">' + this.totImp + '</span> + IVA - ' + statoOrdine + '</p></a></li>';
        });
        html += '</ul></div>';

        $('#orderListContainer').append(html);
        $('.month').collapsible({refresh: true});
        $('.orderList').listview({refresh: true});
    };


    var _renderOrderDetail = function (result) {
        /*Variable declaration*******************/
        var i = 0;
        /*End of variable declaration************/

        $('#ordiniDetail').find('h5').text('Ordine No ' + orderId);
        $.each(result, function () {
            i += 1;
            $('#orderItemTable  tbody').append('<tr><th>' + i + '</th><td>' + this.codArt + '</td><td style=" font-weight: bold">' + this.descArt + '</td>\n\
            <td>' + this.qta + '</td><td>' + this.quantSped + '</td><td>' + this.quantRes + ' </td><td style="font-weight: bold"> €' + this.prezzoNetto + '</td></tr>');
        });

        $('#orderItemTable').table("refresh");
    };

    return {
        getOrderList: getOrderList,
        getOrderDetail: getOrderDetail
    };

})();
