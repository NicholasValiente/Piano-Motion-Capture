var midi, data;
//lab access
//var socket = new WebSocket("ws://192.168.0.233:3000/relay");
//uws access
var socket = new WebSocket("ws://137.154.151.239:3000/relay");
//home testing
//var socket = new WebSocket("ws://127.0.0.1:3000/relay");

var keys = new Array();
var date = new Date();
var lastMessage =  date.getTime();
console.log(lastMessage);

console.log("initialising key points");
// white keys
keys[0] = new Array (-362,10,0);
keys[2] = new Array (-337,10,0);
keys[4] = new Array (-312,10,0);
keys[5] = new Array (-287,10,0);
keys[7] = new Array (-262,10,0);
keys[9] = new Array (-237,10,0);
keys[11] = new Array (-212,10,0);
keys[12] = new Array (-187,10,0);
keys[14] = new Array (-162,10,0);
keys[16] = new Array (-137,10,0);
keys[17] = new Array (-112,10,0);
keys[19] = new Array (-87,10,0);
keys[21] = new Array (-62,10,0);
keys[23] = new Array (-37,10,0);
keys[24] = new Array (-12,10,0);
keys[26] = new Array (13,10,0);
keys[28] = new Array (38,10,0);
keys[29] = new Array (63,10,0);
keys[31] = new Array (88,10,0);
keys[33] = new Array (113,10,0);
keys[35] = new Array (138,10,0);
keys[36] = new Array (163,10,0);
keys[38] = new Array (188,10,0);
keys[40] = new Array (213,10,0);
keys[41] = new Array (238,10,0);
keys[43] = new Array (263,10,0);
keys[45] = new Array (288,10,0);
keys[47] = new Array (313,10,0);
keys[48] = new Array (338,10,0);
//black keys
keys[1] = new Array (-349.5,20,-20);
keys[3] = new Array (-324.5,20,-20);
keys[6] = new Array (-274.5,20,-20);
keys[8] = new Array (-249.5,20,-20);
keys[10] = new Array (-224.5,20,-20);
keys[13] = new Array (-174.5,20,-20);
keys[15] = new Array (-149.5,20,-20);
keys[18] = new Array (-99.5,20,-20);
keys[20] = new Array (-74.5,20,-20);
keys[22] = new Array (-49.5,20,-20);
keys[25] = new Array (0.5,20,-20);
keys[27] = new Array (25.5,20,-20);
keys[30] = new Array (75.5,20,-20);
keys[32] = new Array (100.5,20,-20);
keys[34] = new Array (125.5,20,-20);
keys[37] = new Array (175.5,20,-20);
keys[39] = new Array (200.5,20,-20);
keys[42] = new Array (250.5,20,-20);
keys[44] = new Array (275.5,20,-20);
keys[46] = new Array (325.5,20,-20);
	


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
        socket.send (JSON.stringify(keys) );       
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
	
	
}

function moveKey (num, dir)
{
	if (dir=="up")
		{keys[num][1]+=10;}
	else if (dir=="down")
		{keys[num][1]-=10;}
	
	if ( date.getTime()-lastMessage >16)
		socket.send (JSON.stringify(keys) );	
	else
		console.log("Too little time between messages");
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