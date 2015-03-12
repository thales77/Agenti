#!/usr/bin/env node

//this hook installs all your plugins

// add your plugins to this list--either the identifier, the filesystem location or the URL
var pluginlist = [
    "org.apache.cordova.splashscreen",
    "org.apache.cordova.dialogs",
    "org.apache.cordova.device",
    "com.phonegap.plugins.barcodescanner",
    "org.apache.cordova.vibration",
    "org.apache.cordova.contacts",
    "org.apache.cordova.file",
    "uk.co.whiteoctober.cordova.appversion",
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
