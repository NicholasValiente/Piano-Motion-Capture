//dummy reciever
//var socket = new WebSocket("ws://192.168.0.233:3000/relay");
//uws access
//var socket = new WebSocket("ws://137.154.151.239:3000/relay");
//home testing
var socket = new WebSocket("ws://127.0.0.1:3000/relay");


//var data = new Array("leap");
var empty = true;
var connected = false;
var lastMessage = Date.now();

var controller =  new Leap.Controller({frameEventName: 'animationFrame', background: true, optimizeHMD: true});

	
socket.onopen = function(evt)
{
connected=true;
	var socketHead = document.getElementById("header2");

	socketHead.innerHTML = "Connection to socket established.<br/>" ;
	socketHead.style.color = " #2aa22a";
};

socket.onclose = function(evt)
{
connected=false;
	var socketHead = document.getElementById("header2");
	socketHead.innerHTML = "Failed to connect to socket.<br/>" ;
	socketHead.style.color = "#a22a2a";
};


controller.on ('deviceStreaming',  function() {
	var deviceHead = document.getElementById("header1");
	
	deviceHead.style.color = " #2aa22a";
	deviceHead.innerHTML = "Leap Motion device is connected.<br/>"

	});
controller.on ('deviceStopped',  function() {
	var deviceHead = document.getElementById("header1");
	deviceHead.innerHTML = "Leap Motion device is disconnected.<br/>"
	socketHead.style.color = "#a22a2a";
	});

controller.connect();

var t=0;

controller.loop(function(frame){
	var data = new Array("leap");
	
	var textbox = document.getElementById("hands");
	hands.innerHTML = frame.hands.length;


	
	var currentTime = Date.now();
	if ( currentTime-lastMessage>=32)
	{
		lastMessage=currentTime;
		
	for(i=0, len=frame.pointables.length; i < len; i++){
		//can add if statements before all of these with a flag to turn the set of points off.
		data.push(frame.pointables[i].tipPosition);				//fingertips
		data.push(frame.pointables[i].dipPosition);				//last knuckle
		data.push(frame.pointables[i].pipPosition);				//middle knuckle
		data.push(frame.pointables[i].carpPosition);			//wrist
		data.push(frame.pointables[i].hand().palmPosition ); 	//centre of palm

		}
		

		
		if (data.length>1)
		{
			/*
			for(var i=1; i<data.length; i++ )
			{
				data[i][1]*=-1; //vertiacl flip
				data[i][1]+=300; //vertiacl translation
				data[i][0]*=-1; //horizontal left-right
			}
			*/
			
			if (connected)
			{
			var message = JSON.stringify(data);
			socket.send (message);
			empty=true;
			}
		}
		else if (connected && empty)
		{
			socket.send (JSON.stringify(data));
			empty=false;
		}
		
		//adding text tracking to web page
		/*
	tip.innerHTML = "Fingertip points:<br/>";
	for(i=0, len=frame.pointables.length; i < len; i++){
		tip.innerHTML += frame.pointables[i].tipPosition +"<br/>";
		}
	knuck1.innerHTML = "First Knuckle Points:<br/>";
	for(i=0, len=frame.pointables.length; i < len; i++){
		knuck1.innerHTML += frame.pointables[i].dipPosition +"<br/>";
		}
	knuck2.innerHTML = "Second Knuckle Points:<br/>";
	for(i=0, len=frame.pointables.length; i < len; i++){
		knuck2.innerHTML += frame.pointables[i].pipPosition +"<br/>";
		}	
	wrist.innerHTML = "Wrist Points:<br/>";
	for(i=0, len=frame.pointables.length; i < len; i++){
		wrist.innerHTML += frame.pointables[i].carpPosition +"<br/>";
		}
	palm.innerHTML = "Palm Points:<br/>";
	for(i=0, len=frame.pointables.length; i < len; i++){
		palm.innerHTML += frame.pointables[i].hand().palmPosition +"<br/>";
		}
		*/
		

		
		
	}
		
}
)

window.onbeforeunload = function() {
    socket.onclose = function () {}; // disable onclose handler first
    socket.close()
};




