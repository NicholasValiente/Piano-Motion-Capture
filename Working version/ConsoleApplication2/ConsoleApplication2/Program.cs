using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.WebSockets;
using Newtonsoft.Json;
using System.IO;
using System.Threading;

namespace ConsoleApplication2
{
    class Program
    {
        

        public class Point 
        {
           // string ID;

            public float x;
            public float y;
            public float z;
        };


        public class Frame
        {
            private List<Point> points;
            private int frameNumber;
            private float timestamp;

            public Frame(int number, float time)
            {
                frameNumber = number;
                timestamp = time;
                points = new List<Point>();
            }

            public void setPoint(float X, float Y, float Z)
            {
                points.Add( new Point() { x = X, y = Y, z = Z } );
            }

            public List<Point> getPoints()
            {
                return points;
            }

            public float getFrameNumber()
            { return frameNumber; }
            public float getTimeStamp() 
            { return timestamp; }

        }


        public class traceData
        {
            public List<Frame> frames;

            public traceData(string name)
            {
                //make a new list of frames
                frames = new List<Frame>();

                //open file specified
                StreamReader SR = new StreamReader(name);
                //and copy all of it to a string
                String raw =SR.ReadToEnd();
                //convert json string into useable json array
                dynamic data = JsonConvert.DeserializeObject(raw);
                //close file
                SR.Close(); 


                //for every frame in the json file:
                foreach (var samples in data.samples)
                {

                    var f = new List<dynamic>();

                    //get frame number
                    string temp = samples.frame;
                    int fn = Int32.Parse(temp);

                    //get frame timestamp
                    temp = samples.time;
                    float time = float.Parse(temp);
                 
                    //make new Frame element using timestamp and frame number and add to array of frames
                    frames.Add(new Frame(fn, time));

                    //add to temporary list the JSON serialised set of points
                     f.Add(samples.samples);      
                    //for every set of points:
                     f.ForEach(delegate(dynamic d)
                     {
                         int i = 0;

                         //list to hold the points seperated into a list of floats
                         List<float> t = new List<float>();

                         //de-serialise the JSON set of points into the list
                         t= d.ToObject<List<float>>() ;

                         //co-ordinate arrays to hold points as they are seperated
                         List<float> X, Y, Z;
                         X = new List<float>();
                         Y = new List<float>();
                         Z = new List<float>();

                         //seperate array of points into X,Y and Z co-ordinate arrays
                         t.ForEach(delegate(float s)
                        {
                            if (i%3==0)
                            {
                                X.Add( s );
                            }
                            else if (i%3==1)
                            {
                                Y.Add( s );
                            }
                            else if (i % 3 == 2)
                            {
                                Z.Add(s);
                            }

                            i++;
                        }      );


                      //itterate through X,Y and Z arrays and set each point in a frame 
                         for (int k = 0; k < X.Count(); k++)
                         {
                             frames.Last().setPoint(    X.ElementAt(k),
                                                        Y.ElementAt(k),
                                                        Z.ElementAt(k)
                                                    );
                             
                         }

                        
                     }  );
                     
                }
       
               
                
            }

            public void playback()
            {
                int delay = 0;
                int t = 0;
                int i = 0;
                foreach (Frame F in frames)
                {
                    delay = (int)(F.getTimeStamp() * 1000) ;
                    delay -= t;
                    if(i>0)
                    {
                        t = (int)(F.getTimeStamp() * 1000);
                    }
              
                    Thread.Sleep(delay);

                    //!!!!!!!!!!!!!!!!!!!!
                    //later need to change the  console.write to send over 
                    Console.WriteLine(JsonConvert.SerializeObject( F.getPoints() ) );
                    
                    i++;
                }
            }

            //for testing purposes only
            public void printLastFrame()
            {
                Console.WriteLine("Frame:" + frames.Last().getFrameNumber() + 
                                  " Timestamp:" + frames.Last().getTimeStamp() );
                Console.WriteLine(frames.Last().getPoints());
            }
            //for testing purposes only
            public void printFirstFrame()
            {
                Console.WriteLine("Frame:" + frames.First().getFrameNumber() +
                                  " Timestamp:" + frames.First().getTimeStamp());
                Console.WriteLine(frames.First().getPoints());
            }

        }


        static void Main(string[] args)
        {
            traceData T;

            Console.WriteLine("Enter path to file to open");

           // string path = Console.ReadLine();
            string path = "C:/test.json";

            T= new traceData(path);

              T.playback();



         


            Console.Write("Press Any Key to exit...");
          
            Console.ReadKey();
             

            
        }
    }
}
