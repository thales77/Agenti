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

    //wiggle it - takes deviceType as input because navigator.notification.vibrate doesn't work well in ios
    var vibrate = function (deviceType) {
        //shake it baby
        if (deviceType === 'Android') {
            //this doesn't work well in ios
            navigator.notification.vibrate(10);
        }
    };

    //function to create xml file for sending to server
    var writeXML = function () {
        var xw = new XMLWriter('UTF-8');
        xw.formatting = 'indented'; //add indentation and newlines
        xw.indentChar = ' '; // indent with spaces
        xw.indentation = 2; //add 2 spaces per level
    
        xw.writeStartDocument();
        xw.writeStartElement('items');
        xw.writeComment('button');
        xw.writeStartElement('item');
        xw.writeAttributeString('id', 'item-1');
        xw.writeAttributeString('enabled', 'true');
        xw.writeStartElement('code');
        xw.writeCDATA('<button>Save</button>');
        xw.writeEndElement();
        xw.writeElementString('description', 'a save button');
        xw.writeEndElement();
    
        xw.writeComment('image');	
        xw.writeStartElement('item');
        xw.writeAttributeString('id', 'item-2');
        xw.writeRawAttributeString('data-test','this is a raw attribute string use carefully');
        xw.writeAttributeString('enabled', 'false');
        xw.writeStartElement('code');
        xw.writeCDATA('<img src="photo.gif" alt="me" />');
        xw.writeEndElement();
        xw.writeElementString('description', 'a pic of myself!');
        xw.writeEndElement();
    
        xw.writeComment('link');
        xw.writeStartElement('item');
        xw.writeAttributeString('id', 'item-3');
        xw.writeAttributeString('enabled', 'true');
        xw.writeStartElement('code');
        xw.writeCDATA('<a href="http://google.com">Google</a>');
        xw.writeEndElement();
        xw.writeElementString('description', 'a link to Google');
        xw.writeEndElement();
    
        xw.writeEndElement();
        xw.writeEndDocument();
    
        var asString = "";
    
        if (typeof XMLSerializer !== 'undefined') {
            asString = new XMLSerializer().serializeToString(xw.getDocument());
        } else {
            asString = xw.getDocument().xml;
        }
        alert(asString);
    };

    //Function to upload a file to ftp server
    var sendXML = function(filename) {
        // First of all, connect to ftp server address without protocol prefix. e.g. "192.168.1.1:21", "ftp.xfally.github.io"
        // Notice: address port is only supported for Android, if not given, default port 21 will be used.
        window.cordova.plugin.ftp.connect('siderstore.atenea.it', 'sidersynchro', '%^YTR56ytrf00PP', function(ok) {
            console.info("ftp: connect ok=" + ok);
    
            // You can do any ftp actions from now on...
            window.cordova.plugin.ftp.upload('/localPath/'+ filename, '/remotePath/' + filename, function(percent) {
                if (percent == 1) {
                    console.info("ftp: upload finish");
                } else {
                    console.debug("ftp: upload percent=" + percent * 100 + "%");
                }
            }, function(error) {
                console.error("ftp: upload error=" + error);
            });
    
        }, function(error) {
            console.error("ftp: connect error=" + error);
        });
    };


    //exports
    return {
        pagination: pagination,
        openMap: openMap,
        vibrate: vibrate
    };

})();