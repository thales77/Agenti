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


    //Open the map in native maps app in android/ios
    var openMap = function (deviceType, address) {
        if (deviceType === 'Android') {
            window.location = "geo:0,0?q=" + address;
        } else {
            window.location = "maps:q=" + address;
        }
    };

    //wiggle it - takes deviceType as input because navigator.vibrate doesn't work well in ios
    var vibrate = function (deviceType) {
        //shake it baby
        if (deviceType === 'Android') {
            //this doesn't work well in ios
            navigator.vibrate(10);
        }
    };


    //exports
    return {
        pagination: pagination,
        openMap: openMap,
        vibrate: vibrate
    };

})();