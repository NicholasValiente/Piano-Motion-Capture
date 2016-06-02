namespace Wsyd_Piano_Kinect_Console
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Kinect;
    using System.Net.WebSockets;
    using System.Windows;
    using System.Timers;


    class Program
    {
        private KinectSensor _kinectSensor = null;
        private CoordinateMapper _coordinateMapper = null;
        private BodyFrameReader _bodyFrameReader = null;
        private FrameDescription _frameDescription = null;
        private Body[] _bodies = null;
        private CameraSpacePoint[] _trackedPoints = new CameraSpacePoint[10];

        private Uri _serverURI;
        private ClientWebSocket _socket;
        private System.Timers.Timer _heartbeat;
        private System.Timers.Timer _dataRateTimer; // timer for the data rate transmission

        private CameraSpacePoint _headPos, _wristLeftPos, _wristRightPos;
        private int _dataLength = 0; // length of the transmission data stream in bytes

        void InitKinectSensor()
        {
            this._kinectSensor = KinectSensor.GetDefault();
            this._coordinateMapper = this._kinectSensor.CoordinateMapper;
            this._frameDescription = this._kinectSensor.DepthFrameSource.FrameDescription;
            this._bodyFrameReader = this._kinectSensor.BodyFrameSource.OpenReader();

            this._kinectSensor.Open();

            if (this._bodyFrameReader != null)
            {
                this._bodyFrameReader.FrameArrived += this.Reader_FrameArrived;
            }

        }

        void InitWebSocket(Uri server)
        {
            this._serverURI = server;
            this._heartbeat = new System.Timers.Timer();
            //this._heartbeat.Elapsed += new System.Timers.ElapsedEventHandler(SendHeartBeat);
            this._heartbeat.Interval = 60 * 1000; /* send a heartbeat every 60 seconds */

            this._socket = new ClientWebSocket();
            //this._heartbeat.Start();

        }

        async Task ConnectToServer()
        {
            this._socket = new ClientWebSocket();
            await _socket.ConnectAsync(_serverURI, CancellationToken.None);
            //this._hearbeat.Start();

        }

        private void Reader_FrameArrived(object sender, BodyFrameArrivedEventArgs e)
        {
            bool dataReceived = false;
            //const float InferredZPositionClamp = 0.1f;
            string message = String.Empty;
            string points = string.Empty;
            JointType[] trackedj = /* list of joints we want to track*/
            {
                JointType.Head,
                JointType.Neck,
                JointType.SpineShoulder,
                JointType.SpineMid,
                JointType.ShoulderLeft,
                JointType.ShoulderRight,
                JointType.ElbowLeft,
                JointType.ElbowRight,
                JointType.WristLeft,
                JointType.WristRight
            };

            using (BodyFrame bodyFrame = e.FrameReference.AcquireFrame())
            {
                if(bodyFrame != null)
                {
                    if (this._bodies == null)
                    {
                        this._bodies = new Body[bodyFrame.BodyCount];
                    }

                    bodyFrame.GetAndRefreshBodyData(this._bodies);
                    dataReceived = true;
                }
            }

            if(dataReceived)
            {
                foreach (Body body in this._bodies)
                {
                    if(body.IsTracked)
                    {
                        //IReadOnlyDictionary<JointType, Joint> joints = body.Joints;

                        //Dictionary<JointType, System.Windows.Point> jointPoints = new Dictionary<JointType, Point>();

                        //foreach(JointType jointType in joints.Keys)
                        //{
                        //    // sometimes the depth(z) of an inferred joint may show as negative
                        //    // clamp down to 0.1f to prevent coordingtemapper from returning (-Infinity, -Infinity)
                        //    CameraSpacePoint position = joints[JointType].Position;
                        //    if (position.Z < 0)
                        //    {
                        //        position.Z = InferredZPositionClamp;
                        //    }

                        //    DepthSpacePoint depthSpacePoint = this._coordinateMapper.MapCameraPointToDepthSpace(position);
                        //    jointPoints[jointType] = new Point(depthSpacePoint.X, depthSpacePoint.Y);
                        //}


                        CameraSpacePoint position;

                        int ji = 0;
                        foreach(JointType j in trackedj)
                        {
                            // a CameraSpacePoint coordinate is normally measured in meters
                            position.X = body.Joints[j].Position.X;
                            position.Y = body.Joints[j].Position.Y;
                            position.Z = body.Joints[j].Position.Z;

                            switch(j)
                            {
                                case JointType.Head:
                                    this._headPos = position;
                                    break;
                                case JointType.WristLeft:
                                    this._wristLeftPos = position;
                                    break;
                                case JointType.WristRight:
                                    this._wristRightPos = position;
                                    break;
                            }

                            this._trackedPoints[ji] = position;
                            ji++;
                        }

                        this.DrawToScreen();

                        if (this._socket.State == WebSocketState.Open)
                            this.SendToServer();
                    }
                    else // if the body is not tracked
                    {
                        this._headPos = new CameraSpacePoint();
                        this._wristLeftPos = new CameraSpacePoint();
                        this._wristRightPos = new CameraSpacePoint();

                    }
                }
            }
        }

        // this will draw the values it gets into the screen
        public void DrawToScreen()
        {
            string message = string.Empty;
            WritingObject title = new WritingObject();
            WritingObject kinectStatus = new WritingObject();
            WritingObject websocketStatus = new WritingObject();
            WritingObject headTracker = new WritingObject();
            WritingObject wristLeftTracker = new WritingObject();
            WritingObject wristRightTracker = new WritingObject();

            title.SetPosition(10, 3);
            title.Message = "=== Kinect Server Console... Press Escape to Quit";

            kinectStatus.SetPosition(0, 5);
            message = this._kinectSensor.IsOpen ? "Connected and ready" : "Not available    ";
            kinectStatus.Message = string.Format("Kinect status: {0}", message);

            websocketStatus.SetPosition(0, 6);
            message = this._socket.State == WebSocketState.Open ? "Connected    " : "Not connected";
            websocketStatus.Message = string.Format(
                "Connection To Websocket ({0}): {1}",
                this._serverURI.ToString(),
                message);

            headTracker.SetPosition(0, 8);
            if (this._headPos.Equals(new CameraSpacePoint()))
                message = "N/A, N/A, N/A";
            else
                message = string.Format("{0}, {1}, {2}", this._headPos.X, this._headPos.Y, this._headPos.Z);
            headTracker.Message = string.Format("Head position: {0}", message);

            wristLeftTracker.SetPosition(0, 9);
            if (this._wristLeftPos.Equals(new CameraSpacePoint()))
                message = "N/A, N/A, N/A";
            else
                message = string.Format("{0}, {1}, {2}", this._wristLeftPos.X, this._wristLeftPos.Y, this._wristLeftPos.Z);
            wristLeftTracker.Message = string.Format("Left Wrist position: {0}", message);

            wristRightTracker.SetPosition(0, 10);
            if (this._wristRightPos.Equals(new CameraSpacePoint()))
                message = "N/A, N/A, N/A";
            else
                message = string.Format("{0}, {1}, {2}", this._wristRightPos.X, this._wristRightPos.Y, this._wristRightPos.Z);
            wristRightTracker.Message = string.Format("Right Wrist position: {0}", message);

            title.Write();
            kinectStatus.Write();
            websocketStatus.Write();
            headTracker.Write();
            wristLeftTracker.Write();
            wristRightTracker.Write();
        }

        public async void SendToServer()
        {
            string message = string.Empty;
            string points = string.Empty;
            const int scaleAmt = 1000;
            ArraySegment<byte> sendbuf;

            foreach(CameraSpacePoint joint in this._trackedPoints )
            {
                points += string.Format(
                    ",[{0},{1},{2}]",
                    (int)(joint.X * scaleAmt),
                    (int)(joint.Y * scaleAmt),
                    (int)(joint.Z * scaleAmt));
            }
            message = string.Format("[\"kin2\"{0}]", points);
            sendbuf = new ArraySegment<byte>(Encoding.UTF8.GetBytes(message));
            this._dataLength += Encoding.UTF8.GetByteCount(message);

            try
            {

                var sendResult =  _socket.SendAsync(
                    sendbuf,
                    WebSocketMessageType.Text,
                    endOfMessage: true,
                    cancellationToken: CancellationToken.None);

                sendResult.Wait();
            }
            catch (Exception e)
            {
                WritingObject reConn = new WritingObject();

                await _socket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                this._heartbeat.Stop();
                await ConnectToServer();

                reConn.SetPosition(0, 15);
                reConn.Message = 
                    string.Format(
                        "An error happened: {0}\r\nRestarted websocket connection at {1}",
                        e.Message,
                        DateTime.Now.ToString("h:mm:ss tt"));
                reConn.Write();
            }



        }

        private void UpdateDataRate(object source, ElapsedEventArgs e)
        {
            WritingObject dataRate = new WritingObject();

            dataRate.SetPosition(0, 11);
            dataRate.Message = string.Format("Data rate: {0} bytes/s", this._dataLength);
            dataRate.Write();

            this._dataLength = 0;
        }

        public Program()
        {
            WritingObject kinect, websocket;

            kinect = new WritingObject();
            websocket = new WritingObject();


            kinect.SetPosition(0, 0);
            kinect.Message = "Initialising Kinect Sensor";
            websocket.SetPosition(0, 1);
            websocket.Message = "Initialising websocket connection";

            kinect.Write();
            InitKinectSensor();

            websocket.Write();
            InitWebSocket(new Uri("ws://127.0.0.1:3000/relay"));
            //InitWebSocket(new Uri("ws://137.154.151.239:3000/relay"));


            ConnectToServer().Wait();

            DrawToScreen();

            this._dataRateTimer = new System.Timers.Timer();
            this._dataRateTimer.Elapsed += new System.Timers.ElapsedEventHandler(UpdateDataRate);
            this._dataRateTimer.Interval = 1000; /* set the time to 1 second */
            this._dataRateTimer.Start();

        }

        static void Main(string[] args)
        {
            Program p = new Program();



            while (Console.ReadKey().Key != ConsoleKey.Escape) ;

            return;
        }
    }

    // A class to take care of writing to the console
    class WritingObject
    {
        private string _message;
        private PointF _pos;

        public string Message
        {
            get { return this._message; }
            set { this._message = value; }
        }

        public void SetPosition(int X, int Y)
        {
            this._pos.X = X;
            this._pos.Y = Y;
        }

        public WritingObject()
        {
            this._message = string.Empty;
            this._pos.X = 0;
            this._pos.Y = 0;
        }

        public void Write()
        {
            Console.SetCursorPosition((int)this._pos.X, (int)this._pos.Y);
            Console.WriteLine(this._message);
        }


    }
}
