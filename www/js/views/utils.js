/**
 * Created by Babis on 02/04/2015.
 */

AGENTI.utils = {

    // pop-up for blocked clients
    blockedClientPopup: function () {
        //Check if the popup has not been shown already
        if (AGENTI.client.popUpShown !== 'true') {
            //set popup to shown
            AGENTI.client.popUpShown = 'true';
            setTimeout(function () {
                $('#clientBlocked').popup({
                    history: false
                });
                $('#clientBlocked').popup('open');
                //navigator.notification.beep(1);
                navigator.notification.vibrate(1000);
            }, 1000);
        }
    },
    //Open the map in native maps app
    //add blackberry support?
    openMap: function (address) {
        if (AGENTI.deviceType === 'Android') {
            window.location = "geo:0,0?q=" + address;
        } else {
            window.location = "maps:q=" + address;
        }
    },

    //parse the alternative addresses array string as returned by the server and split in separate records.
    parseAltAddress: function(string) {

        var altAddress = {};
        var addressesArray =[];

        var addressesTempArray = string.split(';');
        var arrayLength = addressesTempArray.length;
        var addressType = "";

        for (var i=0; i < arrayLength; i++){

            switch (addressesTempArray[i].substr(0,1)) {
                case "M":
                    addressType = "Magazzino";
                    break;
                case "F":
                    addressType = "Fatturazione";
                    break;
                case "E":
                    addressType = "Entrambi";
                    break;
                case "A":
                    addressType = "Altro";
                    break;
                default:
                    addressType = "";
            }

            addressesArray.push({

                addressType : addressType,
                address : addressesTempArray[i].substr(2)

            });
        }
        return addressesArray;
    },

    createContact: function () {

        // create a new contact
        var contact = navigator.contacts.create();
        contact.displayName =  AGENTI.client.ragSociale;
        contact.nickname =  AGENTI.client.ragSociale;

        // populate some fields
        var name = new ContactName();
        name.givenName = AGENTI.client.ragSociale;
        contact.name = name;

        // store contact phone numbers in ContactField[]
        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('work', AGENTI.client.noTelefono, true);
        phoneNumbers[1] = new ContactField('mobile', AGENTI.client.noCell, false);
        contact.phoneNumbers = phoneNumbers;

        // store contact emails in ContactField[]
        var emails = [];
        emails[0] = new ContactField('work', AGENTI.client.email, true);
        contact.emails = emails;
        /*
         var address = new ContactAddress();
         address.formatted = AGENTI.client.indirizzo + " " + AGENTI.client.indirizzo2;
         address.type = 'work';
         address.pref = true;
         contact.address = address;*/

        // save the contact
        contact.save(onSuccess,onError);

        function onSuccess(contact) {
            navigator.notification.alert("Contatto aggiunto nella rubrica del telefono");
        };

        function onError(contactError) {
            navigator.notification.alert("Errore di salvataggio  = " + contactError.code);
        };


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
}());