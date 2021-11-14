#!/usr/bin/env node

'use strict';
let colors = require('./colors.js');
let webSocket = require ('./websocket.js')
let udp = require ('./udpclient.js')
let program = require('commander');
var pjson = require('./package.json');



program
  .version(pjson.version)
  .option('-p --udp_target_port <port number>', 'Mission Planner UDP Port', 14550)
  .option('-i --udp_target_ip <ip address>', 'Mission Planner IP - default is broadcast to all', '255.255.255.255')
  .parse(process.argv);
  
console.log (colors.colors.Bright + colors.colors.FgGreen +  'Welcome to ' +  colors.colors.FgYellow  + 'Andruav Web-Connector Telemetry' + colors.colors.FgGreen + ' version ' + colors.colors.FgYellow + pjson.version + colors.colors.Reset);
console.log(colors.colors.Bright + colors.colors.FgGreen +  'Mission Planner is at: ' + colors.colors.FgYellow + program.udp_target_ip + ':' + program.udp_target_port + colors.colors.Reset);
udp.startServer ("0.0.0.0","0",program.udp_target_port, program.udp_target_ip);
webSocket.connect("127.0.0.1",8811);
console.log (colors.colors.Bright + colors.colors.FgRed +  'PLEASE MAKE SURE TELEMETRY ON'  + colors.colors.Reset);
console.log (colors.colors.Bright + "Check this video https://youtu.be/mUCbhzvmVcI for more info"  + colors.colors.Reset);

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

