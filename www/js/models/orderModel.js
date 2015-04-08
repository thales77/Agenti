/**
 * Created by Babis on 08/04/2015.
 */

//get the list of orders for a specific agent
AGENTI.order.getOrderList = function () {
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

};

//get the details for the order clicked in the list
AGENTI.order.getOrderDetail = function (id) {
    /*Variable declaration*******************/
    var that = AGENTI.order,
        username = AGENTI.db.getItem('username'),
        queryData = {action: 'getOrderDetail', orderId: id, user: username};
    /*End of variable declaration************/
    AGENTI.order.id = id;


    //get data from the server
    AGENTI.getData(queryData, that.renderOrderDetail);
};