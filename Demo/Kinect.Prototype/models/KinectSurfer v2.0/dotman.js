window.onload = function () {

    var logWindow = document.getElementById("logwindow");
    var canvas = document.getElementById("dotman_canvas");
    var context = canvas.getContext("2d");
    var scaleX = canvas.width / 640;
    var scaleY = canvas.height / 480;
    var logCount = 0;

    if (!window.WebSocket) {
        logWindow.innerHTML = "Your browser does not support web sockets!";
        return;
    }

    altWindow = document.getElementById("altwindow");
    headingWindow = document.getElementById("headingwindow");
    speedWindow = document.getElementById("speedwindow");
    bandwidthWindow = document.getElementById("bandwidthwindow");

    logWindow.innerHTML = "<strong>Connecting to kinect websocket relay...</strong>";

    // Initialize a new web socket.
    var kinectSocket = new WebSocket("ws://localhost:8181/KinectHtml5");
    var relaySocket = new WebSocket("ws://localhost:3000/relay");

    // Connection established.
    kinectSocket.onopen = function () {
        logWindow.innerHTML = "<strong>kinectSocket Connection established</strong>";
    };
    relaySocket.onopen = function () {
        logWindow.innerHTML = "<strong>relaySocket Connection established</strong>";
    };

    // Connection closed.
    kinectSocket.onclose = function () {
        logWindow.innerHTML = "<strong>kinectSocket Connection closed</strong>";
    }
    relaySocket.onclose = function () {
        logWindow.innerHTML = "<strong>relaySocket Connection closed</strong>";
    }

    // Receive data from the server!
    kinectSocket.onmessage = function (evt) {

        // Get the data in JSON format.
        var jsonObject = eval('(' + evt.data + ')');
        // Show every n'th websocket string
        if (logCount > 10) {
            logWindow.innerHTML = "<strong>Kinect WebSocket stream:</strong> " + evt.data.substring(0, 360);
            logCount = 0;
        } else {
            logCount++;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#ffffff";
        context.beginPath();

        var wristL = 0; var wristR = 0; var hipL = 0; var hipR = 0; var hipC = 0;

        context.fillStyle = "#fff";

        for (var j = 0; j < jsonObject.joints.length; j++) {
            var joint = jsonObject.joints[j];

            if (j == 6) {
                wristL = parseFloat(joint.y); // record and skip
            } else if (j == 10) {
                wristR = parseFloat(joint.y); // record and skip
            } else {
                if (j == 0) { hipC = parseFloat(joint.y); } // record hipC

                context.arc(parseFloat(joint.x) * scaleX, parseFloat(joint.y) * scaleY, 40 - parseFloat(joint.z) * 10, 0, Math.PI * 2, true);
            }
        }

        context.closePath;
        context.fill();

        if ((wristL > hipC) && (wristR > hipC)) {  // red wrist if wrists below hip
            context.fillStyle = "red";
        } else {
            context.fillStyle = "white";
        }
        context.beginPath();

        // Display the skeleton wrists.
        for (var j = 0; j < jsonObject.joints.length; j++) {
            var joint = jsonObject.joints[j];

            if (j == 6 || j == 10) {
                context.arc(parseFloat(joint.x) * scaleX, parseFloat(joint.y) * scaleY, 40 - parseFloat(joint.z) * 10, 0, Math.PI * 2, true);
            }
        }

        context.closePath;
        context.fill();

        // shoulders left 4 right 8
        jointLine(jsonObject.joints[4], jsonObject.joints[8], 1.5, 85, "h");
        jointLine(jsonObject.joints[1], jsonObject.joints[2], 0.5, 120, "v");

    };

    function jointLine(j1, j2, scaleL, scaleH, dir) {

        var x1 = parseFloat(j1.x) * scaleX; var y1 = parseFloat(j1.y) * scaleY;
        var x2 = parseFloat(j2.x) * scaleX; var y2 = parseFloat(j2.y) * scaleY;
        var z1 = parseFloat(j1.z); var z2 = parseFloat(j2.z);
        var diffX = (x2 - x1) * scaleL;
        var diffY = (y2 - y1) * scaleL;
        var diffZ = Math.round((z2 - z1) * scaleH);

        x1 -= diffX; y1 -= diffY;
        x2 += diffX; y2 += diffY;
        var leftZ = 0; var rightZ = 0;

        if (diffZ > 0) { leftZ = diffZ; } else { rightZ = -diffZ; }

        if (Math.abs(diffZ) < 3) {
            context.fillStyle = "#f80"; // dark yellow
        } else {
            context.fillStyle = "red";
        }

        var girth = 3; // minimum bar thickness
        context.beginPath();
        if (dir == "h") { // horizontal line
            context.moveTo(x1, y1 - leftZ - girth);
            context.lineTo(x2, y2 - rightZ - girth);
            context.lineTo(x2 + rightZ * 1.5, y2); // point
            context.lineTo(x2, y2 + rightZ + girth);
            context.lineTo(x1, y1 + leftZ + girth);
            context.lineTo(x1 - leftZ * 1.5, y1); // point
        } else { //vertical
            context.moveTo(x1 - leftZ - girth, y1);
            context.lineTo(x1, y1 + leftZ); // point
            context.lineTo(x1 + leftZ + girth, y1);
            context.lineTo(x2 + rightZ + girth, y2);
            context.lineTo(x2, y2 - rightZ); // point
            context.lineTo(x2 - rightZ - girth, y2);
        }
        context.closePath();
        context.fill();
    };

    // when a relaySocket message arrives
    relaySocket.onmessage = function (evt) {

        var message = evt.data;

        if (message.substring(0, 3) == "cmd ") {
            // looks like a command
            logWindow.innerHTML = message;
            if (message == "cmd refresh") {
                location.reload(true);
            }
        } else {
            // looks like something else... cam data!
            var cam = JSON.parse(message);
            if (cam.id == 2) {
                ballLat = cam.Lat;
                ballLon = cam.Lon;
            }
        }
    }

};