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
    "cordova-sqlite-storage",
    "cordova-plugin-app-version",
    "cordova-sqlite-storage",
    "de.appplant.cordova.plugin.email-composer"
];

// no need to configure below

var fs = require('fs');
var path = require('path');
var sys = require('sys');
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
    console.log(stdout)
}

pluginlist.forEach(function(plug) {
    exec("phonegap plugin add " + plug, puts);
});
