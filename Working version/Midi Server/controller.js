var midi, data;
//lab access
//var socket = new WebSocket("ws://192.168.0.233:3000/relay");
//uws access
//var socket = new WebSocket("ws://137.154.151.239:3000/relay");
//home testing
var socket = new WebSocket("ws://127.0.0.1:3000/relay");

var keys = new Array("midi");
var buffer = new Array("midi");

console.log("initialising key points");

keys.push( new Array (-362,10,0) );
keys.push( new Array (-349.5,20,-20));
keys.push( new Array (-337,10,0));
keys.push( new Array (-324.5,20,-20));
keys.push( new Array (-312,10,0));
keys.push( new Array (-287,10,0));
keys.push( new Array (-274.5,20,-20));
keys.push( new Array (-262,10,0));
keys.push( new Array (-249.5,20,-20));
keys.push( new Array (-237,10,0));
keys.push( new Array (-224.5,20,-20));
keys.push( new Array (-212,10,0));
keys.push( new Array (-187,10,0));
keys.push( new Array (-174.5,20,-20));
keys.push( new Array (-162,10,0));
keys.push( new Array (-149.5,20,-20));
keys.push( new Array (-137,10,0));
keys.push( new Array (-112,10,0));
keys.push( new Array (-99.5,20,-20));
keys.push( new Array (-87,10,0));
keys.push( new Array (-74.5,20,-20));
keys.push( new Array (-62,10,0));
keys.push( new Array (-49.5,20,-20));
keys.push( new Array (-37,10,0));
keys.push( new Array (-12,10,0));
keys.push( new Array (0.5,20,-20));
keys.push( new Array (13,10,0));
keys.push( new Array (25.5,20,-20));
keys.push( new Array (38,10,0));
keys.push( new Array (63,10,0));
keys.push( new Array (75.5,20,-20));
keys.push( new Array (88,10,0));
keys.push( new Array (100.5,20,-20));
keys.push( new Array (113,10,0));
keys.push( new Array (125.5,20,-20));
keys.push( new Array (138,10,0));
keys.push( new Array (163,10,0));
keys.push( new Array (175.5,20,-20));
keys.push( new Array (188,10,0));
keys.push( new Array (200.5,20,-20));
keys.push( new Array (213,10,0));
keys.push( new Array (238,10,0));
keys.push( new Array (250.5,20,-20));
keys.push( new Array (263,10,0));
keys.push( new Array (275.5,20,-20));
keys.push( new Array (288,10,0));
keys.push( new Array (300.5,20,-20));
keys.push( new Array (313,10,0));
keys.push( new Array (338,10,0));


	


// request MIDI access
requestMidi:
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
		var textbox = document.getElementById("sockethead");
		textbox.innerHTML = "Connection to socket established.<br/>";
        };


socket.onmessage = function (message)
	{

	if(JSON.parse(message.data) == "resend")
		{
		 socket.send (JSON.stringify(keys) );  
		}
	};



// midi functions
function onMIDISuccess(midiAccess) {
	var midiconnect = document.getElementById("midihead");
		midiconnect.innerHTML = "MIDI controller connected.<br/>";
	var box = document.getElementById("midiBox");
		box.innerHTML = buffer.toString();	

	
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

function onMIDIFailure(error) {
  // when we get a failed response, run this code
  console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
  var textbox = document.getElementById("midiBox");
		textbox.innerHTML = "No MIDI controller";
		break requestMidi;
}



function moveKey (num, dir, vel)
{
	if (dir=="up")
		{
			//if black key
			if (	num ==1 || num ==3 || num ==6 || num ==8 || num ==10 || num ==13 || num ==15 || num ==18 || num ==20 ||
				 	num==22 || num==25 || num ==27 || num ==30 || num ==32 || num ==34 || num ==37 || num ==39 ||
					num ==42 || num ==44 || num ==46 )
				keys[num+1][1]=20; //move to black keys y starting position
			else //if white key
				keys[num+1][1]=10; //move to white keys y starting position
			
		}
	else if (dir=="down")
		{
			if (vel <40)
				keys[num+1][1]-=30;
			else //if (vel<50)
				{
					keys[num+1][1]-=(vel-30);
					//console.log(vel);
				}
				
			//else
			//keys[num+1][1]-=50;
		}
		
		
		var flag =false;
		//if  buffer is not empty (1 is the flag used for movis)
		if (buffer.length >1)
		{//iterate through the buffer and compare each points x to the key moved x
			for (var i=1; i<buffer.lenght; i++)
			{
				if (keys[num+1][0]==buffer[i][0]) //if it matches
				{//replace current version in buffer with the changed one (happens if key goes down-> or visa versa before buffer is sent and cleared)
				 //and then break out of the loop
					buffer[i] = keys[num+1];
					flag = true;	
					break;
				}
			}
		}
		//if there is not one in the buffer already, add it in instead
		if (flag==false)
			{
				buffer.push(keys[num+1]);
			}
	
}



function onMIDIMessage(message) {
  data = message.data; // this gives us our [command/channel, note, velocity] data.
	
	
	switch (data[1])
	{
		case 36:
			if (data[0] == 144) { moveKey(0, "down",  data[2] ); }
			else { moveKey(0,"up",  data[2] ); }
			break;
		case 37:
			if (data[0] == 144) { moveKey(1, "down",  data[2] ); }
			else { moveKey(1,"up",  data[2] ); }
			break;
		case 38:
			if (data[0] == 144) { moveKey(2, "down",  data[2] ); }
			else { moveKey(2,"up",  data[2] ); }
			break;
		case 39:
			if (data[0] == 144) { moveKey(3, "down",  data[2] ); }
			else { moveKey(3,"up",  data[2] ); }
			break;
		case 40:
			if (data[0] == 144) { moveKey(4, "down",  data[2] ); }
			else { moveKey(4,"up",  data[2] ); }
			break;
		case 41:
			if (data[0] == 144) { moveKey(5, "down",  data[2] ); }
			else { moveKey(5,"up",  data[2] ); }
			break;
		case 42:
			if (data[0] == 144) { moveKey(6, "down",  data[2] ); }
			else { moveKey(6,"up",  data[2] ); }
			break;
		case 43:
			if (data[0] == 144) { moveKey(7, "down",  data[2] ); }
			else { moveKey(7,"up",  data[2] ); }
			break;
		case 44:
			if (data[0] == 144) { moveKey(8, "down",  data[2] ); }
			else { moveKey(8,"up",  data[2] ); }
			break;
		case 45:
			if (data[0] == 144) { moveKey(9, "down",  data[2] ); }
			else { moveKey(9,"up",  data[2] ); }
			break;
		case 46:
			if (data[0] == 144) { moveKey(10, "down",  data[2] ); }
			else { moveKey(10,"up",  data[2] ); }
			break;
		case 47:
			if (data[0] == 144) { moveKey(11, "down",  data[2] ); }
			else { moveKey(11,"up",  data[2] ); }
			break;
		case 48:
			if (data[0] == 144) { moveKey(12, "down",  data[2] ); }
			else { moveKey(12,"up",  data[2] ); }
			break;
		case 49:
			if (data[0] == 144) { moveKey(13, "down",  data[2] ); }
			else { moveKey(13,"up",  data[2] ); }
			break;
		case 50:
			if (data[0] == 144) { moveKey(14, "down",  data[2] ); }
			else { moveKey(14,"up",  data[2] ); }
			break;
		case 51:
			if (data[0] == 144) { moveKey(15, "down",  data[2] ); }
			else { moveKey(15,"up",  data[2] ); }
			break;
		case 52:
			if (data[0] == 144) { moveKey(16, "down",  data[2] ); }
			else { moveKey(16,"up",  data[2] ); }
			break;
		case 53:
			if (data[0] == 144) { moveKey(17, "down",  data[2] ); }
			else { moveKey(17,"up",  data[2] ); }
			break;
		case 54:
			if (data[0] == 144) { moveKey(18, "down",  data[2] ); }
			else { moveKey(18,"up",  data[2] ); }
			break;
		case 55:
			if (data[0] == 144) { moveKey(19, "down",  data[2] ); }
			else { moveKey(19,"up",  data[2] ); }
			break;
		case 56:
			if (data[0] == 144) { moveKey(20, "down",  data[2] ); }
			else { moveKey(20,"up",  data[2] ); }
			break;
		case 57:
			if (data[0] == 144) { moveKey(21, "down",  data[2] ); }
			else { moveKey(21,"up",  data[2] ); }
			break;
		case 58:
			if (data[0] == 144) { moveKey(22, "down",  data[2] ); }
			else { moveKey(22,"up",  data[2] ); }
			break;
		case 59:
			if (data[0] == 144) { moveKey(23, "down",  data[2] ); }
			else { moveKey(23,"up",  data[2] ); }
			break;
		case 60:
			if (data[0] == 144) { moveKey(24, "down",  data[2] ); }
			else { moveKey(24,"up",  data[2] ); }
			break;
		case 61:
			if (data[0] == 144) { moveKey(25, "down",  data[2] ); }
			else { moveKey(25,"up",  data[2] ); }
			break;
		case 62:
			if (data[0] == 144) { moveKey(26, "down",  data[2] ); }
			else { moveKey(26,"up",  data[2] ); }
			break;
		case 63:
			if (data[0] == 144) { moveKey(27, "down",  data[2] ); }
			else { moveKey(27,"up",  data[2] ); }
			break;
		case 64:
			if (data[0] == 144) { moveKey(28, "down",  data[2] ); }
			else { moveKey(28,"up",  data[2] ); }
			break;
		case 65:
			if (data[0] == 144) { moveKey(29, "down",  data[2] ); }
			else { moveKey(29,"up",  data[2] ); }
			break;
		case 66:
			if (data[0] == 144) { moveKey(30, "down",  data[2] ); }
			else { moveKey(30,"up",  data[2] ); }
			break;
		case 67:
			if (data[0] == 144) { moveKey(31, "down",  data[2] ); }
			else { moveKey(31,"up",  data[2] ); }
			break;
		case 68:
			if (data[0] == 144) { moveKey(32, "down",  data[2] ); }
			else { moveKey(32,"up",  data[2] ); }
			break;
		case 69:
			if (data[0] == 144) { moveKey(33, "down",  data[2] ); }
			else { moveKey(33,"up",  data[2] ); }
			break;
		case 70:
			if (data[0] == 144) { moveKey(34, "down",  data[2] ); }
			else { moveKey(34,"up",  data[2] ); }
			break;
		case 71:
			if (data[0] == 144) { moveKey(35, "down",  data[2] ); }
			else { moveKey(35,"up",  data[2] ); }
			break;
		case 72:
			if (data[0] == 144) { moveKey(36, "down",  data[2] ); }
			else { moveKey(36,"up",  data[2] ); }
			break;
		case 73:
			if (data[0] == 144) { moveKey(37, "down",  data[2] ); }
			else { moveKey(37,"up",  data[2] ); }
			break;
		case 74:
			if (data[0] == 144) { moveKey(38, "down",  data[2] ); }
			else { moveKey(38,"up",  data[2] ); }
			break;
		case 75:
			if (data[0] == 144) { moveKey(39, "down",  data[2] ); }
			else { moveKey(39,"up",  data[2] ); }
			break;
		case 76:
			if (data[0] == 144) { moveKey(40, "down",  data[2] ); }
			else { moveKey(40,"up",  data[2] ); }
			break;
		case 77:
			if (data[0] == 144) { moveKey(41, "down",  data[2] ); }
			else { moveKey(41,"up",  data[2] ); }
			break;
		case 78:
			if (data[0] == 144) { moveKey(42, "down",  data[2] ); }
			else { moveKey(42,"up",  data[2] ); }
			break;
		case 79:
			if (data[0] == 144) { moveKey(43, "down",  data[2] ); }
			else { moveKey(43,"up",  data[2] ); }
			break;
		case 80:
			if (data[0] == 144) { moveKey(44, "down",  data[2] ); }
			else { moveKey(44,"up",  data[2] ); }
			break;
		case 81:
			if (data[0] == 144) { moveKey(45, "down",  data[2] ); }
			else { moveKey(45,"up",  data[2] ); }
			break;
		case 82:
			if (data[0] == 144) { moveKey(46, "down",  data[2] ); }
			else { moveKey(46,"up",  data[2] ); }
			break;
		case 83:
			if (data[0] == 144) { moveKey(47, "down",  data[2] ); }
			else { moveKey(47,"up",  data[2] ); }
			break;
		case 84:
			if (data[0] == 144) { moveKey(48, "down",  data[2] ); }
			else { moveKey(48,"up",  data[2] ); }
			break;
		default:
			console.log("key\t" +data[1] +"\t not configured" );
			//ect for all other keys			
	}
	
}


setInterval ( function()
{
	if (buffer.length >1)
	{
	socket.send (JSON.stringify(buffer));
	var box = document.getElementById("midiBox");
	box.innerHTML = buffer.toString();	
	buffer = new Array("midi");
	}
}
, 16);
