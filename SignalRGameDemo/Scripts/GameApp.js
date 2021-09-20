$(function () {
    var playerElement = $("#player");
    var player = {
        guid: playerElement.attr("playerid"),
        x :25,
        y: 25,
        directionCode : 2,
        directionNumber: 1,//-1 / 1
        verticalSpeed: 1,
        horizontalSpeed: 2,

        userStyle : {
            imgIndex: 0,
            width: parseInt(128 / 4),
            height: parseInt(193 / 4),
        },

        isIdle: true,

        moveAnimation: setInterval(() => {
            if (!player.isIdle) {
                player.userStyle.imgIndex = (player.userStyle.imgIndex + 1) % 4;
                playerElement.css("background-position-x", -player.userStyle.imgIndex * player.userStyle.width + "px");
                //console.log("move animation", player.userStyle.imgIndex);
            }
        },200),
    };
    
    var chat = $.connection.gameHub;

    //receive command
    
    chat.client.notificationMove = function (guid, dir, imgIndex, x, y) {
        
        var receivedPlayer = $("div[playerid=" + guid+"]" );
        if (receivedPlayer.length == 0) {

            receivedPlayer = playerElement.clone();
            receivedPlayer.removeAttr('id');
            receivedPlayer.attr("playerid", guid);
            $("body").append(receivedPlayer);
        }

        //player.x = x;
        //player.y = y;
        //player.directionCode = dir;
        console.log("notification");
        //console.log(x,y);
        receivedPlayer.css("left",x);
        receivedPlayer.css("top",y);
        receivedPlayer.css("background-position-x", -imgIndex * player.userStyle.width + "px");
        receivedPlayer.css("background-position-y", -dir * player.userStyle.height + "px");
    };

    chat.client.stop = function (dir) {
        console.log("stop");
        playerElement.css("background-position-y", -dir * player.userStyle.height + "px");
    };

    $.connection.hub.start().done(() => {
        console.log("SignalR Connected");
        //player.guid = playerElement.attr("playerid");

        //init player
        playerElement.css({
            backgroundImage: "url(../resources/images/player/player_move.png)",
            width: player.userStyle.width+"px",
            height: player.userStyle.height + "px",
        });

        playerElement.css("left",player.x+ "px");
        playerElement.css("top",player.y+ "px");

        setInterval(() => {
            if (!player.isIdle) {
                console.log(player.directionNumber);
                //notification move
                if (player.directionCode == 1 || player.directionCode == 2) {

                    player.x += player.directionNumber * player.horizontalSpeed;
                    playerElement.css("left", player.x + "px");

                } else {

                    player.y += player.directionNumber * player.verticalSpeed;
                    playerElement.css("top", player.y + "px");
                    

                }
                
                chat.server.move(player.guid, player.directionCode,player.userStyle.imgIndex,player.x,player.y);
            }

        },10);
        

    }).fail(() => {
        console.log("SignalR Disconnect");
    });

    

    //Listen keyboard event
    //keydown 
    $(document).keydown((e) => {
        if (e.key == 'a') {
            player.directionCode = 1;
            player.directionNumber = -1;
            player.isIdle = false;
        } else if (e.key == 'w') {
            player.directionNumber = -1;
            player.directionCode = 3;
            player.isIdle = false;
        } else if (e.key == 'd') {
            player.directionNumber = 1;
            player.directionCode = 2;
            player.isIdle = false;
        } else if (e.key == 's') {
            player.directionNumber = 1;
            player.directionCode = 0;
            player.isIdle = false;
        }
        
        playerElement.css("background-position-y", -player.directionCode * player.userStyle.height + "px");
    });
    //key up
    $(document).keyup((e) => {
        if (e.key == 'a' || e.key == 'w' || e.key == 'd' || e.key == 's') {
            player.isIdle = true;
            player.userStyle.imgIndex = 0;
            playerElement.css("background-position-x", -player.userStyle.imgIndex * player.userStyle.width + "px");
            playerElement.css("background-position-x", -player.userStyle.imgIndex * player.userStyle.width + "px");

            //stop
            chat.server.stop(player.directionCode);
        }

    });

});

