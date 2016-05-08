//dummy reciever
//var socket = new WebSocket("ws://192.168.0.233:3000/relay");
//uws access
//var socket = new WebSocket("ws://137.154.151.239:3000/relay");
//home testing
var socket = new WebSocket("ws://127.0.0.1:3000/relay");


var data = [];
var empty = true;

var controller =  new Leap.Controller({frameEventName: 'animationFrame', background: 'true'});


controller.connect();
Leap.loop(function(frame){
	var textbox = document.getElementById("databox");
	for(i=0, len=frame.pointables.length; i < len; i++){
		data.push(frame.pointables[i].tipPosition);				//fingertips
		data.push(frame.pointables[i].dipPosition);				//knuckle 1
		data.push(frame.pointables[i].pipPosition);				//knuckle 2
		data.push(frame.pointables[i].carpPosition);			//wrist
		data.push(frame.pointables[i].hand().palmPosition ); 	//centre of palm
		
		
		
		
		
		}
		textbox.innerHTML = "running..." ;
		
		if (data.length>0)
		{
			socket.send(JSON.stringify (data) );
			empty=false;
		}
		else if (!empty)
		{
				socket.send(JSON.stringify (new Array() ) );
				empty=true;
		}
		data = [];
}
)

window.onbeforeunload = function() {
    socket.onclose = function () {}; // disable onclose handler first
    socket.close()
};

/*

*/
