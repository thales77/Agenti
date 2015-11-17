#!/usr/bin/env node

//this hook installs all your plugins

// add your plugins to this list--either the identifier, the filesystem location or the URL
var pluginlist = [
    "cordova-plugin-dialogs",
    "cordova-plugin-device",
    "phonegap-plugin-barcodescanner",
    "cordova-plugin-vibration",
    "cordova-plugin-contacts",
    "cordova-plugin-file",
    "cordova-plugin-console",
    "cordova-plugin-whitelist",
    "cordova-plugin-app-version",
    "https://github.com/litehelpers/Cordova-sqlite-storage", //change to Cordova-sqlite-storage as soon as they fix it
    "de.appplant.cordova.plugin.email-composer"
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
