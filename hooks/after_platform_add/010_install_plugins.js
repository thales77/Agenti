#!/usr/bin/env node

//this hook installs all your plugins

// add your plugins to this list--either the identifier, the filesystem location or the URL
var pluginlist = [
    "cordova-plugin-dialogs",
    "cordova-plugin-device",
    "cordova-plugin-barcodescanner",
    "cordova-plugin-vibration",
    "cordova-plugin-contacts",
    "cordova-plugin-file",
    "cordova-plugin-console",
    "cordova-plugin-whitelist",
    "cordova-plugin-app-version",
    "cordova-sqlite-ext", //This is a version of the cordova-sqlite-storage plugin with extra support for pre-populated databases
    "de.appplant.cordova.plugin.email-composer",
    "cordova-plugin-ftp"
];

// no need to configure below

var fs = require('fs');
var path = require('path');
var util = require('util');
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
    console.log(stdout)
}

pluginlist.forEach(function(plug) {
    exec("phonegap plugin add " + plug, puts);
});
