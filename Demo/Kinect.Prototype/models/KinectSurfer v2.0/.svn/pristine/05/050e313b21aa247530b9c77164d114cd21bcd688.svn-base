This is a brief informal outline of the version changes throughout the development
of Surfer 2.0 and kinectMan. 

v1.1 

- formatted all the code so it is more readable
- beautified the javascript 
- added the images for console.htm
- cleaned up the html and CSS (console.htm and surfing.htm) 
  observing as close to Strict DOCTYPE as possible 
- tested 

v1.2 

- seperated all model code from kinect.js file
  into a new javascript file called models.js (including associated global vars)
- crowd management implemented in the server code
- tested

v1.3 

- created a new file main.js to seperate google earth initialisation code and websocket code
  from kinect.js and models.js 
- models.js has been excluded from surfing.htm 
  and must be re-included to be able to use the models/tablet!
- tested

v1.4 

- left/right footed surfing has been implemented in kinect.js 
  using a knee and hip flag to decide if and when to invert the surfer
- removed most of the redundant commenting from kinect.js for readability 
  these comments and non-functioning conditions can be accessed in copies of 
  previous versions
- tested

v1.5

- kinect man initial development
- static collada models placed into google earth
- models initialised in main.js by the new "initMan" function 
- tested

v1.6 

- kinect man models moved along 3 dimensions (lat,long,alt)
  by scaling the kinect's joint data (moveMan function)
- if/else chains changed to switch/case for efficiency
- for loops pre-incremented
- tested

v1.7

- kinectMan model latitude, longitude and altitude appended by 
  the camera position so the kinectMan moves with the surfer
- websocket cleanup undertaken in the server code
- additional code efficiency undertaken to maximise the frames per second of the surfer
  with kinectMan enabled
- tested

v1.8

- kinect.js edited after the websocket cleanup 
  to use the new JSON string format
- eval replaced with JSON.parse for efficiency
- tested

v1.9 

- dotman.js was broken after the websocket update
  code edited to use new websocket data format
- flags were added to surfing.htm that allow models.js and kinectMan.js 
  to be excluded from surfing without having to edit the function calls in main.js
  now you just have to comment out the inclusions to turn them off
- tested

v2.0 (final project build)

- CSS set back to surfer rig resolutions (public release set for 24inch) 
- excess commenting removed
- websocket addresses need to be edited depending on usage
  currently set to localhost!
- tested