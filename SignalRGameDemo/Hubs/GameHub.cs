using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace SignalRGameDemo.Hubs
{
    public class GameHub : Hub
    {
        public void Hello()
        {
            Clients.All.hello();
        }

        public void sendMsg(string content)
        {
            Clients.All.sendMsg(content);
        }

        public void Move(string guid, int dir ,int imgIndex, double x ,double y)
        {
            Clients.Others.NotificationMove(guid,dir, imgIndex, x,y);
        }

        public void Stop(int dir)
        {
            Clients.Others.NotificationStop(dir);
        }
    }
}