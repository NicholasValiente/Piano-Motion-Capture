// all current options for websockets, more can be added at any time.
//to use one, uncomment it back in, and comment out the current one

//lab access
//var socket = new ReconnectingWebSocket("ws://192.168.0.233:3000/relay");
//uws access
//var socket = new ReconnectingWebSocket("ws://137.154.151.239:3000/relay");
//local machine
var socket = new ReconnectingWebSocket("ws://127.0.0.1:3000/relay");
//local network (nick)
//var socket = new ReconnectingWebSocket("ws://192.168.1.101:3000/relay");
