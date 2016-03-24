/*------------\
| KINECT CODE |
\------------*/

var MOVE_FORWARD = true;
var MOVE_BACKWARD;
var MOVE_SPEED = 0.0;
var newROLL;
var altSpeedup;
var wristDelta;
var now;
var dt;

var localToGlobalFrame;
var headingVec;
var rightVec;
var strafe = 0.0;
var forward = 0;
var forwardVelocity;
var tilt;
var altOffset = 0;

var shoulderleft;
var shoulderright;
var shouldercenter;
var hip;
var hipleft;
var hipright;
var wristright;
var wristleft;
var spine;
var kneeright;
var kneeleft;
var ankleright;
var ankleleft;
var head;
var elbowleft;
var elbowright;

var jsonObject;

var skeledata = {
    "head": 3,
    "shoulder": { "center": 2, "left": 4, "right": 8 },
    "spine": 1,
    "elbow": { "left": 5, "right": 9 },
    "wrist": { "left": 6, "right": 10 },
    "hand": { "left": 7, "right": 11 },
    "hip": { "center": 0, "left": 12, "right": 16 },
    "knee": { "left": 13, "right": 17 },
    "ankle": { "left": 14, "right": 18 },
    "foot": { "left": 15, "right": 19 }
};

function doKinect(evt) {

    status.innerHTML = "Kinect data received.";

    jsonObject = JSON.parse(evt);

    shoulderleft = jsonObject.joints[skeledata.shoulder.left];
    shoulderright = jsonObject.joints[skeledata.shoulder.right];
    shouldercenter = jsonObject.joints[skeledata.shoulder.center];
    hip = jsonObject.joints[skeledata.hip.center];
    hipleft = jsonObject.joints[skeledata.hip.left];
    hipright = jsonObject.joints[skeledata.hip.right];
    wristright = jsonObject.joints[skeledata.wrist.right];
    wristleft = jsonObject.joints[skeledata.wrist.left];
    spine = jsonObject.joints[skeledata.spine];
    kneeright = jsonObject.joints[skeledata.knee.right];
    kneeleft = jsonObject.joints[skeledata.knee.left];
    ankleright = jsonObject.joints[skeledata.ankle.right];
    ankleleft = jsonObject.joints[skeledata.ankle.left];
    head = jsonObject.joints[skeledata.head];
    elbowleft = jsonObject.joints[skeledata.elbow.left];
    elbowright = jsonObject.joints[skeledata.elbow.right];

    MOVE_BACKWARD = false;

    if ((kneeleft.x <= kneeright.x) && (hipleft.x <= hipright.x))   // "goofy" stance
    {

        if ((shouldercenter.y < hip.y) && (spine.y - shouldercenter.y > 50)) {

            PITCH = (shoulderleft.y - shoulderright.y);
            ROLL = ((hip.z - shouldercenter.z) * 150) + 10;
            YAW = shoulderright.z - shoulderleft.z;

            newROLL = ROLL;
            if (ROLL > 0) {

            }
            else {
                newROLL = ROLL * 2;
            }
            ROLL = newROLL;

            if (wristright.y > hip.y && wristleft.y > hip.y) {
                MOVE_BACKWARD = true;
            }
            else {
                altSpeedup = camera.getAltitude() / 1100;

                if (altSpeedup < 1) {
                    altSpeedup = 1;
                }

                wristDelta = wristright.x - shoulderright.x;

                if (wristDelta < 0) {
                    MOVE_SPEED = 0;
                }
                else {
                    wristDelta /= 3;
                    MOVE_SPEED = ((wristDelta * wristDelta) / 3) * altSpeedup;
                }
            }

            now = (new Date()).getTime();
            dt = (now - last) / 1000.0;
            if (dt > 0.25) {
                dt = 0.25;
            }
            last = now;

            updatePosition(dt);
            updateView();
            updateCamera();
            if (kinectMan_included) {
                moveMan();
            }
        }
    }

    else if ((kneeright.x < kneeleft.x) && (hipright.x < hipleft.x)) // invert surfing to "normal" stance
    {
        if ((shouldercenter.y < hip.y) && (spine.y - shouldercenter.y > 50)) {

            PITCH = (shoulderright.y - shoulderleft.y);
            ROLL = (shouldercenter.z - hip.z) * 150;
            YAW = (shoulderright.z - shoulderleft.z);

            newROLL = ROLL;
            if (ROLL > 0) {

            }
            else {
                newROLL = ROLL * 2;
            }
            ROLL = newROLL;

            if (wristright.y > hip.y && wristleft.y > hip.y) {
                MOVE_BACKWARD = true;
            }
            else {
                altSpeedup = camera.getAltitude() / 1100;

                if (altSpeedup < 1) {
                    altSpeedup = 1;
                }

                wristDelta = wristleft.x - shoulderleft.x;

                if (wristDelta < 0) {
                    MOVE_SPEED = 0;
                }
                else {
                    wristDelta /= 3;
                    MOVE_SPEED = ((wristDelta * wristDelta) / 3) * altSpeedup;
                }
            }
            now = (new Date()).getTime();
            dt = (now - last) / 1000;
            if (dt > 0.25) {
                dt = 0.25;
            }
            last = now;

            updatePosition(dt);
            updateView();
            updateCamera();
            if (kinectMan_included) {
                moveMan();
            }

        }

    }

}

function updateView() {
    camera.setTilt(PITCH + 90);
    camera.setRoll(ROLL);
    camera.setHeading(((YAW + CURRENT_HEADING) * 6) % 360);
    camera.setAltitude(currentAltitude);
    CURRENT_HEADING += YAW;
}

function updatePosition(dt) {
    localToGlobalFrame = M33.makeLocalToGlobalFrame(localAnchorLla);
    headingVec = V3.rotate(localToGlobalFrame[1], localToGlobalFrame[2], -(camera.getHeading() * Math.PI / 180));
    rightVec = V3.rotate(localToGlobalFrame[0], localToGlobalFrame[2], -(camera.getHeading() * Math.PI / 180));

    strafe = ROLL * dt * -1;

    if (MOVE_FORWARD) {
        forwardVelocity = MOVE_SPEED;
        if (MOVE_BACKWARD) forwardVelocity *= -1;
        forward = forwardVelocity * dt;
    }

    if (MOVE_BACKWARD) {
        forward = 0;
    }

    tilt = camera.getTilt();
    tilt++;

    if (tilt < 90) {
        tilt = 90 - tilt;
        altOffset = -forward * Math.tan(tilt * Math.PI / 180);
    }
    else if (tilt > 90) {
        tilt = tilt - 90;
        altOffset = forward * Math.tan(tilt * Math.PI / 180);
    }

    currentAltitude += altOffset;

    localAnchorCartesian = V3.add(localAnchorCartesian, V3.scale(rightVec, strafe));
    localAnchorCartesian = V3.add(localAnchorCartesian, V3.scale(headingVec, forward));
    localAnchorLla = V3.cartesianToLatLonAlt(localAnchorCartesian);
}
