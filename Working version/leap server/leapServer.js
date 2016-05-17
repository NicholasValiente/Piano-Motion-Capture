//dummy reciever
//var socket = new WebSocket("ws://192.168.0.233:3000/relay");
//uws access
var socket = new WebSocket("ws://137.154.151.239:3000/relay");
//home testing
//var socket = new WebSocket("ws://127.0.0.1:3000/relay");


var data = new Array("leap");
var empty = true;
var connected = false;

var controller =  new Leap.Controller({frameEventName: 'animationFrame', background: 'true'});


socket.onopen = function(evt)
{
connected=true;
};

socket.onclose = function(evt)
{
connected=false;
};

controller.connect();

Leap.loop(function(frame){
	var textbox = document.getElementById("databox");
	var head = document.getElementById("header");
	var tip = document.getElementById("tips");
	var knuck1 = document.getElementById("knuckle1");
	var knuck2 = document.getElementById("knuckle2");
	var wrist = document.getElementById("wrists");
	var palm = document.getElementById("palms");

	if (connected)
			head.innerHTML = "Connection to socket established.<br/>" ;
	else
			head.innerHTML = "Failed to connect to socket.<br/>" ;
		

	for(i=0, len=frame.pointables.length; i < len; i++){
		data.push(frame.pointables[i].tipPosition);				//fingertips
		data.push(frame.pointables[i].dipPosition);				//knuckle 1
		data.push(frame.pointables[i].pipPosition);				//knuckle 2
		data.push(frame.pointables[i].carpPosition);			//wrist
		data.push(frame.pointables[i].hand().palmPosition ); 	//centre of palm
		}
		
		//adding text tracking to web page
		
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
		
		
		//deciding what to send to movis
	if (data.length>1)
		{
			socket.send(JSON.stringify ( data) );
			empty=false;
		}
	else if (!empty)
		{
			socket.send(JSON.stringify (data ) );
			empty=true;
		}
		data = new Array("leap");
}
)

window.onbeforeunload = function() {
    socket.onclose = function () {}; // disable onclose handler first
    socket.close()
};

/*

*/
