using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization.Json;
using Microsoft.Kinect;
using System.IO;
using System.Text;
using System.Runtime.Serialization;

namespace Kinect.Server {
     public static class KinectHelper {
        public static Joint ScaleTo(this Joint joint, int width, int height, int depth, float skeletonMaxX, float skeletonMaxY, float skeletonMaxZ) {
            SkeletonPoint pos = new SkeletonPoint() {
                X = Scale(width, skeletonMaxX, joint.Position.X),
                Y = Scale(height, skeletonMaxY, -joint.Position.Y),
                Z = joint.Position.Z * depth
            };

            Joint j = new Joint() {  Position = pos };

            return j;
        }

        public static Joint ScaleTo(this Joint joint, int width, int height, int depth) {
            return ScaleTo(joint, width, height, depth, 1.0f, 1.0f, 1.0f);
        }

        private static float Scale(int maxPixel, float maxSkeleton, float position) {
            float value = maxPixel / maxSkeleton / 2 * position + maxPixel / 2;

            if (value > maxPixel)
                value = maxPixel;
            else if (value < 0)
                value = 0;

            return value;
        }
    }
}
