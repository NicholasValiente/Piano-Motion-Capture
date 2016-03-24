var midi, data;
//var socket = new WebSocket("ws://echo.websocket.org:80");
//var socket = new WebSocket("ws://192.168.0.233:3000/relay");
var socket = new WebSocket("ws://137.154.151.239:3000/relay");

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
	
	
}

function onMIDIFailure(error) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

function onMIDIMessage(message) {
    data = message.data; // this gives us our [command/channel, note, velocity] data.
	var textbox = document.getElementById("midiBox");
	textbox.innerHTML += "<br/> State: " + data[0] +" Key: " + data[1] +" Velocity: " + data[2];
	textbox.scrollTop = textbox.scrollHeight;
	
	//socket.send(data[0] +" " +  data[1] +" " + data[2]);
	socket.send(JSON.stringify(data));
	
}