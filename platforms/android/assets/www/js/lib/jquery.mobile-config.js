/**
 * Created by Babis on 02/04/2015.
 */
//application-wide settings
$(document).on("mobileinit", function () {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.pushStateEnabled = false;
    $.mobile.ajaxEnabled = true;
    $.mobile.defaultPageTransition = 'none';
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.buttonMarkup.hoverDelay = 0;
    $.mobile.touchOverflowEnabled = true;
    $.mobile.listview.prototype.options.filterPlaceholder = "Filtra risultati..."
    $.mobile.loader.prototype.options.text = "Attendere...";
    $.mobile.loader.prototype.options.textVisible = true;
    //$.mobile.loader.prototype.options.theme = "a";
    //$.mobile.loader.prototype.options.html = "";
});
