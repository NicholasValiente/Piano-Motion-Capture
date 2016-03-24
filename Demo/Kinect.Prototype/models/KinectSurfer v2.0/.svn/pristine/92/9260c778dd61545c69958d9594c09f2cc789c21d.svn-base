
var ge;
var ROLL; var ROLLS = [0, 0];
var YAW; var YAWS = [0, 0];
var PITCH; var PITCHS = [0, 0];
var CURRENT_HEADING;
var CURRENT_PITCH;
var currentAltitude = 0.0;
var MODE; //1 = Surfing Mode (Default), 2 = Follow Mode, 3 = Tablet. 
var master;
var slowdown;
var last;
var localAnchorLla;
var localAnchorCartesian;
var camera;
var playerid;

var socket;
var socket2;
var TOT_FEATS;

google.load("earth", "1");
google.setOnLoadCallback(init);

function init() {
    google.earth.createInstance('map3d', initCB, failureCB);
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = "no";
}

function initCB(instance) {

    ROLL = 0;
    PITCH = 0;
    YAW = 0;
    CURRENT_HEADING = YAW;
    CURRENT_PITCH = PITCH;
    currentAltitude = 300;
    MODE = 1;
    master = false;
    slowdown = 0;

    //GE Conference
    TOT_FEATS = 0;

    //Movement Variables
    last = (new Date()).getTime();
    localAnchorLla = [-33.87463, 151.20362, currentAltitude]; // Change decimal lat/long to surf somewhere else
    //localAnchorLla = [37.797738, -122.388320, currentAltitude]; San Francisco
    localAnchorCartesian = V3.latLonAltToCartesian(localAnchorLla);

    //Initialising Google Earth
    ge = instance;
    ge.getWindow().setVisibility(true);
    ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
    ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT);

    //Initalising Camera
    camera = ge.createCamera('');
    camera.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
    camera.setLatitude(-33.87463); //Sydney
    camera.setLongitude(151.20362); //Sydney
    camera.setAltitude(300);

 


    /*-----------------------
    | WEB SOCKET INITIALIZE  |
    ------------------------*/

    // Initialize new web sockets.
    socket = new WebSocket("ws://localhost:8181/"); // Kinect WS source
    socket2 = new WebSocket("ws://192.168.0.233:3000/relay"); // Models WS source

    var qryArgs = getQueryStringVars();

    if (qryArgs["player"]) {
        playerid = qryArgs["player"];
    }
    if (qryArgs["master"]) {
        if (qryArgs["master"] == 'true') { master = true; }
    }
    if (qryArgs["mode"]) {
        MODE = qryArgs["mode"];
    }
    if (!master) { ge.getOptions().setMouseNavigationEnabled(false); }

    if (models_included) {
        initPlayers();
        initRingArray();
        drawRings();
        initTail();
    }
    if (kinectMan_included) {
        initMan();
    }
    websocketSetup();
}

function websocketSetup() {

    socket.onmessage = function (evt) { if (MODE == 1) { doKinect(evt.data) } }; //Kinect 

    if (models_included) {
        if (master && MODE == 1) { google.earth.addEventListener(ge, 'frameend', sendCam); } //models
        socket2.onmessage = function (evt) { deSerialize(evt.data) }; //models
    }

}

function updateCamera() {
    camera.setLatitude(localAnchorLla[0]);
    camera.setLongitude(localAnchorLla[1]);
    ge.getView().setAbstractView(camera);
}

function getQueryStringVars() {

    var server_variables = {};
    var query_string = window.location.search.split("?")[1];
    if (!query_string) return false;
    var get = query_string.split("&");

    for (var i = 0; i < get.length; i++) {

        var pair = get[i].split("=");
        server_variables[pair[0]] = unescape(pair[1]);
    }

    return server_variables;
}

function closeSocket() {
    socket.close();
}

function failureCB(errorCode) {
    //socket.send(errorCode);
}

function debug(message) {
    lbldebug.innerHTML = message;
}


