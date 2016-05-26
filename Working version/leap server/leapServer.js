//var socket = new ReconnectingWebSocket("ws://192.168.0.233:3000/relay");
//uws access
//var socket = new ReconnectingWebSocket("ws://137.154.151.239:3000/relay");
//local machine
var socket = new ReconnectingWebSocket("ws://127.0.0.1:3000/relay");

var empty = true;
var connected = false;
var lastMessage = Date.now();
var messageLengths = 0;

//set up leap controller settings
var controller = new Leap.Controller(
	{
		frameEventName : 'animationFrame', //read at 60FPS
		background : true, //run in background window if not minimised and is the focused tab
		optimizeHMD : true // overhead mode (does not seem to work unfortunately)
	}
	);

//when the socket gets a connection
socket.onopen = function (evt)
{
	connected = true; //set connected flag to true
	//update page to show that we have connected
	var socketHead = document.getElementById("header2");
	socketHead.innerHTML = "Connection to socket established.<br/>";
	socketHead.style.color = " #2aa22a";
};

//if connection fails or on disconnect
socket.onclose = function (evt)
{
	connected = false; //set connection flag
	//update page to show that we have connected
	var socketHead = document.getElementById("header2");
	socketHead.innerHTML = "Failed to connect to socket.<br/>";
	socketHead.style.color = "#a22a2a";
};

//if leap motion device is connected
controller.on('deviceStreaming', function ()
{
	//update page to show that we have connected
	var deviceHead = document.getElementById("header1");
	deviceHead.style.color = " #2aa22a";
	deviceHead.innerHTML = "Leap Motion device is connected.<br/>"

}
);

//if leap motion device is not connected/disconnects during running
controller.on('deviceStopped', function ()
{
	//update page to show that we have connected
	var deviceHead = document.getElementById("header1");
	deviceHead.innerHTML = "Leap Motion device is disconnected.<br/>"
		socketHead.style.color = "#a22a2a";
}
);

//start controller
controller.connect();

//active loop of controller
controller.loop(function (frame)
{
	var data = new Array("leap"); //make empty array with only our flag

	//get data box and change it to display current number of hands
	var textbox = document.getElementById("hands");
	hands.innerHTML = frame.hands.length;

	var currentTime = Date.now(); //get current time
	//if  long enough between messages:
	if (currentTime - lastMessage >= 32)
	{
		lastMessage = currentTime; //update time of last sent message to current

		//iterate through all captured points of all hands
		for (i = 0, len = frame.pointables.length; i < len; i++)
		{
			//can add if statements before all of these with a flag to turn the set of points off.

			//add each array of the following points to our sending message
			data.push(frame.pointables[i].tipPosition); //fingertips
			data.push(frame.pointables[i].dipPosition); //last knuckle
			data.push(frame.pointables[i].pipPosition); //middle knuckle
			data.push(frame.pointables[i].carpPosition); //wrist
			data.push(frame.pointables[i].hand().palmPosition); //centre of palm

		}

		for (var i = 1; i < data.length; i++)
		{
			for (var j = 0; j < data[i].length; j++)
			{
			data[i][j] = parseInt(data[i][j]);
			
			}
		}
		//if we have connection to the socket
		if (connected)
		{
			//if at least 1 point is in the message array
			if (data.length > 1)
			{
				var message = JSON.stringify(data); //package up the array of points + flag
				socket.send(message); //send off nicely packaged array
				messageLengths += message.length;
				empty = true; //then set empty flag
			}
			//otherwise, if e have not sent an empty message
			else if (empty)
			{

				var message = JSON.stringify(data); //package up an empty array with just the flag
				socket.send(message); //send off nicely packaged array
				messageLengths += message.length;
				empty = false; //then set empty message flag
			}
		}

	}

}
)

window.onbeforeunload = function ()
{
	socket.onclose = function ()  {};
	socket.close()
};

setInterval(function ()
{
	console.log("bitrate:\t" + messageLengths + " characters/s");
	messageLengths = 0;
}, 1000);
