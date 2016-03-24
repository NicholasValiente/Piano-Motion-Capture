using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Fleck;
using Microsoft.Kinect;
using System.Diagnostics;

namespace Kinect.Server {
    class Program {
        static List<IWebSocketConnection> clientSockets;
        static KinectSensor sensor = KinectSensor.KinectSensors.FirstOrDefault(s => s.Status == KinectStatus.Connected); // Get first Kinect Sensor
        static float FAR_AWAY = 10000f; static float closestDistance = FAR_AWAY;
        static int closestId = 0; static int sensorTilt = 0;
        static int MAX_NOOF_CLIENTS = 5;
        static int DEFAULT_XSCALE = 640; static int DEFAULT_YSCALE = 480; static int DEFAULT_ZSCALE = 10;

        public class client {
            public string clientID = "";
            public bool[] joints = new bool[20];
            public float rate = -1; // -1 means 'unrated', 0 means 'stop'
            public int xScale = DEFAULT_XSCALE;
            public int yScale = DEFAULT_YSCALE;
            public int zScale = DEFAULT_ZSCALE;
            public double lastTimeSent;
            public double delta = 0; // 0 means unrated
        }

        public static client[] clientInfo = new client[ MAX_NOOF_CLIENTS ];
        // public static List<client> clientList;

        static void Main(string[] args) {

            // Create enough "empty" clients in clientInfo
            for (int i = 0; i < clientInfo.Length; i++) {
                clientInfo[i] = new client();   
            }

            if (KinectSensor.KinectSensors.Count < 1)
            {
                Console.WriteLine("Can't find a Kinect Sensor!");
                return;
            }

            InitialiseKinect( sensor );
            InitialiseSockets( );
        }

        private static void InitialiseSockets() {
            clientSockets = new List<IWebSocketConnection>();

            var server = new WebSocketServer("ws://localhost:8181");
            server.ListenerSocket.NoDelay = true;
            Console.WriteLine("Kinect Server 3.2 started\n");

            server.Start( socket => {
                socket.OnOpen = () => {
                    
                    int i = 0; bool clientInfoAdded = false;
                    string socketID = socket.ConnectionInfo.Id.ToString();
                    
                    while (!clientInfoAdded && i < clientInfo.Length)
                    {
                        if (clientInfo[i].clientID == "")
                        {   // set all clientInfo to "defaults"
                            clientInfo[i].clientID = socketID;
                            clientInfo[i].rate = -1; // unrated
                            clientInfo[i].xScale = DEFAULT_XSCALE;
                            clientInfo[i].yScale = DEFAULT_YSCALE;
                            clientInfo[i].zScale = DEFAULT_ZSCALE;
                            clientInfo[i].delta = 0; // unrated
                            for (int j = 0; j < clientInfo[i].joints.Length; j++)
                            {   // all joints on by default
                                clientInfo[i].joints[j] = true;
                            }
                            clientInfoAdded = true;
                        }
                        else {
                            i++;
                        }
                    }
                    if (clientInfoAdded)
                    {
                        clientSockets.Add(socket);
                        Console.WriteLine( "\n"+ i + ":New client " + socket.ConnectionInfo.ClientIpAddress + ":" + socket.ConnectionInfo.ClientPort + " ID: " + socketID);
                    }
                    else
                    {
                        Console.WriteLine("client NOT added!");
                    }
                }; // socket.OnOpen

                socket.OnClose = () => {

                    // clientSockets.Remove(socket);

                    int i = 0; bool clientRemoved = false;
                    string socketID = socket.ConnectionInfo.Id.ToString();

                    while ( !clientRemoved && i < clientInfo.Length) {
                        if (clientInfo[i].clientID == socketID)
                        {
                            clientInfo[i].clientID = "";  // remove the closed socket's client ID
                            try
                            {
                                clientSockets.Remove(socket);
                            }
                            catch
                            {
                                Console.WriteLine("remove client failed.");
                            }

                           /*clientInfo[i].rate = -1;      // reset all other client data to defaults
                            clientInfo[i].xScale = DEFAULT_XSCALE;
                            clientInfo[i].xScale = DEFAULT_YSCALE;
                            clientInfo[i].xScale = DEFAULT_ZSCALE;
                            clientInfo[i].delta = 0;

                            for (int j = 0; j < clientInfo[i].joints.Length; j++)
                            { 
                                clientInfo[i].joints[j] = true;
                            }*/
                            Console.WriteLine("\n"+ i + ":Removed ID: " + socketID);

                            clientRemoved = true;
                        }
                        else
                        {
                            i++;
                        }
                    }
                    if (!clientRemoved)
                    {
                        Console.WriteLine("Removing a client I couldn't find in clientInfo[]");
                    }
                }; // socket.OnClose

                socket.OnMessage = message => {
                    int i = 0; bool clientFound = false;
                    string socketID = socket.ConnectionInfo.Id.ToString();

                    //Console.WriteLine("recvd message from " + socket.ConnectionInfo.Id );

                    while ( !clientFound && i < clientSockets.Count) {
                        /*if (clientInfo[i].clientID == "") {
                            //clientInfo[i].clientID = socketID;
                        }*/

                        if (clientInfo[i].clientID == socketID) {
                            clientFound = true;
                            Console.WriteLine(i + ":" + message);
                            string[] clientReq = message.Split(',');

                            if (clientReq[0] == "joints") {
                                if (clientReq.Length > 1)
                                {
                                    if (clientReq[1] == "all")
                                    {
                                        for (int k = 0; k < clientInfo[i].joints.Length; k++)
                                        { // turn all joints on
                                            clientInfo[i].joints[k] = true;
                                        }
                                    }
                                    else // use specific joints
                                    {
                                        for (int k = 0; k < clientInfo[i].joints.Length; k++)
                                        { // turn all joints off
                                            clientInfo[i].joints[k] = false;
                                        }

                                        for (int k = 1; k < clientReq.Length; k++)
                                        {
                                            int jointNumber;
                                            int.TryParse(clientReq[k], out jointNumber);
                                            if (jointNumber >= 0 && jointNumber < 20)
                                            { // sanity check
                                                clientInfo[i].joints[jointNumber] = true;  //set true for each required joint                                  
                                            }
                                        }
                                    }
                                }
                                else // "joint," with no JOINTS list! So Turn them all off!
                                {
                                    for (int k = 0; k < clientInfo[i].joints.Length; k++)
                                    { // turn all joints off
                                        clientInfo[i].joints[k] = false;
                                    }
                                }

                            }

                            if (clientReq[0] == "rate" && clientReq.Length == 2)
                            {
                                //Console.WriteLine("in rate");
                                if (clientReq[1] == "unrated")
                                { // set full rate
                                    clientInfo[i].rate = -1;
                                    clientInfo[i].delta = 0;
                                }
                                else
                                {
                                    float.TryParse(clientReq[1], out clientInfo[i].rate);  // set other rate
                                    if (clientInfo[i].rate > 0) // sanity check
                                    {
                                        clientInfo[i].delta = (double)1 / clientInfo[i].rate;
                                    }
                                }
                            }
                            

                            if (clientReq[0] == "scale" && clientReq.Length == 4)
                            { // NEEDS SAFETY CHECKS
                                //Console.WriteLine("in scale");
                                int.TryParse(clientReq[1], out clientInfo[i].xScale);  // set scale
                                int.TryParse(clientReq[2], out clientInfo[i].yScale);
                                int.TryParse(clientReq[3], out clientInfo[i].zScale);
                            }
                            
                            if (clientReq[0] == "tilt" && clientReq.Length == 2)
                            {  //Console.WriteLine("in tilt");
                                int.TryParse(clientReq[1], out sensorTilt);  // set sensor motor tilt
                                if (sensorTilt > -28 && sensorTilt < 28) // checking for safe values
                                {
                                    try
                                    {
                                        sensor.ElevationAngle = sensorTilt;
                                    }
                                    catch { } // ignore errors when setting Tile while Kinect is moving
                                }
                            }
                        }
                        i++;
                    }       
                }; // socket.OnMessage
            }); // server.Start

            Console.ReadLine(); // needed to keep Console open? YES!
        }

        public static void InitialiseKinect(KinectSensor sensor) {
            try {
                sensor.SkeletonStream.Enable(new TransformSmoothParameters() {
                    Correction = 0.5f,
                    Prediction = 0.5f,
                    Smoothing = 0.5f,
                    JitterRadius = 0.01f,
                    MaxDeviationRadius = 0.01f
                });
            }
            catch (ArgumentOutOfRangeException outOfRange) {
                Console.WriteLine("Error: {0}", outOfRange.Message);
                sensor.SkeletonStream.Enable();
            }

            sensor.Start();

            if (sensor != null && sensor.SkeletonStream != null) {
                if (!sensor.SkeletonStream.AppChoosesSkeletons) {
                    sensor.SkeletonStream.AppChoosesSkeletons = true; // ensure app chooses skeletons is set
                }
            }
            
            sensor.SkeletonFrameReady += new EventHandler<SkeletonFrameReadyEventArgs>(Nui_SkeletonFrameReady);

            Console.Write("Correction:" + sensor.SkeletonStream.SmoothParameters.Correction);
            Console.Write(" Prediction:" + sensor.SkeletonStream.SmoothParameters.Prediction);
            Console.Write(" Smoothing:" + sensor.SkeletonStream.SmoothParameters.Smoothing);
            Console.Write("\nJitterRadius:" + sensor.SkeletonStream.SmoothParameters.JitterRadius);
            Console.WriteLine(" MaxDeviationRadius:" + sensor.SkeletonStream.SmoothParameters.MaxDeviationRadius);
        }    

        private static void Nui_SkeletonFrameReady(object sender, SkeletonFrameReadyEventArgs e) {            
            using (SkeletonFrame skeletonFrame = e.OpenSkeletonFrame()) // Open the Skeleton frame
            {
                if (skeletonFrame != null) {                            // check that a frame is available
                    Skeleton[] skeletons = new Skeleton[skeletonFrame.SkeletonArrayLength];
                    int totalSkeletons = skeletonFrame.SkeletonArrayLength;
                    int counter = 0;
                    skeletonFrame.CopySkeletonDataTo( skeletons );       // get the skeletal information in this frame

                    foreach (Skeleton S in skeletons) {
                        if (S.TrackingState != SkeletonTrackingState.NotTracked) {
                            if (S.Position.Z < closestDistance) {
                                closestId = S.TrackingId;
                                closestDistance = S.Position.Z;
                            }
                            if (closestId > 0) {
                                sensor.SkeletonStream.ChooseSkeletons( closestId ); // track this skeleton

                                if (S.TrackingId == closestId) {   
                                   
                                        foreach (var thisClient in clientSockets) {
                                            string socketID = thisClient.ConnectionInfo.Id.ToString();
                                            int i = 0; bool clientFound = false;
                                            while (!clientFound && i < clientInfo.Length) { // search thru clientInfo looking for this client!?
                                                if (clientInfo[i].clientID == socketID) {
                                                    clientFound = true;
                                                } else {
                                                    i++;
                                                }
                                            }

                                            if (clientFound && clientInfo[i].rate != 0) { //have client and client not 'stopped'
                                                if (clientInfo[i].delta == 0)  {// this client is not using rate limits
                                                    string jointString = S.getJoints(clientInfo[i].joints, clientInfo[i].xScale, clientInfo[i].yScale, clientInfo[i].zScale);
                                                    try
                                                    {
                                                        thisClient.Send( jointString );
                                                    }
                                                    catch
                                                    {
                                                        Console.WriteLine("websocket send failed");
                                                    }
                                                } else { // rate limited client
                                                    DateTime dt = DateTime.Now;
                                                    double totalSeconds = dt.TimeOfDay.TotalSeconds;
                                                    if (clientInfo[i].lastTimeSent + clientInfo[i].delta < totalSeconds)
                                                    {
                                                        string jointString = S.getJoints(clientInfo[i].joints, clientInfo[i].xScale, clientInfo[i].yScale, clientInfo[i].zScale);
                                                        try
                                                        {
                                                            thisClient.Send( jointString );
                                                        }
                                                        catch
                                                        {
                                                            Console.WriteLine("websocket send failed");
                                                        }
                                                        clientInfo[i].lastTimeSent = totalSeconds; // save time sent
                                                    }
                                                }
                                            } // clientFound
                                        } // each thisClient
                                } // tracking closest
                            } // we have a closest
                        }

                        if (S.TrackingState == SkeletonTrackingState.NotTracked) {
                            counter++;
                            if (counter == totalSkeletons) {
                                closestDistance = FAR_AWAY;
                                closestId = 0;
                            }
                        }
                    }
                }
            }
        }
    }
}