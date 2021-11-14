#!/usr/bin/env node

'use strict';
let webSocket = require ('./websocket.js')
let udp = require ('./udpclient.js')
let program = require('commander');
var pjson = require('./package.json');



program
  .version(pjson.version)
  .option('-p --udp_target_port <port number>', 'Mission Planner UDP Port', 14550)
  .option('-i --udp_target_ip <ip address>', 'Mission Planner IP - default is broadcast to all', '255.255.255.255')
  .parse(process.argv);

console.log ('Welcome to Andruav Web-Connector Telemetry version ' + pjson.version );
console.log('Mission Planner is at:' + program.udp_target_ip + ':' + program.udp_target_port);
udp.startServer ("0.0.0.0","0",program.udp_target_port, program.udp_target_ip);
webSocket.connect("127.0.0.1",8811);
console.log ('PLEASE USE DRONEKIT CONNECTION');

webSocket.onMessageReceived = function (message)
{
   // console.log ("from WS: " + message)

    udp.sendMessage (message);
};

udp.onMessageReceived = function (message)
{
    //console.log ("from UDP: ");

    webSocket.sendMessage (message);
};


console.log ('UDP <------> WebSocket Adapter');

