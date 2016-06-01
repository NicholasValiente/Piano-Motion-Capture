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
            Console.WriteLine("Initialising Kinect Sensor");
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
            Console.WriteLine("Initialising Websocket Connection");
            this._serverURI = server;
            this._heartbeat = new System.Timers.Timer();
            //this._heartbeat.Elapsed += new System.Timers.ElapsedEventHandler(SendHeartBeat);
            this._heartbeat.Interval = 60 * 1000; /* send a heartbeat every 60 seconds */

            this._socket = new ClientWebSocket();
            //this._heartbeat.Start();

        }

        async Task ConnectToServer()
        {
            await _socket.ConnectAsync(_serverURI, CancellationToken.None);
            //this._hearbeat.Start();


            Console.WriteLine("Attained a websocket");
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


            Console.SetCursorPosition(10, 3);
            Console.WriteLine("=== Kinect Server Console... Press Escape to Quit");


            message = "Connected";
            Console.SetCursorPosition(0, 5);
            Console.Write("Kinect connection : {0} "); //todo: message about kinect connection

            message = "Connected";
            Console.SetCursorPosition(0, 6);
            Console.Write(
                "Connection To Websocket {0}: {1}",
                this._serverURI.ToString(),
                message); //todo: message about websocket connection


            if (this._headPos.Equals(new CameraSpacePoint()))
                message = "N/A, N/A, N/A";
            else
                message = string.Format("{0}, {1}, {2}", this._headPos.X, this._headPos.Y, this._headPos.Z);
            Console.SetCursorPosition(0, 8);
            Console.WriteLine("Head position: {0}", message);

            if (this._wristLeftPos.Equals(new CameraSpacePoint()))
                message = "N/A, N/A, N/A";
            else
                message = string.Format("{0}, {1}, {2}", this._wristLeftPos.X, this._wristLeftPos.Y, this._wristLeftPos.Z);
            Console.SetCursorPosition(0, 9);
            Console.WriteLine("Left Wrist position: {0}", message);


            if (this._wristRightPos.Equals(new CameraSpacePoint()))
                message = "N/A, N/A, N/A";
            else
                message = string.Format("{0}, {1}, {2}", this._wristRightPos.X, this._wristRightPos.Y, this._wristRightPos.Z);
            Console.SetCursorPosition(0, 10);
            Console.WriteLine("Right Wrist position: {0}", message);
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
            catch (AggregateException ae)
            {
                foreach (Exception ex in ae.InnerExceptions)
                {
                    Console.SetCursorPosition(0, 15);
                    Console.WriteLine("Restarted websocket connection at {0}", DateTime.Now.ToString("h:mm:ss tt"));
                    Console.WriteLine("The error was: {0}", ex.Message);

                    await _socket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                    this._heartbeat.Stop();
                    await ConnectToServer();

                }

            }



}

        private void UpdateDataRate(object source, ElapsedEventArgs e)
        {
            Console.SetCursorPosition(0, 12);
            Console.WriteLine("Data rate: {0} bytes/s", this._dataLength);

            this._dataLength = 0;
        }

        public Program()
        {
            InitKinectSensor();
            //InitWebSocket(new Uri("ws://127.0.0.1:3000/relay"));
            InitWebSocket(new Uri("ws://137.154.151.239:3000/relay"));
            ConnectToServer();
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
}
