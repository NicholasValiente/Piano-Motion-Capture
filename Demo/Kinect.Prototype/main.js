var game = 1; //the map scenario to load
var time = 1.5; //game length (in minutes)
var numRings = 5; //the number of rings to place between each placemark
var variance = 0; //the randomness at which to place the rings(between 1 and 10 works best)



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

/*Placemark Locations*/
//Alf var harbour = [-33.875716,151.201699];
var harbour = [-33.836,151.197];
var bridge = [-33.852845,151.210917];
var operaHouse = [-33.856785,151.215044];
var hydePark = [-33.871003,151.211783];
var central = [-33.884169,151.206207];
var anzacBridge = [-33.869204,151.186195];
var centrepoint = [-33.870291,151.208888];
var cricketground = [-33.891552,151.224794];
var darlingPoint = [-33.86769,151.238391];

document.getElementById("minutes").value = Math.floor(time); //initialises the time on screen
document.getElementById("seconds").value = (time * 60) % 60;

var sVal = 10; //The scale on the models (e.g. val10 = 10x larger than default)
var sVals =[sVal, sVal, sVal]; //apply the same scale value to each axis

google.load("earth", "1");
google.setOnLoadCallback(init);


function init() {
    google.earth.createInstance('map3d', initCB, failureCB);
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = "no";
}

/*Sound functions*/
var channel_max = 10;										// number of channels (not a system Limitation.. just a coded one
	audiochannels = new Array();
	for (a=0;a<channel_max;a++) {									// prepare the channels
		audiochannels[a] = new Array();
		audiochannels[a]['channel'] = new Audio();						// create a new audio object
		audiochannels[a]['finished'] = -1;							// expected end time for this channel
	}
function play_multi_sound(s)  //picks an available channel to play sound 's'
{
	for (a=5;a<audiochannels.length;a++)  //hardcoded to start from 4; to allow start music to take 0, game music to take 1 and flight to use 2 and end of game to use 3 and clossness to use 4
	{
		thistime = new Date();
		if (audiochannels[a]['finished'] < thistime.getTime()) // is this channel finished?
		{			
			audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000;
			audiochannels[a]['channel'].src = document.getElementById(s).src;
			audiochannels[a]['channel'].load();
			audiochannels[a]['channel'].play();
			break;
		}
	}
}

function playSounds(channel,s) //play sound 's' on channel 'channel'
{
	thistime = new Date();
	if (audiochannels[channel]['finished'] < thistime.getTime()) // is this channel finished?
	{			
		audiochannels[channel]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000;
		audiochannels[channel]['channel'].src = document.getElementById(s).src;
		audiochannels[channel]['channel'].load();
		audiochannels[channel]['channel'].play();
	}
}
function stopSounds(channel)	// stops the sound on channel 'channel'
{		
		audiochannels[channel]['channel'].pause();
		audiochannels[channel]['finished'] = -1;
}
function stopAllSounds()	//stops all the sounds
{
for (a=0;a<audiochannels.length;a++) 
	{
		audiochannels[a]['channel'].pause();
	}
}
	

function initCB(instance) {

    ROLL = 0;
    PITCH = 0;
    YAW = 0;
    CURRENT_HEADING = YAW;
    CURRENT_PITCH = PITCH;
    currentAltitude = 500;
    MODE = 1;
    master = false;
    slowdown = 0;

    //GE Conference
    TOT_FEATS = 0;
    //Movement Variables
    last = (new Date()).getTime();
    localAnchorLla = [-33.875716, 151.201699, currentAltitude]; // Change decimal lat/long to surf somewhere else
    //localAnchorLla = [37.797738, -122.388320, currentAltitude]; //San Francisco
    localAnchorCartesian = V3.latLonAltToCartesian(localAnchorLla);

    //Initialising Google Earth
    ge = instance;
    ge.getWindow().setVisibility(true);
    ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
    ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT);

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
    //Alf if (!master) { ge.getOptions().setMouseNavigationEnabled(false); }

    drawRings();
    websocketSetup();
	
	//Initalising Camera
    camera = ge.createCamera('');
    //Alf camera.setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
	camera.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
    camera.setLatitude(-33.875716); //game start
    camera.setLongitude(151.201699); //game start
	camera.setHeading(0);
    camera.setAltitude(500);
}

function websocketSetup() {

    socket.onopen = function () {

        var rate = "rate,unrated";                             //format: rate then rate number
        var scale = "scale,640000,480000,10000";          //format: scale then X scale, Y scale, Z scale
        var joints = "joints,0,2,4,6,8,10";                    //format: joints then any order of joints 0-19 ("joints,all" for all joints)
        var tilt = "tilt,0";

        socket.send(scale);  // messages can be sent in any order
        socket.send(joints);
        socket.send(rate);
        socket.send(tilt);

		console.log("socket onopen");
    };

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
	checkIncrementScore();
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
    socket.send(errorCode);
}

function debug(message) {
    lbldebug.innerHTML = message;
}


/*------------\
| KINECT CODE |
\------------*/

var MOVE_FORWARD = true;
var MOVE_BACKWARD;
var MOVE_SPEED = 0.0;
var newROLL;
var altSpeedup;
var wristDelta;
var now;
var dt;

var localToGlobalFrame;
var headingVec;
var rightVec;
var strafe = 0.0;
var forward = 0;
var forwardVelocity;
var tilt;
var altOffset = 0;

var joint = {}; //joint object
var joint_by_id = [0, 2, 4, 6, 8, 10]; // these are the joints that this client wants to use, needs to be in order low-high!

var hipcenter = 0;
var spine = 1;
var shouldercenter = 2;
var head = 3;
var shoulderleft = 4;
var elbowleft = 5;
var wristleft = 6;
var handleft = 7;
var shoulderright = 8;
var elbowright = 9;
var wristright = 10;
var handright = 11;
var hipleft = 12;
var kneeleft = 13;
var ankleleft = 14;
var footleft = 15;
var hipright = 16;
var kneeright = 17;
var ankleright = 18
var footright = 19;


function doKinect(evt) {

    status.innerHTML = "Kinect data received.";

    var message = evt;
    var vals = new Array();
    vals = message.split(",");

    var i = 0; // used to step through the received values array
    for (var j = 0; j < joint_by_id.length; j++) {
        var x = parseInt(vals[i++]) / 1000;
        var y = parseInt(vals[i++]) / 1000;
        var z = parseInt(vals[i++]) / 10000;
        joint[joint_by_id[j]] = { x: x, y: y, z: z }
    }

            MOVE_BACKWARD = false;

            PITCH = joint[shoulderleft].y - joint[shoulderright].y;
            ROLL = ((joint[hipcenter].z - joint[shouldercenter].z) * 150) + 10;
            YAW = joint[shoulderright].z - joint[shoulderleft].z;

            newROLL = ROLL;
            if (ROLL > 0) {

            }
            else {
                newROLL = ROLL * 2;
            }
            ROLL = newROLL;

            if (joint[wristright].y > joint[hipcenter].y && joint[wristleft].y > joint[hipcenter].y) {
                {
					MOVE_BACKWARD = true; //stop
					stopSounds(2);
				}
            }
            else {
				playSounds(2, 'flightaudio1');
                altSpeedup = camera.getAltitude() / 1100; //Math.exp(camera.getAltitude())

//                if (altSpeedup > 4)
//                {
//                    altSpeedup = Math.exp(camera.getAltitude() / 1100);
//                }
                

                if (altSpeedup < 1) {
                    altSpeedup = 1;
                }

                wristDelta = joint[wristright].x - joint[shoulderright].x;

                if (wristDelta < 0) {
                    MOVE_SPEED = 0;
                }
                else {
                    wristDelta /= 3;
                    MOVE_SPEED = ((wristDelta * wristDelta) / 3) * altSpeedup;
                }
            }

            now = (new Date()).getTime();
            dt = (now - last) / 1000.0;
            if (dt > 0.25) {
                dt = 0.25;
            }
            last = now;

            updatePosition(dt);
            updateView();
            updateCamera();
}

function updateView() {
    camera.setTilt(PITCH + 90);
    camera.setRoll(ROLL);
    camera.setHeading(((YAW + CURRENT_HEADING) * 6) % 360);
    camera.setAltitude(currentAltitude);
    CURRENT_HEADING += YAW;
}

function updatePosition(dt) {
    localToGlobalFrame = M33.makeLocalToGlobalFrame(localAnchorLla);
    headingVec = V3.rotate(localToGlobalFrame[1], localToGlobalFrame[2], -(camera.getHeading() * Math.PI / 180));
    rightVec = V3.rotate(localToGlobalFrame[0], localToGlobalFrame[2], -(camera.getHeading() * Math.PI / 180));

    strafe = ROLL * dt * -1;

    if (MOVE_FORWARD) {
        forwardVelocity = MOVE_SPEED;
        if (MOVE_BACKWARD) forwardVelocity *= -1;
        forward = forwardVelocity * dt;
    }

    if (MOVE_BACKWARD) {
        forward = 0;
    }

    tilt = camera.getTilt();
    tilt++;

    if (tilt < 90) {
        tilt = 90 - tilt;
        altOffset = -forward * Math.tan(tilt * Math.PI / 180);
    }
    else if (tilt > 90) {
        tilt = tilt - 90;
        altOffset = forward * Math.tan(tilt * Math.PI / 180);
    }

    currentAltitude += altOffset;

    localAnchorCartesian = V3.add(localAnchorCartesian, V3.scale(rightVec, strafe));
    localAnchorCartesian = V3.add(localAnchorCartesian, V3.scale(headingVec, forward));
    localAnchorLla = V3.cartesianToLatLonAlt(localAnchorCartesian);
}

/*------------
| MODEL CODE |
------------*/

models_included = true; // check if models.js has been included in surfing.htm

var scale;
var count = 0;
var score = 0;
var totRings;
var lat, lon,alt ,ring, model, link, loc, passed, ori, orientations
var start = 0; // Game progress variable which determines ambience

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
        }
    }
}


function spaceRings(sLat, sLon, fLat, fLon, noRings, passedLat, passedLon, passedAlt, m) //takes in 2 coordinate points and allocates the number of spots 'norings' between them evenly. It then stores thes points in lat and lon
{
	var latDiffVal = (fLat - sLat)/noRings; //distance to place between rings
	var lonDiffVal = (fLon - sLon)/noRings; 
	var randNum 
	randNum = new Array();
	var t;
	
	var j;
	
	for (j=1; j<=noRings; j++)
	{
		for (t=0; t<=2;t++){
			randNum[t] = gRand(variance);
		}//generate random numbers for each ring location (used to randomize positions slightly)
		
		// Alf passedAlt[m] = (500 + randNum[0]);
		passedAlt[m] = (150 + randNum[0]);
		passedLat[m] = (sLat + (latDiffVal * j) + (randNum[1]/1000));
		passedLon[m] = (sLon + (lonDiffVal * j) + (randNum[2]/1000));
		m++;
	}
	

	return m;
}

function gRand(m)	//generate random between 0 and m
{
	var randomNum;
	randomNum = Math.floor((Math.random()*m)+1);
	return randomNum;
}

function drawRings() 
{
	var arbPoint;
	if(game == 1)
		arbPoint = [harbour[0],harbour[1], bridge[0],bridge[1], operaHouse[0],operaHouse[1], darlingPoint[0],darlingPoint[1], cricketground[0],cricketground[1], central[0],central[1], anzacBridge[0],anzacBridge[1]];
	else if (game == 2)
		arbPoint = [harbour[0],harbour[1], bridge[0],bridge[1], anzacBridge[0],anzacBridge[1], central[0],central[1], centrepoint[0],centrepoint[1], cricketground[0],cricketground[1], darlingPoint[0],darlingPoint[1]];
	else if (game == 3)
		arbPoint = [harbour[0],harbour[1], bridge[0],bridge[1], cricketground[0],cricketground[1], darlingPoint[0],darlingPoint[1]];
	else
		arbPoint = [harbour[0], harbour[1], bridge[0],bridge[1]];
		//arbPoint = [-33.852392,151.210493, -33.796554,151.286275, -33.871913,151.265504, -33.876474,151.158215];
		
	
	var numPoints = (arbPoint.length / 2);	//the number of placemarks in the game
	var i, m = 0;
	var j, n;
	totRings = numRings * (numPoints-1); //the total number of rings in the game
	var ori;
	
	//Dynamic Array for Location Data
	lat = new Array(); 
	lon = new Array(); 
	alt = new Array();	
	
	//Space Rings function calls	
	var k;
	for (k=0;k<(numPoints-1)*2;)
	{
		m = spaceRings(arbPoint[k],arbPoint[k+1],arbPoint[k+2],arbPoint[k+3],(numRings),lat, lon, alt, m);
		k = k+2;
	}
	//Dynamic Arrays for Ring Setup
	ring  = new Array();
	model = new Array();
	link = new Array();
	loc = new Array();
	passed = new Array();
	ori = new Array();
	orientations = new Array();

	

	/*Draw in the rings in location 'lat & 'lon' using models (dae)*/
	for (i=0; i<totRings; i++)
	{
		passed[i] = false;
		ring[i] = ge.createPlacemark('');	//google's container
		ring[i].setName('ring' + i);
		
		model[i] = ge.createModel('');		//create container for the model
		ring[i].setGeometry(model[i]);	//put the model in the placemark
		ring[i].getGeometry().setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);	//change the altitude mode (default = fixedtoground)
		
		link[i] = ge.createLink('');	//link to the .dae file
		if(i == 0)
			//link[i].setHref('http://192.168.0.233/greenring.dae');
			link[i].setHref('https://googledrive.com/host/0B8mfyyIphB5OdW1GYjlvWGhJSnM/greenring.dae');
		else if (i == (totRings-1))
			//link[i].setHref('http://192.168.0.233/redring.dae');
			link[i].setHref('https://googledrive.com/host/0B8mfyyIphB5OdW1GYjlvWGhJSnM/redring.dae');
		else
			//link[i].setHref('http://192.168.0.233/bluering.dae');
			link[i].setHref('https://googledrive.com/host/0B8mfyyIphB5OdW1GYjlvWGhJSnM/bluering.dae');
		model[i].setLink(link[i]);	//set the link to the model (practically put the image into the placemark)
		
		loc[i] = ge.createLocation('');
		loc[i].setLatLngAlt(lat[i], lon[i], alt[i]);	//set the location
		model[i].setLocation(loc[i]);	//apply location to the model
		
		/*code used to adjust the heading of the model to match approximately to the position of the next model*/
		if (i > 0)
		{
			/*current ring*/
			var difLon =lon[i]-lon[i-1];
			var difLat =lat[i]-lat[i-1];
			var result = difLon/difLat;	//gradient = rise/run
			/*next ring*/
			var difLon2 =lon[i+1]-lon[i];
			var difLat2 =lat[i+1]-lat[i];
			var result2 = difLon2/difLat2;
			var differences = (Math.abs(result - result2)/2);	//average the 2 results
			
			if (i == (totRings-1))
				orientations[i] = Math.atan(result) * 180/Math.PI; //dont apply heading variations to the final ring
			else
				orientations[i] = (Math.atan(result) + (differences)) * 180/Math.PI;
		}
		else
			orientations[i] = 0;	//point first ring north
		
		ori[i] = ge.createOrientation('');
		ori[i].setHeading(orientations[i]);	//set the orientation
		model[i].setOrientation(ori[i]);	//apply the orientation to the model
		
		var scale = ge.createScale('');
		scale.set(sVals[0], sVals[1], sVals[2]);	//set the scale
		model[i].setScale(scale);	//apply the scale to the model
		
		ge.getFeatures().appendChild(ring[i]);	//append the placemark to the list of google features
	}
}


function checkIncrementScore()	//check to see if the player is passing a ring
{
	var m;
	if (start == 0)
	{
		playSounds(0, 'multiaudio2'); //play the start game music  on channel 0
	}
	else if (start == 1)
	{
	playSounds(1, 'multiaudio1'); //play the music file on channel 1
	}
	else if (start == 2)
	{
	playSounds(3, 'multiaudio3'); //play the end game music file on channel 3	
	}
	
	for (m=0;m<totRings;m++)	//for each ring
	{	
		if (passed[m] == false)	//if the ring hasn't yet been passed
		{
			/*if the camera is within the area of the ring*/
			if (((camera.getLatitude() > (lat[m] -(0.0001*sVals[0]*3))) && (camera.getLatitude() < (lat[m] +(0.0001*sVals[0]))))
			&& ((camera.getLongitude()> (lon[m] -(0.0001*sVals[1]*3))) && (camera.getLongitude() < (lon[m] +(0.0001*sVals[1]))))
			&& ((camera.getAltitude() > (alt[m] -(5*sVals[2]*3))) && (camera.getAltitude() < (alt[m] +(5*sVals[2])))))
				{
				playSounds(4,'targetaudio4');	//play the closeness sound
				
				/*if the camera is within the bounds of the ring*/
				if (((camera.getLatitude() > (lat[m] -(0.0001*sVals[0]))) && (camera.getLatitude() < (lat[m] +(0.0001*sVals[0]))))
				&& ((camera.getLongitude()> (lon[m] -(0.0001*sVals[1]))) && (camera.getLongitude() < (lon[m] +(0.0001*sVals[1]))))
				&& ((camera.getAltitude() > (alt[m] -(5*sVals[2]))) && (camera.getAltitude() < (alt[m] +(5*sVals[2])))))
					{
					
						stopSounds(0);
						start = 1;
						score += 1;	//add a point
						document.getElementById('lbldebug').innerHTML = score; //update the score label
						passed[m] = true;	//set the ring as passed
						ge.getFeatures().removeChild(ring[m]);	//remove the ring from the game
						play_multi_sound('targetaudio'+ ((2)));	//play the scoring sound
						if(score == 1)	//if this is the first point scored
						{
							countdown();	//start the timer
						}
						if (m <totRings-2)
						{
							link[m+1].setHref('https://googledrive.com/host/0B8mfyyIphB5OdW1GYjlvWGhJSnM/greenring.dae');
						}
					}
				}
		}
	}
}

/*Timer code*/

// set minutes
var mins = time;

// calculate the seconds
var secs = mins * 60;

function countdown() {
	setTimeout('Decrement()',1000);
}
function Decrement() {
	if (document.getElementById) {
		minutes = document.getElementById("minutes");
		seconds = document.getElementById("seconds");
		// if less than a minute remaining
		if (seconds < 59) {
			seconds.value = secs;
		} else {
			minutes.value = getminutes();
			seconds.value = getseconds();
		}
		if (secs == 0 || score == totRings) //if the game is finished
		{
			endGame(); //remove all rings
		}
		else
		{
			secs--;
			setTimeout('Decrement()',1000);
		}
	}
}
function getminutes() {
	// minutes is seconds divided by 60, rounded down
	mins = Math.floor(secs / 60);
	return mins;
}
function getseconds() {
	// take mins remaining (as seconds) away from total seconds remaining
	return secs-Math.round(mins *60);
}

function endGame()	//removes the rings from the game
{
	var m;
	
	for (m=0;m<totRings;m++)	//for each ring
	{	
		if (passed[m] == false)
		{
			passed[m] = true;	//so they cant be scored on
			ge.getFeatures().removeChild(ring[m]);	//visibly remove them
			
			stopAllSounds();
			start = 2;
		}
	}
}
