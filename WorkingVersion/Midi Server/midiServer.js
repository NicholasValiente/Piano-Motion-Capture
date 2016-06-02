var midi, data;

var messageLengths=0;
var keys = new Array("midi");
var buffer = new Array("midi");

//initialise all of our keys points
console.log("initialising key points");
keys.push(new Array(-362, 10, 0));
keys.push(new Array(-349.5, 20, -20));
keys.push(new Array(-337, 10, 0));
keys.push(new Array(-324.5, 20, -20));
keys.push(new Array(-312, 10, 0));
keys.push(new Array(-287, 10, 0));
keys.push(new Array(-274.5, 20, -20));
keys.push(new Array(-262, 10, 0));
keys.push(new Array(-249.5, 20, -20));
keys.push(new Array(-237, 10, 0));
keys.push(new Array(-224.5, 20, -20));
keys.push(new Array(-212, 10, 0));
keys.push(new Array(-187, 10, 0));
keys.push(new Array(-174.5, 20, -20));
keys.push(new Array(-162, 10, 0));
keys.push(new Array(-149.5, 20, -20));
keys.push(new Array(-137, 10, 0));
keys.push(new Array(-112, 10, 0));
keys.push(new Array(-99.5, 20, -20));
keys.push(new Array(-87, 10, 0));
keys.push(new Array(-74.5, 20, -20));
keys.push(new Array(-62, 10, 0));
keys.push(new Array(-49.5, 20, -20));
keys.push(new Array(-37, 10, 0));
keys.push(new Array(-12, 10, 0));
keys.push(new Array(0.5, 20, -20));
keys.push(new Array(13, 10, 0));
keys.push(new Array(25.5, 20, -20));
keys.push(new Array(38, 10, 0));
keys.push(new Array(63, 10, 0));
keys.push(new Array(75.5, 20, -20));
keys.push(new Array(88, 10, 0));
keys.push(new Array(100.5, 20, -20));
keys.push(new Array(113, 10, 0));
keys.push(new Array(125.5, 20, -20));
keys.push(new Array(138, 10, 0));
keys.push(new Array(163, 10, 0));
keys.push(new Array(175.5, 20, -20));
keys.push(new Array(188, 10, 0));
keys.push(new Array(200.5, 20, -20));
keys.push(new Array(213, 10, 0));
keys.push(new Array(238, 10, 0));
keys.push(new Array(250.5, 20, -20));
keys.push(new Array(263, 10, 0));
keys.push(new Array(275.5, 20, -20));
keys.push(new Array(288, 10, 0));
keys.push(new Array(300.5, 20, -20));
keys.push(new Array(313, 10, 0));
keys.push(new Array(338, 10, 0));

//when the socket gets a connection
socket.onopen = function (evt)
{
	//send our full keyboard
	
	for (var i = 1; i < keys.length; i++)
		{
			for (var j = 0; j < keys[i].length; j++)
			{
			keys[i][j] = parseInt(keys[i][j]);
			
			}
		}
	socket.send(JSON.stringify(keys));
	
	//update page to show that we have connected
	var textbox = document.getElementById("sockethead");
	textbox.innerHTML = "Connection to socket established.<br/>";
	textbox.style.color = "#2aa22a"
};

//if connection fails or on disconnect
socket.onclose = function (evt)
{
	//update page to show that we have connected
	var textbox = document.getElementById("sockethead");
	textbox.innerHTML = "Failed to connect to socket.<br/>";
	textbox.style.color = "#a22a2a";
};

socket.onmessage = function (message)
{};

// request MIDI access
requestMidi :
if (navigator.requestMIDIAccess)
{
	navigator.requestMIDIAccess(
	{
		sysex : false
	}
	).then(onMIDISuccess, onMIDIFailure);
}
else
{
	alert("Web Midi not supported by this browser please try using one of the following browsers:\n-\tGoogle Chrome\n");
}

// when we get a successful response :
function onMIDISuccess(midiAccess)
{
	//clear data box of hello world message
	var box = document.getElementById("midiBox");
	box.innerHTML = buffer.toString();

	//set our midi controller
	midi = midiAccess;

	//check if any midi devices are connected
	var inputs = midi.inputs.values();
	var atLeastOneDevice = false;
	// loop over all available inputs and listen for any MIDI input
	for (var input = inputs.next(); input && !input.done; input = inputs.next())
	{
		// each time there is a midi message call the onMIDIMessage function
		input.value.onmidimessage = onMIDIMessage;
		atLeastOneDevice = true;
	}

	var midiconnect = document.getElementById("midihead");
	// if there is any midi devices connected
	if (atLeastOneDevice)
	{
		//update page to reflect connecting to midi device
		midiconnect.innerHTML = "MIDI controller connected.<br/>";
		midiconnect.style.color = "#2aa22a";
	}
	//otherwise
	else
	{
		//update page to reflect no connected midi device
		midiconnect.innerHTML = "No MIDI controller connected.<br/>";
		midiconnect.style.color = "#a22a2a";
	}

}

//if no webMidi support
function onMIDIFailure(error)
{
	console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
	break requestMidi;
}

//does the actual work of moving the keys
function moveKey(num, dir, vel)
{
	//if key needs to move back up
	if (dir == "up")
	{
		//if black key
		if (num == 1 || num == 3 || num == 6 || num == 8 || num == 10 || num == 13 || num == 15 || num == 18 || num == 20 ||
			num == 22 || num == 25 || num == 27 || num == 30 || num == 32 || num == 34 || num == 37 || num == 39 ||
			num == 42 || num == 44 || num == 46)
		{
			keys[num + 1][1] = 20; //move to black keys y starting position
		}
		else //if white key
		{
			keys[num + 1][1] = 10; //move to white keys y starting position
		}
	}

	//if key needs to move down
	else if (dir == "down")
	{
		//if slow velocity
		if (vel < 40)
		{
			keys[num + 1][1] -= 30; //move key by preset ammount
		}
		else //if (vel at least 40)
		{

			keys[num + 1][1] -= (vel - 30); //move key by its velocity
		}

		//else
		//keys[num+1][1]-=50;
	}

	var flag = false;
	//if  buffer is not empty (1 is the tag used for movis to tell where message came from)
	if (buffer.length > 1)
	{ //iterate through the buffer and compare each points x to the key moved x
		for (var i = 1; i < buffer.lenght; i++)
		{
			if (keys[num + 1][0] == buffer[i][0]) //if the x matches
			{ //replace current version in buffer with the changed one 	(happens if key goes down->up quickly
				//	 or visa versa before buffer is sent and cleared)
				//and then break out of the loop
				buffer[i] = keys[num + 1];
				flag = true; //set flag that tells us we dont need to add to the buffer
				break;
			}
		}
	}
	//if there is not one in the buffer already:
	if (flag == false)
	{
		//add it to the buffer
		buffer.push(keys[num + 1]);
		buffer[buffer.length - 1][3] = num;
	}

}

//on midi keyboard message
function onMIDIMessage(message)
{
	data = message.data; // this gives us our [command/channel, note, velocity] data.

	//determine which key as pressed, and direction, and call moveKey function
	//with appropriate key, direction and velocity
	switch (data[1])
	{
	case 36:
		if (data[0] == 144)
		{
			moveKey(0, "down", data[2]);
		}
		else
		{
			moveKey(0, "up", data[2]);
		}
		break;
	case 37:
		if (data[0] == 144)
		{
			moveKey(1, "down", data[2]);
		}
		else
		{
			moveKey(1, "up", data[2]);
		}
		break;
	case 38:
		if (data[0] == 144)
		{
			moveKey(2, "down", data[2]);
		}
		else
		{
			moveKey(2, "up", data[2]);
		}
		break;
	case 39:
		if (data[0] == 144)
		{
			moveKey(3, "down", data[2]);
		}
		else
		{
			moveKey(3, "up", data[2]);
		}
		break;
	case 40:
		if (data[0] == 144)
		{
			moveKey(4, "down", data[2]);
		}
		else
		{
			moveKey(4, "up", data[2]);
		}
		break;
	case 41:
		if (data[0] == 144)
		{
			moveKey(5, "down", data[2]);
		}
		else
		{
			moveKey(5, "up", data[2]);
		}
		break;
	case 42:
		if (data[0] == 144)
		{
			moveKey(6, "down", data[2]);
		}
		else
		{
			moveKey(6, "up", data[2]);
		}
		break;
	case 43:
		if (data[0] == 144)
		{
			moveKey(7, "down", data[2]);
		}
		else
		{
			moveKey(7, "up", data[2]);
		}
		break;
	case 44:
		if (data[0] == 144)
		{
			moveKey(8, "down", data[2]);
		}
		else
		{
			moveKey(8, "up", data[2]);
		}
		break;
	case 45:
		if (data[0] == 144)
		{
			moveKey(9, "down", data[2]);
		}
		else
		{
			moveKey(9, "up", data[2]);
		}
		break;
	case 46:
		if (data[0] == 144)
		{
			moveKey(10, "down", data[2]);
		}
		else
		{
			moveKey(10, "up", data[2]);
		}
		break;
	case 47:
		if (data[0] == 144)
		{
			moveKey(11, "down", data[2]);
		}
		else
		{
			moveKey(11, "up", data[2]);
		}
		break;
	case 48:
		if (data[0] == 144)
		{
			moveKey(12, "down", data[2]);
		}
		else
		{
			moveKey(12, "up", data[2]);
		}
		break;
	case 49:
		if (data[0] == 144)
		{
			moveKey(13, "down", data[2]);
		}
		else
		{
			moveKey(13, "up", data[2]);
		}
		break;
	case 50:
		if (data[0] == 144)
		{
			moveKey(14, "down", data[2]);
		}
		else
		{
			moveKey(14, "up", data[2]);
		}
		break;
	case 51:
		if (data[0] == 144)
		{
			moveKey(15, "down", data[2]);
		}
		else
		{
			moveKey(15, "up", data[2]);
		}
		break;
	case 52:
		if (data[0] == 144)
		{
			moveKey(16, "down", data[2]);
		}
		else
		{
			moveKey(16, "up", data[2]);
		}
		break;
	case 53:
		if (data[0] == 144)
		{
			moveKey(17, "down", data[2]);
		}
		else
		{
			moveKey(17, "up", data[2]);
		}
		break;
	case 54:
		if (data[0] == 144)
		{
			moveKey(18, "down", data[2]);
		}
		else
		{
			moveKey(18, "up", data[2]);
		}
		break;
	case 55:
		if (data[0] == 144)
		{
			moveKey(19, "down", data[2]);
		}
		else
		{
			moveKey(19, "up", data[2]);
		}
		break;
	case 56:
		if (data[0] == 144)
		{
			moveKey(20, "down", data[2]);
		}
		else
		{
			moveKey(20, "up", data[2]);
		}
		break;
	case 57:
		if (data[0] == 144)
		{
			moveKey(21, "down", data[2]);
		}
		else
		{
			moveKey(21, "up", data[2]);
		}
		break;
	case 58:
		if (data[0] == 144)
		{
			moveKey(22, "down", data[2]);
		}
		else
		{
			moveKey(22, "up", data[2]);
		}
		break;
	case 59:
		if (data[0] == 144)
		{
			moveKey(23, "down", data[2]);
		}
		else
		{
			moveKey(23, "up", data[2]);
		}
		break;
	case 60:
		if (data[0] == 144)
		{
			moveKey(24, "down", data[2]);
		}
		else
		{
			moveKey(24, "up", data[2]);
		}
		break;
	case 61:
		if (data[0] == 144)
		{
			moveKey(25, "down", data[2]);
		}
		else
		{
			moveKey(25, "up", data[2]);
		}
		break;
	case 62:
		if (data[0] == 144)
		{
			moveKey(26, "down", data[2]);
		}
		else
		{
			moveKey(26, "up", data[2]);
		}
		break;
	case 63:
		if (data[0] == 144)
		{
			moveKey(27, "down", data[2]);
		}
		else
		{
			moveKey(27, "up", data[2]);
		}
		break;
	case 64:
		if (data[0] == 144)
		{
			moveKey(28, "down", data[2]);
		}
		else
		{
			moveKey(28, "up", data[2]);
		}
		break;
	case 65:
		if (data[0] == 144)
		{
			moveKey(29, "down", data[2]);
		}
		else
		{
			moveKey(29, "up", data[2]);
		}
		break;
	case 66:
		if (data[0] == 144)
		{
			moveKey(30, "down", data[2]);
		}
		else
		{
			moveKey(30, "up", data[2]);
		}
		break;
	case 67:
		if (data[0] == 144)
		{
			moveKey(31, "down", data[2]);
		}
		else
		{
			moveKey(31, "up", data[2]);
		}
		break;
	case 68:
		if (data[0] == 144)
		{
			moveKey(32, "down", data[2]);
		}
		else
		{
			moveKey(32, "up", data[2]);
		}
		break;
	case 69:
		if (data[0] == 144)
		{
			moveKey(33, "down", data[2]);
		}
		else
		{
			moveKey(33, "up", data[2]);
		}
		break;
	case 70:
		if (data[0] == 144)
		{
			moveKey(34, "down", data[2]);
		}
		else
		{
			moveKey(34, "up", data[2]);
		}
		break;
	case 71:
		if (data[0] == 144)
		{
			moveKey(35, "down", data[2]);
		}
		else
		{
			moveKey(35, "up", data[2]);
		}
		break;
	case 72:
		if (data[0] == 144)
		{
			moveKey(36, "down", data[2]);
		}
		else
		{
			moveKey(36, "up", data[2]);
		}
		break;
	case 73:
		if (data[0] == 144)
		{
			moveKey(37, "down", data[2]);
		}
		else
		{
			moveKey(37, "up", data[2]);
		}
		break;
	case 74:
		if (data[0] == 144)
		{
			moveKey(38, "down", data[2]);
		}
		else
		{
			moveKey(38, "up", data[2]);
		}
		break;
	case 75:
		if (data[0] == 144)
		{
			moveKey(39, "down", data[2]);
		}
		else
		{
			moveKey(39, "up", data[2]);
		}
		break;
	case 76:
		if (data[0] == 144)
		{
			moveKey(40, "down", data[2]);
		}
		else
		{
			moveKey(40, "up", data[2]);
		}
		break;
	case 77:
		if (data[0] == 144)
		{
			moveKey(41, "down", data[2]);
		}
		else
		{
			moveKey(41, "up", data[2]);
		}
		break;
	case 78:
		if (data[0] == 144)
		{
			moveKey(42, "down", data[2]);
		}
		else
		{
			moveKey(42, "up", data[2]);
		}
		break;
	case 79:
		if (data[0] == 144)
		{
			moveKey(43, "down", data[2]);
		}
		else
		{
			moveKey(43, "up", data[2]);
		}
		break;
	case 80:
		if (data[0] == 144)
		{
			moveKey(44, "down", data[2]);
		}
		else
		{
			moveKey(44, "up", data[2]);
		}
		break;
	case 81:
		if (data[0] == 144)
		{
			moveKey(45, "down", data[2]);
		}
		else
		{
			moveKey(45, "up", data[2]);
		}
		break;
	case 82:
		if (data[0] == 144)
		{
			moveKey(46, "down", data[2]);
		}
		else
		{
			moveKey(46, "up", data[2]);
		}
		break;
	case 83:
		if (data[0] == 144)
		{
			moveKey(47, "down", data[2]);
		}
		else
		{
			moveKey(47, "up", data[2]);
		}
		break;
	case 84:
		if (data[0] == 144)
		{
			moveKey(48, "down", data[2]);
		}
		else
		{
			moveKey(48, "up", data[2]);
		}
		break;
	default:
		console.log("key\t" + data[1] + "\t not configured");
		//ect for all other keys
	}

}

//if button is pressed to send base keyboard again
function resend()
{
	socket.send(JSON.stringify(keys)); //send the base keyboard
}

//every 16ms:
setInterval(function ()
{
	//if any keys are in the buffer
	if (buffer.length > 1)
	{
		var message = JSON.stringify(buffer); //package up our flag and buffer
		socket.send(message); //send our packaged message
		messageLengths += message.length;
		//then update page data box with unpackaged message.
		var box = document.getElementById("midiBox");
		box.innerHTML = buffer.toString();
		//before clearing our buffer of all keys
		buffer = new Array("midi");
	}
}, 16);


setInterval(function ()
{
 console.log ("bitrate:\t" + messageLengths +" characters/s");
 messageLengths =0;
}, 1000);
