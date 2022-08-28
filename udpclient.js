"use strict";
var dgram = require('dgram');

var server = undefined;

var remoteSocket = undefined;
var Me = this;
var BroadcastPort = 14450;
var Target_IP;
exports.startServer = function (host,listenerPort,braodcastPort,target_ip)
{
    BroadcastPort = braodcastPort;
    Target_IP = target_ip;  
    //console.log('remote udp socket is at ' + target_ip + ':' + braodcastPort);
     _udp_server (host,listenerPort);
}

exports.onMessageReceived = undefined;


exports.sendMessage = function (message)
{
    _udp_client (message);
}


var _udp_server = function (host,port)
{
      
    server = dgram.createSocket('udp4');

    server.on('listening', function () {
            var address = host;
            console.log('UDP Listener Active');
     });

     server.on('message', function (message, remote) {
            /*try
            {
                var mavmsg = MAV.decode(message);
                if (mavmsg.name == 'HEARTBEAT')
                {
                    return
                }
            }
            catch (ex)
            {
                console.log ("error: %s",ex.message);
            }*/
            
            remoteSocket = remote;
                //console.log(remote.address + ':' + remote.port +' - ' + message);
            if (Me.onMessageReceived!= undefined)
            {
                Me.onMessageReceived (message);
            }
        });

    server.bind(port, host);
    // console.log ("UDP Listener at " + host + ":" + port);
}


var _udp_client = function (msg)
{
    server.setBroadcast(true);
    server.send(msg, 0, msg.length, BroadcastPort, Target_IP, function(err, bytes) {
        //if (err) throw err;
        //console.log('UDP message sent to ' + '0.0.0.0' +':'+ BroadcastPort);
        });
}




