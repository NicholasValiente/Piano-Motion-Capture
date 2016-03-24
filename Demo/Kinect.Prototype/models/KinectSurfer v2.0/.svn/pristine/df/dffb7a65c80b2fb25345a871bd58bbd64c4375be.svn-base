/*------------
| MODEL CODE |
------------*/

models_included = true; // check if models.js has been included in surfing.htm

var scale;
var queue = new queue();
var tailModel;
var tailpm;
var tail;
var slow;
var rings = new Array();
var ringpms = new Array();
var ringmodels = new Array();
var ringlinks = new Array();
var ringoriens = new Array();
var playermodels = new Array();
var playerpms = new Array();
var playerlinks = new Array();
var playeroriens = new Array();
var count = 0;

function sendCam() {

    var camS = {};

    count++;
    var cameraS = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);

    // serialise
    camS.cou = count;
    camS.id = playerid;
    camS.Lat = cameraS.getLatitude();
    camS.Lon = cameraS.getLongitude();
    camS.Til = cameraS.getTilt();
    camS.Rol = cameraS.getRoll();
    camS.Alt = cameraS.getAltitude();
    camS.Hea = cameraS.getHeading();

    var JSONcam = JSON.stringify(camS);

    //websocket send
    socket2.send(JSONcam);
}

function deSerialize(message) {
    if (!checkCommand(message)) {
        var cam = JSON.parse(message);

        if (cam.id != playerid && MODE == 2 && master == true) { // on rig master follow tablet ws cam stream
            camera.setLatitude(cam.Lat);
            camera.setLongitude(cam.Lon);
            camera.setAltitude(cam.Alt);
            camera.setHeading(cam.Hea);
            camera.setTilt(cam.Til);
            camera.setRoll(cam.Rol);

            ge.getView().setAbstractView(camera);
        } else if (cam.id != playerid && MODE == 1) { // tablet stream used to place model
            var scale = (cam.Alt / 100) * (cam.Alt / 100);
            if (scale < 30) { scale = 30; }
            if (scale > 50000) { scale = 50000; }

            if (cam.id == 1) { // flip XWing 
                playeroriens[cam.id - 1].setHeading(cam.Hea + 180);
                playeroriens[cam.id - 1].setRoll(cam.Rol + 180);
                playeroriens[cam.id - 1].setTilt(cam.Til + 90);
            } else { // TIE
                playeroriens[cam.id - 1].setHeading(cam.Hea);
                playeroriens[cam.id - 1].setRoll(cam.Rol + 180);
                playeroriens[cam.id - 1].setTilt(270 - cam.Til);
            }

            playermodels[cam.id - 1].setOrientation(playeroriens[cam.id - 1]);
            playermodels[cam.id - 1].setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
            playermodels[cam.id - 1].getLocation().setLatLngAlt(cam.Lat, cam.Lon, cam.Alt);
            var modscale = ge.createScale('');
            modscale.set(scale, scale, scale);
            playermodels[cam.id - 1].setScale(modscale);
            playerpms[cam.id - 1].setGeometry(playermodels[cam.id - 1]);

            if (0) {
                slowdown = slowdown + 1;
                if (slowdown > 20) {
                    updateTail(cam.Lat, cam.Lon, cam.Alt);
                    drawTail();
                    slowdown = 0;
                }
            }
        }
    }
}

function checkCommand(message) {
    if (message.substring(0, 4) == "cmd ") {
        var command = message.substring(4, message.length);
        if (command == "grid on") {
            gridlines(1);
        } else if (command == "grid off") {
            gridlines(0);
        } else if (command == "sun on") {
            sun(1);
        } else if (command == "sun off") {
            sun(0);
        } else if (command == "layer ROADS on") {
            layer("ROADS", 1);
        } else if (command == "layer ROADS off") {
            layer("ROADS", 0);
        } else if (command == "layer TREES on") {
            layer("TREES", 1);
        } else if (command == "layer TREES off") {
            layer("TREES", 0);
        } else if (command == "layer BORDERS on") {
            layer("BORDERS", 1);
        } else if (command == "layer BORDERS off") {
            layer("BORDERS", 0);
        } else if (command == "layer BUILDINGS on") {
            layer("BUILDINGS", 1);
        } else if (command == "layer BUILDINGS off") {
            layer("BUILDINGS", 0);
        } else if (command == "refresh") {
            location.reload(true);
        } else if (command == "follow") {
            MODE = 2;
        } else if (command == "surf") {
            localAnchorLla = [camera.getLatitude(), camera.getLongitude(), camera.getAltitude()];
            currentAltitude = camera.getAltitude();
            localAnchorCartesian = V3.latLonAltToCartesian(localAnchorLla);
            MODE = 1;
        } else if (command == "util1") {
            //utilities1
            var i;
            for (i = 0; i < TOT_FEATS; i++) {
                ge.getFeatures().removeChild(ge.getFeatures().getLastChild());
            }
            TOT_FEATS = 1;

            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/utilities1/kml/powerNetwork.kmz');
            //remove features

        } else if (command == "resource1") {
            var j;
            for (j = 0; j < TOT_FEATS; j++) {
                ge.getFeatures().removeChild(ge.getFeatures().getLastChild());
            }
            TOT_FEATS = 4;
            //resource1
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/resource1/models/GasOil.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/resource1/models/AOI.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/resource1/models/dashedLine.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/resource1/models/newRoutes.kmz');

        } else if (command == "util2") {
            //utilities2
            var k;
            for (k = 0; k < TOT_FEATS; k++) {
                ge.getFeatures().removeChild(ge.getFeatures().getLastChild());
            }
            TOT_FEATS = 4;
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/utilities2/kml/sewage.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/utilities2/kml/water.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/utilities2/kml/transmission.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/utilities2/kml/UtilityFacilities.kmz');

        } else if (command == "gov1") {
            //goverment 1
            var l;
            for (l = 0; l < TOT_FEATS; l++) {
                ge.getFeatures().removeChild(ge.getFeatures().getLastChild());
            }
            TOT_FEATS = 9;
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge1.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge1p.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge1ed.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge1wd.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge2.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge2p.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge2ed.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge2wd.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/fish.kmz');

        } else if (command == "gov2") {
            //government 2
            var m;
            for (m = 0; m < TOT_FEATS; m++) {
                ge.getFeatures().removeChild(ge.getFeatures().getLastChild());
            }
            TOT_FEATS = 5;
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government2/models/faultline.kml');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government2/models/evac.kml');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government2/models/280m.kml');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government2/models/hydrants.kml');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government2/models/staging.kml');

        } else if (command == "telco2") {
            // telco2
            var n;
            for (n = 0; n < TOT_FEATS; n++) {
                ge.getFeatures().removeChild(ge.getFeatures().getLastChild());
            }
            TOT_FEATS = 2;
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/telco2/kml/DemoTelcoTowers.kmz');
            addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/telco2/kml/DemoTelcoCoverages-incident.kmz');

        }

        return true;
    } else {
        return false;
    }
}

//Code for Google Conference
function addKmlFromUrl(kmlUrl) {
    var link = ge.createLink('');
    link.setHref(kmlUrl);

    var networkLink = ge.createNetworkLink('');
    networkLink.setLink(link);

    ge.getFeatures().appendChild(networkLink);
}

function sun(flag) {
    if (flag == "1") {
        //doSend("sun on");
        ge.getSun().setVisibility(true);
    } else {
        //doSend("sun off");
        ge.getSun().setVisibility(false);
    }
}

function gridlines(flag) {
    if (flag == "1") {
        //doSend("grid on");
        ge.getOptions().setGridVisibility(true);
    } else {
        //doSend("grid off");
        ge.getOptions().setGridVisibility(false);
    }
}

function layer(layer, flag) {
    if (flag == 1) {
        flag = true;
    } else {
        flag = false;
    }

    if (layer == "ROADS") {
        ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, flag);
    } else if (layer == "TREES") {
        ge.getLayerRoot().enableLayerById(ge.LAYER_TREES, flag);
    } else if (layer == "BORDERS") {
        ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, flag);
    } else if (layer == "BUILDINGS") {
        ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, flag);
    }
}

function updateTail(lat, lon, alt) {
    var point = ge.createPoint('');
    point = queue.dequeue();
    point.setLatitude(lat);
    point.setLongitude(lon);
    point.setAltitude(alt);
    queue.enqueue(point);
}

function drawTail() {

    var tail = ge.createLineString('');
    tailpm.setGeometry(tail);

    tail.setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
    tail.setExtrude(false);
    tail.setTessellate(false);

    var i;
    var point;
    for (i = 0; i < 20; i++) {
        point = queue.dequeue();
        tail.getCoordinates().pushLatLngAlt(point.getLatitude(), point.getLongitude(), point.getAltitude());
        queue.enqueue(point);
    }
    tailpm.setStyleSelector(ge.createStyle(''));
    var tailStyle = tailpm.getStyleSelector().getLineStyle();
    tailStyle.setWidth(10);
    if (playerid == 1) {
        tailStyle.getColor().set('FF0000FF');
    } else {
        tailStyle.getColor().set('FFFF0000');
    }
    ge.getFeatures().appendChild(tailpm);
}

function initTail() {
    //Initialises a queue to store models used  to generate the "tail" effect
    //These models will be popped off, generated at a new location, then pushed
    //back onto the queue to be rendered one at a time, maintaining a "trail" state
    var i;
    var link;

    tailpm = ge.createPlacemark('');

    for (i = 0; i < 15; i++) {

        var point = ge.createPoint('');
        point.setLatitude(0);
        point.setLongitude(0);
        point.setAltitude(100);
        queue.enqueue(point);
    }
}

function initRingArray() {
    //Initialises the array storing all of the ring locations; these points are hardcoded locations

    //Bridge
    rings[0] = ge.createCamera('');
    rings[0].setLatitude(-33.85206116546625);
    rings[0].setLongitude(151.21075014076803);
    rings[0].setAltitude(400);
    rings[0].setHeading(295);
    rings[0].setTilt(0);
    rings[0].setRoll(0);

    //Centerpoint Tower
    rings[1] = ge.createCamera('');
    rings[1].setLatitude(-33.87051713231955);
    rings[1].setLongitude(151.2089196340125);
    rings[1].setAltitude(500);
    rings[1].setHeading(20);
    rings[1].setTilt(0);
    rings[1].setRoll(0);

    //Opera House
    rings[2] = ge.createCamera('');
    rings[2].setLatitude(-33.85647746674686);
    rings[2].setLongitude(151.21539736966128);
    rings[2].setAltitude(350);
    rings[2].setHeading(345);
    rings[2].setTilt(0);
    rings[2].setRoll(0);

    //Island
    rings[3] = ge.createCamera('');
    rings[3].setLatitude(-33.85277242888568);
    rings[3].setLongitude(151.19518041484696);
    rings[3].setAltitude(500);
    rings[3].setHeading(100);
    rings[3].setTilt(0);
    rings[3].setRoll(0);

    //Island 2
    rings[4] = ge.createCamera('');
    rings[4].setLatitude(-33.847886442832646);
    rings[4].setLongitude(151.17302947077044);
    rings[4].setAltitude(450);
    rings[4].setHeading(-80);
    rings[4].setTilt(0);
    rings[4].setRoll(0);

    //Intersection
    rings[5] = ge.createCamera('');
    rings[5].setLatitude(-33.83899738245863);
    rings[5].setLongitude(151.14492521934753);
    rings[5].setAltitude(425);
    rings[5].setHeading(-100);
    rings[5].setTilt(0);
    rings[5].setRoll(0);

    //Sticky Outy Bit
    rings[6] = ge.createCamera('');
    rings[6].setLatitude(-33.85295290380713);
    rings[6].setLongitude(151.11663584044823);
    rings[6].setAltitude(475);
    rings[6].setHeading(5);
    rings[6].setTilt(0);
    rings[6].setRoll(0);

    //Park
    rings[7] = ge.createCamera('');
    rings[7].setLatitude(-33.87265406702083);
    rings[7].setLongitude(151.11497495616567);
    rings[7].setAltitude(450);
    rings[7].setHeading(155);
    rings[7].setTilt(0);
    rings[7].setRoll(0);

    //Park
    rings[8] = ge.createCamera('');
    rings[8].setLatitude(-33.88634599261195);
    rings[8].setLongitude(151.13468354866743);
    rings[8].setAltitude(475);
    rings[8].setHeading(100);
    rings[8].setTilt(0);
    rings[8].setRoll(0);

    //Road
    rings[9] = ge.createCamera('');
    rings[9].setLatitude(-33.887918557061845);
    rings[9].setLongitude(151.16950205667513);
    rings[9].setAltitude(490);
    rings[9].setHeading(85);
    rings[9].setTilt(0);
    rings[9].setRoll(0);

    //Finish
    rings[10] = ge.createCamera('');
    rings[10].setLatitude(-33.8844656522078);
    rings[10].setLongitude(151.20894468812577);
    rings[10].setAltitude(490);
    rings[10].setHeading(85);
    rings[10].setTilt(0);
    rings[10].setRoll(0);

    //Finish (Imperial Star Destroyer)
    rings[11] = ge.createCamera('');
    rings[11].setLatitude(-33.85543128617356);
    rings[11].setLongitude(151.21241027523143);
    rings[11].setAltitude(7999.903289511771);
    rings[11].setHeading(85);
    rings[11].setTilt(0);
    rings[11].setRoll(0);
}

function drawRings() {
    //Draw all of the rings in the array			

    var i;

    for (i = 0; i <= 10; i++) { // 11 includes star destroyer
        ringmodels[i] = ge.createModel('');
        ringlinks[i] = ge.createLink('');
        if (i == 1) {

            ringlinks[i].setHref('http://192.168.0.233/bluering.dae');
        } else if (i == 10) {
            ringlinks[i].setHref('http://192.168.0.233/greenring.dae');
        } else if (i == 11) {
            ringlinks[i].setHref('http://192.168.0.233/Imperial.dae');
        } else {
            ringlinks[i].setHref('http://192.168.0.233/redring.dae');
        }
        ringoriens[i] = ge.createOrientation('');
        ringpms[i] = ge.createPlacemark('');
        ringpms[i].setName('ring' + i);
        ge.getFeatures().appendChild(ringpms[i]);
        ringoriens[i].setHeading(rings[i].getHeading());
        ringoriens[i].setTilt(rings[i].getTilt());
        ringoriens[i].setRoll(rings[i].getRoll());
        var ringscale = ge.createScale('');
        if (i == 11) {
            ringscale.set(50, 50, 50);
        }
        else {
            ringscale.set(10, 10, 10);
        }
        ringmodels[i].setScale(ringscale);
        ringmodels[i].setOrientation(ringoriens[i]);
        ringmodels[i].setLink(ringlinks[i]);
        ringmodels[i].setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
        ringmodels[i].getLocation().setLatLngAlt(rings[i].getLatitude(), rings[i].getLongitude(), rings[i].getAltitude());
        ringpms[i].setGeometry(ringmodels[i]);
    }
}

function initPlayers() {
    //Initialises all of the player data
    var i;
    for (i = 0; i < 3; i++) {
        playermodels[i] = ge.createModel('');
        playerlinks[i] = ge.createLink('');
        playeroriens[i] = ge.createOrientation('');
        if (i == 0) {
            playerlinks[i].setHref('http://192.168.0.233/xwing.dae');
            playerlinks[i].setHref('http://192.168.0.233/xwing.dae');
        } else {
            playerlinks[i].setHref('http://192.168.0.233/models/beachball.dae'); // tie.dae or models/beachball.dae
        }
        playerpms[i] = ge.createPlacemark('');
        playerpms[i].setName('player' + i);
        ge.getFeatures().appendChild(playerpms[i]);
        playermodels[i].setLink(playerlinks[i]);
        playermodels[i].setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
        playerpms[i].setGeometry(playermodels[i]);
    }
}

