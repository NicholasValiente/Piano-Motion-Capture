var midi, data;
//var socket = new WebSocket("ws://echo.websocket.org:80");
//var socket = new WebSocket("ws://192.168.0.233:3000/relay");
var socket = new WebSocket("ws://137.154.151.239:3000/relay");

var keys = new Array();



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
	console.log("initialising key points");
	for(var i=0; i< 49; i++)
	{
		keys[i]= new Array( (i*2)-10, 10, 0 );
	}
	
}

function moveKey (num, dir)
{
	if (dir=="up")
		{keys[num][1]+=2;}
	else if (dir=="down")
		{keys[num][1]-=2;}
	
	socket.send (JSON.stringify(keys) );	
}

function onMIDIFailure(error) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

function onMIDIMessage(message) {
    data = message.data; // this gives us our [command/channel, note, velocity] data.
	switch (data[1])
	{
		case 36:
			if (data[0] == 144) { moveKey(0, "down"); }
			else { moveKey(0,"up"); }
			break;
		case 37:
			if (data[0] == 144) { moveKey(1, "down"); }
			else { moveKey(1,"up"); }
			break;
		case 38:
			if (data[0] == 144) { moveKey(2, "down"); }
			else { moveKey(2,"up"); }
			break;
		case 39:
			if (data[0] == 144) { moveKey(3, "down"); }
			else { moveKey(3,"up"); }
			break;
		case 40:
			if (data[0] == 144) { moveKey(4, "down"); }
			else { moveKey(4,"up"); }
			break;
		case 41:
			if (data[0] == 144) { moveKey(5, "down"); }
			else { moveKey(5,"up"); }
			break;
		case 42:
			if (data[0] == 144) { moveKey(6, "down"); }
			else { moveKey(6,"up"); }
			break;
		case 43:
			if (data[0] == 144) { moveKey(7, "down"); }
			else { moveKey(7,"up"); }
			break;
		case 44:
			if (data[0] == 144) { moveKey(8, "down"); }
			else { moveKey(8,"up"); }
			break;
		case 45:
			if (data[0] == 144) { moveKey(9, "down"); }
			else { moveKey(9,"up"); }
			break;
		case 46:
			if (data[0] == 144) { moveKey(10, "down"); }
			else { moveKey(10,"up"); }
			break;
		case 47:
			if (data[0] == 144) { moveKey(11, "down"); }
			else { moveKey(11,"up"); }
			break;
		case 48:
			if (data[0] == 144) { moveKey(12, "down"); }
			else { moveKey(12,"up"); }
			break;
		case 49:
			if (data[0] == 144) { moveKey(13, "down"); }
			else { moveKey(13,"up"); }
			break;
		case 50:
			if (data[0] == 144) { moveKey(14, "down"); }
			else { moveKey(14,"up"); }
			break;
		case 51:
			if (data[0] == 144) { moveKey(15, "down"); }
			else { moveKey(15,"up"); }
			break;
		case 52:
			if (data[0] == 144) { moveKey(16, "down"); }
			else { moveKey(16,"up"); }
			break;
		case 53:
			if (data[0] == 144) { moveKey(17, "down"); }
			else { moveKey(17,"up"); }
			break;
		case 54:
			if (data[0] == 144) { moveKey(18, "down"); }
			else { moveKey(18,"up"); }
			break;
		case 55:
			if (data[0] == 144) { moveKey(19, "down"); }
			else { moveKey(19,"up"); }
			break;
		case 56:
			if (data[0] == 144) { moveKey(20, "down"); }
			else { moveKey(20,"up"); }
			break;
		case 57:
			if (data[0] == 144) { moveKey(21, "down"); }
			else { moveKey(21,"up"); }
			break;
		case 58:
			if (data[0] == 144) { moveKey(22, "down"); }
			else { moveKey(22,"up"); }
			break;
		case 59:
			if (data[0] == 144) { moveKey(23, "down"); }
			else { moveKey(23,"up"); }
			break;
		case 60:
			if (data[0] == 144) { moveKey(24, "down"); }
			else { moveKey(24,"up"); }
			break;
		case 61:
			if (data[0] == 144) { moveKey(25, "down"); }
			else { moveKey(25,"up"); }
			break;
		case 62:
			if (data[0] == 144) { moveKey(26, "down"); }
			else { moveKey(26,"up"); }
			break;
		case 63:
			if (data[0] == 144) { moveKey(27, "down"); }
			else { moveKey(27,"up"); }
			break;
		case 64:
			if (data[0] == 144) { moveKey(28, "down"); }
			else { moveKey(28,"up"); }
			break;
		case 65:
			if (data[0] == 144) { moveKey(29, "down"); }
			else { moveKey(29,"up"); }
			break;
		case 66:
			if (data[0] == 144) { moveKey(30, "down"); }
			else { moveKey(30,"up"); }
			break;
		case 67:
			if (data[0] == 144) { moveKey(31, "down"); }
			else { moveKey(31,"up"); }
			break;
		case 68:
			if (data[0] == 144) { moveKey(32, "down"); }
			else { moveKey(32,"up"); }
			break;
		case 69:
			if (data[0] == 144) { moveKey(33, "down"); }
			else { moveKey(33,"up"); }
			break;
		case 70:
			if (data[0] == 144) { moveKey(34, "down"); }
			else { moveKey(34,"up"); }
			break;
		case 71:
			if (data[0] == 144) { moveKey(35, "down"); }
			else { moveKey(35,"up"); }
			break;
		case 72:
			if (data[0] == 144) { moveKey(36, "down"); }
			else { moveKey(36,"up"); }
			break;
		case 73:
			if (data[0] == 144) { moveKey(37, "down"); }
			else { moveKey(37,"up"); }
			break;
		case 74:
			if (data[0] == 144) { moveKey(38, "down"); }
			else { moveKey(38,"up"); }
			break;
		case 75:
			if (data[0] == 144) { moveKey(39, "down"); }
			else { moveKey(39,"up"); }
			break;
		case 76:
			if (data[0] == 144) { moveKey(40, "down"); }
			else { moveKey(40,"up"); }
			break;
		case 77:
			if (data[0] == 144) { moveKey(41, "down"); }
			else { moveKey(41,"up"); }
			break;
		case 78:
			if (data[0] == 144) { moveKey(42, "down"); }
			else { moveKey(42,"up"); }
			break;
		case 79:
			if (data[0] == 144) { moveKey(43, "down"); }
			else { moveKey(43,"up"); }
			break;
		case 80:
			if (data[0] == 144) { moveKey(44, "down"); }
			else { moveKey(44,"up"); }
			break;
		case 81:
			if (data[0] == 144) { moveKey(45, "down"); }
			else { moveKey(45,"up"); }
			break;
		case 82:
			if (data[0] == 144) { moveKey(46, "down"); }
			else { moveKey(46,"up"); }
			break;
		case 83:
			if (data[0] == 144) { moveKey(47, "down"); }
			else { moveKey(47,"up"); }
			break;
		case 84:
			if (data[0] == 144) { moveKey(48, "down"); }
			else { moveKey(48,"up"); }
			break;
		default:
			console.log("key\t" +data[1] +"\t not configured" );
			//ect for all other keys			
	}
	
}