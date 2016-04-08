//var midi = new WebSocket("ws://echo.WebSocket.org:80");
//var midi = new WebSocket("ws://192.168.0.233:3000/relay");
var midi = new WebSocket("ws://137.154.151.239:3000/relay"); //UWS network


// request MIDI access



midi.onopen = function(evt)
               {
				    var playbackbox = document.getElementById("output");
			    playbackbox.innerHTML ="";
               };


midi.onmessage = function (evt) 
               { 
                
                  var playbackbox = document.getElementById("output");
				 
					playbackbox.innerHTML += evt.data +"<br/>";
					 playbackbox.scrollTop = textbox.scrollHeight;

				
				
               };


			   
//kinect functions

var joint = {}; //joint object
var joint_by_id = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
var kinectSocket = new WebSocket("ws://localhost:8181/"); //192.168.0.71

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

var context;

var fontsize = 0;


function moveTilt(value) {
    var Tilt = "tilt";
    Tilt = Tilt + "," + value;
    kinectSocket.send(Tilt);
};



window.onload = function () {
    console.log("loading script");

    kinectSocket.onopen = function() {
        console.log("Opening the socket connection");

        var rate = "rate,unrated";                  //format: rate then rate number
        var scale = "scale,640,480,10";             //format: scale then X scale, Y scale, Z scale
        var joints = "joints,all";                  //format: joints then any order of joints 0-19 ("joints,all" for all joints)
        var tilt = "tilt,0";                        //format: tilt then angle between 27 and -27

        kinectSocket.send(joints);
        kinectSocket.send(scale);
        kinectSocket.send(rate);
        kinectSocket.send(tilt);

    };

    kinectSocket.onclose = function() {
    };

    kinectSocket.onmessage = function (evt) {
        console.log("EV");
        var message = evt.data;
        var vals = new Array();
        vals = message.split(",");

        var maxsize=20;
        var outhead = document.getElementById("headBox");
        var outlefthand = document.getElementById("leftHandBox");
        var outrighthand = document.getElementById("rightHandBox");
        var outleftelbow = document.getElementById("leftElbowBox");
		var outrightelbow = document.getElementById("rightElbowBox");
		var outshoulder = document.getElementById("shoulderBox");
		

        var i = 0; // step through the received values
        var j = 0;
        for (j=0; j < vals.length / 3; j++) {
            var x = parseInt(vals[i++]);
            var y = parseInt(vals[i++]);
            var z = parseInt(vals[i++]) / 10;

            joint[j] = { x: x, y: y, z: z };
        }

        if (fontsize==maxsize){
            fontsize = 0;
            outhead.style.fontsize = "initial";
        }
        else {
            fontsize+=1;
            outhead.style.fontsize = "larger";
        }

        outhead.innerHTML += joint[head].x.toString() + ","
            + joint[head].y.toString() + "," + joint[head].z.toString() + "<br/>";
			
        outlefthand.innerHTML += joint[handleft].x.toString() + ","
            + joint[handleft].y.toString() + "," + joint[handleft].z.toString() + "<br/>" ;
			
        outrighthand.innerHTML += joint[handright].x.toString() + ","
            + joint[handright].y.toString() + "," + joint[handright].z.toString() + "<br/>";
			
		outleftelbow.innerHTML += joint[handright].x.toString() + ","
            + joint[handright].y.toString() + "," + joint[handright].z.toString() + "<br/>";
		
		outrightelbow.innerHTML += joint[handright].x.toString() + ","
            + joint[handright].y.toString() + "," + joint[handright].z.toString() + "<br/>";
			
		outshoulder.innerHTML += joint[shouldercenter].x.toString() + ","
            + joint[shouldercenter].y.toString() + "," + joint[shouldercenter].z.toString() + "<br/>";
    };
};
