/**
 * Created by Babis on 02/04/2015.
 */

AGENTI.utils = (function () {

//Function to handle pagination in long lists
    var pagination = (function () {
        //Private variables
        var _noRecordsPerPage = 20,
            _offset = 0;

        //Public methods
        var addOffset = function (listOffset) {
            _offset = _offset + parseInt(listOffset, 10);
        };

        var resetOffset = function () {
            _offset = 0;
        };

        var getOffset = function () {
            return _offset;
        };

        var setRecordsPerPage = function (recordsPerPage) {
            _noRecordsPerPage = parseInt(recordsPerPage, 10);
        };

        var getProperties = function () {
            return {
                listOffset: _offset,
                perPage: _noRecordsPerPage
            };
        };
        return {
            addOffset: addOffset,
            resetOffset: resetOffset,
            getOffset: getOffset,
            setRecordsPerPage: setRecordsPerPage,
            getProperties: getProperties
        }
    })();


    //Open the map in native maps app
    var openMap = function (address) {
        if (AGENTI.deviceType === 'Android') {
            window.location = "geo:0,0?q=" + address;
        } else {
            window.location = "maps:q=" + address;
        }
    };

    //wiggle it
    var vibrate = function () {
        //shake it baby
        if (AGENTI.deviceType === 'Android') {
            //this doesn't work well in ios
            navigator.notification.vibrate(10);
        }
    };


    //exports
    return {
        pagination: pagination,
        openMap: openMap,
        vibrate: vibrate
    };

})();