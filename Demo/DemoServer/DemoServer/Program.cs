using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using Fleck;
using Newtonsoft.Json;

namespace DemoServer
{
    class Program
    {
        static List<IWebSocketConnection> Sockets;
        public class point
        {
             public int x , y, z;
        }
      
        static void Main(string[] args)
        {
           
            var p = new point() { x = 0, y = 0, z = 0 };
           

            //initialise connection
            
            var server = new WebSocketServer("ws://137.154.151.239:3000/relay");


            server.ListenerSocket.NoDelay = true;


            Console.WriteLine("Dummy server started\n");

            FleckLog.Level = LogLevel.Debug;
 

            try //currently erroring out here with invalid local endpoint
            {
                server.Start(socket =>
                {
                    
                    socket.OnOpen = () =>
                        {
                            Sockets.Add(socket);
                            Console.WriteLine("Connection Sucessful");
                        };


                    socket.OnClose = () =>
                        {
                            Sockets.Remove(socket);
                            Console.WriteLine("Connection Terminated");

                        };


                    socket.OnMessage = message =>
                        {
                            Console.WriteLine(message);

                        };
                      
                     

                });
            }
            catch (WebSocketException e)
            {
                Console.WriteLine("ERROR:/n" + e.ToString() );
            }

            //after connecting
           

            while (true) //later to be changed to while connected
            {
                for(int i=0; i<80; i++)
                {
                    if (i<20 || i>=60)   
                    { 
                        p.x++;
                        p.y++;
                        p.z++;
                    }
                    else if (i >= 20 && i<60)
                    {
                        p.x--;
                        p.y--;
                        p.z--;
                    }

                    String message = JsonConvert.SerializeObject(p);

                    Sockets.ToList().ForEach(s=> s.Send (message));
                } //end for loop


            } //end while loop


        } //end main
    }
}
