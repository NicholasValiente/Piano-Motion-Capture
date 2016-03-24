using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization.Json;
using Microsoft.Kinect;
using System.IO;
using System.Text;
using System.Runtime.Serialization;

namespace Kinect.Server // Serializes a Kinect skeleton
{
    public static class SkeletonSerializer {
        public static string getJoints(this Skeleton skeletons, bool[] joints, int xScale, int yScale, int zScale)  //new sting creator (version 3)
        {
            var i = 0;
            var jointString = "";
            foreach (Joint joint in skeletons.Joints) {

                    if ( joints[i] ) {  // this joint is enabled
                        //Console.Write("\n" + joint.JointType + "\n");
                        // var Joint scaled;

                        Joint scaledJoint = joint.ScaleTo( xScale, yScale, zScale );

                        var jointX = (int) scaledJoint.Position.X;
                        var jointY = (int) scaledJoint.Position.Y;
                        var jointZ = (int) scaledJoint.Position.Z;

                        jointString += jointX + "," + jointY + "," + jointZ + ",";
                    }
                    i++;                
            }
            if (jointString.Length > 1) // <1 happens when no joints turned on
            {
                jointString = jointString.Remove(jointString.Length - 1); // trim last ","
            }
            return jointString;
        }
    }
}
