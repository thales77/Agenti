var AGENTI = {
    remoteUrl: "http://85.33.180.83/test/phonegapsrv/index.php",
    deviceType: "",
    appVersion: "",
    db: localStorage
};

//start
$('#loginPage').on('pageinit', function () {
    $(document).on('deviceready', function () {
        AGENTI.init();
    });
});