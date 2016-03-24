kinectMan_included = true; //check if kinectMan.js has been included in surfing.htm

var placemark = [];
var model = [];
var link = [];
var loc = [];

var Lat = -33.85000;
var Lng = 151.20362;
var Alt = 950;

var tempLat;
var tempLng;
var tempAlt;

var xConst = 0.0064;
var a;
var i;

function initMan() {

    for (i = 0; i <= 15; ++i) {

        placemark[i] = ge.createPlacemark('');
        model[i] = ge.createModel('');
        link[i] = ge.createLink('');

        if (i == 0) {
            link[i].setHref('https://dl.dropbox.com/u/39047918/redball.dae');
        } else {
            link[i].setHref('https://dl.dropbox.com/u/39047918/redball.dae');
        }
      
        model[i].setLink(link[i]);
        model[i].setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
        loc[i] = ge.createLocation('');
        loc[i].setLatLngAlt(Lat, Lng, Alt);
        model[i].setLocation(loc[i]);

        ge.getFeatures().appendChild(placemark[i]);
        placemark[i].setGeometry(model[i]);

        if (i == 0) {
            placemark[i].getGeometry().getScale().set(1000, 1000, 1000); 
        }
        else {
            placemark[i].getGeometry().getScale().set(1000, 1000, 1000); 
        }

    }


}

function moveMan() {

    Lat = camera.getLatitude() - 0.008; //offsets used to see kinectMan on single player
    Lng = camera.getLongitude() - 0.008;
    Alt = camera.getAltitude() - 200; 

    for (a = 0; a <= 15; ++a) {

        switch (a) {

            case 0:

                tempAlt = Alt + (480 - head.y);
                tempLng = Lng + (xConst - head.x / 100000);
                tempLat = Lat + (head.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 1:

                tempAlt = Alt + (480 - wristleft.y);
                tempLng = Lng + (xConst - wristleft.x / 100000);
                tempLat = Lat + (wristleft.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 2:

                tempAlt = Alt + (480 - wristright.y);
                tempLng = Lng + (xConst - wristright.x / 100000);
                tempLat = Lat + (wristright.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 3:

                tempAlt = Alt + (480 - shoulderleft.y);
                tempLng = Lng + (xConst - shoulderleft.x / 100000);
                tempLat = Lat + (shoulderleft.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 4:

                tempAlt = Alt + (480 - shoulderright.y);
                tempLng = Lng + (xConst - shoulderright.x / 100000);
                tempLat = Lat + (shoulderright.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 5:

                tempAlt = Alt + (480 - elbowleft.y);
                tempLng = Lng + (xConst - elbowleft.x / 100000);
                tempLat = Lat + (elbowleft.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 6:

                tempAlt = Alt + (480 - elbowright.y);
                tempLng = Lng + (xConst - elbowright.x / 100000);
                tempLat = Lat + (elbowright.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 7:

                tempAlt = Alt + (480 - shouldercenter.y);
                tempLng = Lng + (xConst - shouldercenter.x / 100000);
                tempLat = Lat + (shouldercenter.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 8:

                tempAlt = Alt + (480 - (hip.y));
                tempLng = Lng + (xConst - hip.x / 100000);
                tempLat = Lat + (hip.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break; 

            case 9:

                tempAlt = Alt + (480 - hipleft.y);
                tempLng = Lng + (xConst - hipleft.x / 100000);
                tempLat = Lat + (hipleft.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 10:

                tempAlt = Alt + (480 - hipright.y);
                tempLng = Lng + (xConst - hipright.x / 100000);
                tempLat = Lat + (hipright.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 11:

                tempAlt = Alt + (480 - kneeleft.y);
                tempLng = Lng + (xConst - kneeleft.x / 100000);
                tempLat = Lat + (kneeleft.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 12:

                tempAlt = Alt + (480 - kneeright.y);
                tempLng = Lng + (xConst - kneeright.x / 100000);
                tempLat = Lat + (kneeright.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 13:

                tempAlt = Alt + (480 - ankleleft.y);
                tempLng = Lng + (xConst - ankleleft.x / 100000);
                tempLat = Lat + (ankleleft.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 14:

                tempAlt = Alt + (480 - ankleright.y);
                tempLng = Lng + (xConst - ankleright.x / 100000);
                tempLat = Lat + (ankleright.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;

            case 15:

                tempAlt = Alt + (480 - spine.y);
                tempLng = Lng + (xConst - spine.x / 100000);
                tempLat = Lat + (spine.z / 1000);
                loc[a].setLatLngAlt(tempLat, tempLng, tempAlt);
                break;
        }
        model[a].setLocation(loc[a]);
        placemark[a].setGeometry(model[a]);
    }

}







