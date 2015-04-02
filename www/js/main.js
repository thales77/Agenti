require.config({
    baseUrl: "/js/",
    paths: {
        jquery: 'lib/jquery-2.1.3.min',
        'jquery.validate': 'lib/jquery.validate',
        'jquery.mobile-config': 'lib/jquery.mobile-config',
        'jquery.mobile': 'lib/jquery.mobile-1.4.5.min',
        'date': 'lib/date',
        'datebox.core': 'lib/jqm-datebox.core.min',
        'datebox.core.mode.datebox': 'lib/jqm-datebox.mode.datebox.min',
        'datebox.options': 'lib/jquery.mobile.datebox.i18n.it.utf8',
        'jspdf': 'lib/jspdf.debug',
        'jspdf.autotable': 'lib/jspdf.plugin.autotable'
    },
    shim: {
        'jquery.mobile-config': ['jquery'],
        'jquery.mobile': ['jquery','jquery.mobile-config']
    }
});

require([
    'jquery',
    'app',
    'jquery.mobile','jquery.mobile.asyncfilter'
], function( $, App ){
    $(function(){
        App.initialize();
    });
});

//start
$('#loginPage').on('pageinit', function () {
    $(document).on('deviceready', function () {
        AGENTI.init();
    });
});