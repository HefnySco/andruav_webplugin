#!/usr/bin/env node

'use strict';
let colors = require('./colors.js');
let webSocket = require ('./websocket.js')
let serialcomm = require ('./serialcomm.js')
let udp = require ('./udpclient.js')
let program = require('commander');
var pjson = require('./package.json');
var SendMessage = undefined;
let serial_active = false;

program
  .version(pjson.version)
  .option('-s --serial_port <path>', 'COM1, COM2, /dev/ttyUSB0')
  .option('-r --serial_baud_rate <baudrate>', '9600,...,57600,115200', 57600)
  .option('-k --serial_enc_key <key>', '1,2,3,string')
  .option('-p --udp_target_port <port number>', 'Mission Planner UDP Port', 14550)
  .option('-i --udp_target_ip <ip address>', 'Mission Planner IP - default is broadcast to all', '255.255.255.255')
  .parse(process.argv);
  

console.log (program.serial_port);
console.log (program.serial_baud_rate);
console.log (colors.colors.Bright + colors.colors.FgGreen +  'Welcome to ' +  colors.colors.FgYellow  + 'Andruav Web-Connector Telemetry' + colors.colors.FgGreen + ' version ' + colors.colors.FgYellow + pjson.version + colors.colors.Reset);
console.log(colors.colors.Bright + colors.colors.FgGreen +  'Mission Planner is at: ' + colors.colors.FgYellow + program.udp_target_ip + ':' + program.udp_target_port + colors.colors.Reset);

if (program.serial_port !=undefined )
{
  serial_active = true;
  console.log(colors.colors.Bright + colors.colors.FgGreen +  'Conecting to Serial port : ' + colors.colors.FgYellow + program.serial_port + colors.colors.Bright + colors.colors.FgGreen + ' baud rate:' + colors.colors.FgYellow + program.serial_baud_rate + colors.colors.Reset);
}


udp.startServer ("0.0.0.0","0",program.udp_target_port, program.udp_target_ip);
if (serial_active === true)
{
  SendMessage = serialcomm.sendMessage;
  serialcomm.connect(program.serial_port, program.serial_baud_rate, program.serial_enc_key);
}
else
{
  SendMessage = webSocket.sendMessage;
  webSocket.connect("127.0.0.1",8811);
}
console.log (colors.colors.Bright + colors.colors.FgRed +  'PLEASE MAKE SURE TELEMETRY ON'  + colors.colors.Reset);
console.log (colors.colors.Bright + "Check this video https://youtu.be/mUCbhzvmVcI for more info"  + colors.colors.Reset);

webSocket.onMessageReceived = function (message)
{
   // console.log ("from WS: " + message)

    udp.sendMessage (message);
};

serialcomm.onMessageReceived = function (message)
{
   // console.log ("from WS: " + message)

    udp.sendMessage (message);
};

udp.onMessageReceived = function (message)
{
    //console.log ("from UDP: ");

    SendMessage (message);
};


console.log ('UDP <------> WebSocket Adapter');

