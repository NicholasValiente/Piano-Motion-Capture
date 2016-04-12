using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Threading;
//using System.Windows.Forms;
using Sanford.Multimedia;
using Sanford.Multimedia.Midi;

namespace Midi_input_test
{
    class Program
    {
      //  private const int SysExBufferSize = 128;

        private static InputDevice inDevice = null;

        private static SynchronizationContext context;


        private static void HandleChannelMessageReceived(object sender, ChannelMessageEventArgs e)
        {
            Console.WriteLine(
                 e.Message.Command.ToString() + '\t' + '\t' +
                 e.Message.MidiChannel.ToString() + '\t' +
                 e.Message.Data1.ToString() + '\t' +
                 e.Message.Data2.ToString());
        }



        private static void inDevice_Error(object sender, ErrorEventArgs e)
        {
          Console.WriteLine("Error!" + e.Error.Message);
        }


        private static  void run ()
        {
            if (InputDevice.DeviceCount == 0)
            {
                Console.WriteLine("Error! No MIDI input devices available.");
                //Close();
            }
            else
            {
                try
                {
                 
                    context = SynchronizationContext.Current;

                    inDevice = new InputDevice(0);
                    inDevice.ChannelMessageReceived += HandleChannelMessageReceived;
                    inDevice.Error += new EventHandler<ErrorEventArgs>(inDevice_Error);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error!" + ex.Message);
                    //   Close();
                }
            }

            // base.OnLoad(e);

            try
            {
                inDevice.StartRecording();
               
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error!" + ex.Message);
            }

            Thread.Sleep(5000);
            try
            {
                inDevice.StopRecording();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error!" + ex.Message);
            }
            
        }



        static void Main(string[] args)
        {

          run();
            Console.WriteLine("finished test, press any key");
            Console.ReadKey();
            Environment.Exit(0);
        }


    }
}
