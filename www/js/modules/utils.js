/**
 * Created by Babis on 02/04/2015.
 */

AGENTI.utils = {
    //Open the map in native maps app
    //add blackberry support?
    openMap: function (address) {
        if (AGENTI.deviceType === 'Android') {
            window.location = "geo:0,0?q=" + address;
        } else {
            window.location = "maps:q=" + address;
        }
    },
    vibrate: function (){
        //shake it baby
        if (AGENTI.deviceType === 'Android') {
            //this doesn't work well in ios
            navigator.notification.vibrate(10);
        }
    }

};

//Pagination module
AGENTI.utils.pagination = (function () {
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
})();