var midi, data;
//var socket = new WebSocket("ws://echo.websocket.org:80");
//var socket = new WebSocket("ws://192.168.0.233:3000/relay");
var socket = new WebSocket("ws://137.154.151.239:3000/relay");

var keys [];

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

socket.onopen = function(evt)
               {
                  // Web Socket is connected, send data using send()
                     socket.send("Web Socket Supported: SERVER <br/>");             
               };





// midi functions
function onMIDISuccess(midiAccess) {
	var textbox = document.getElementById("midiBox");
		textbox.innerHTML = "MIDI controller Supported";
		
	
    // when we get a succesful response, run this code
    midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status

    var inputs = midi.inputs.values();
    // loop over all available inputs and listen for any MIDI input
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
	
	//initialise key positions
	for(int i=0; i< 10; i++)
	{
		keys[i]= new THREE.Vector3( (i*2)-10, 10, 0 );
	}
	
}

function moveKey (num, dir)
{
	if (dir=="up")
		{keys[num].y+=2;}
	else if (dir=="down")
		{keys[num].y-=2;}
}

function onMIDIFailure(error) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

function onMIDIMessage(message) {
    data = message.data; // this gives us our [command/channel, note, velocity] data.
	switch (data[1])
	{
		case 48:
			if (data[0]==144)	{moveKey(0, "down");}
			else 				{moveKey(0, "up");}
			break;
		case 49:
			if (data[0]==144)	{moveKey(1, "down");}
			else 				{moveKey(1, "up");}
			break;
		case 50:
			if (data[0]==144)	{moveKey(2, "down");}
			else 				{moveKey(2, "up");}
			break;
		case 51:
			if (data[0]==144)	{moveKey(3, "down");}
			else 				{moveKey(3, "up");}
			break;
		case 52:
			if (data[0]==144)	{moveKey(4, "down");}
			else 				{moveKey(4, "up");}
			break;
		case 53:
			if (data[0]==144)	{moveKey(5, "down");}
			else 				{moveKey(5, "up");}
			break;
		case 54:
			if (data[0]==144)	{moveKey(6, "down");}
			else 				{moveKey(6, "up");}
			break;
		case 55:
			if (data[0]==144)	{moveKey(7, "down");}
			else 				{moveKey(7, "up");}
			break;	
		case 56:
			if (data[0]==144)	{moveKey(8, "down");}
			else 				{moveKey(8, "up");}
			break;	
		case 57:
			if (data[0]==144)	{moveKey(9, "down");}
			else 				{moveKey(9, "up");}
			break;
			//ect for all other keys			
	}
	/*
	var textbox = document.getElementById("midiBox");
	textbox.innerHTML += "<br/> State: " + data[0] +" Key: " + data[1] +" Velocity: " + data[2];
	textbox.scrollTop = textbox.scrollHeight;
	
	//socket.send(data[0] +" " +  data[1] +" " + data[2]);
	socket.send(JSON.stringify(data));
	*/
	
socket.send (JSON.stringify(keys)};	
}