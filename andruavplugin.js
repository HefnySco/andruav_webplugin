#!/usr/bin/env node

'use strict';
  global.colors = require('./helpers/colors.js');
global.m_serverconfig   = require ('./js_serverConfig.js'); 

let udp_de_socket = require ('./udp_de_socket.js');
let program = require('commander');
var pjson = require('./package.json');
var udp_main;
program
  .version(pjson.version)
  .option('-c --config <path>', 'server.config')
  .option('-s --sysids <true>/<false>', true)
  .parse(process.argv);
  

var v_configFileName = global.m_serverconfig.getFileName();

if (program.config != null)
{
  v_configFileName = program.config;
}

global.m_serverconfig.init(v_configFileName);

udp_main = new udp_de_socket.udp_main (
  global.m_serverconfig.m_configuration);


// udp.startServer ("0.0.0.0","0",program.udp_target_port, program.udp_target_ip);
// if (serial_active === true)
// {
//   SendMessage = serialcomm.sendMessage;
//   serialcomm.connect(program.serial_port, program.serial_baud_rate, program.serial_enc_key);
// }
// else
// {
//   SendMessage = webSocket.sendMessage;
//   webSocket.connect("127.0.0.1",8811);
// }
// console.log (colors.colors.Bright + colors.colors.FgRed +  'PLEASE MAKE SURE TELEMETRY ON'  + colors.colors.Reset);
// console.log (colors.colors.Bright + "Check this video https://youtu.be/mUCbhzvmVcI for more info"  + colors.colors.Reset);

// webSocket.onMessageReceived = function (message)
// {
//    // console.log ("from WS: " + message)

//     udp.sendMessage (message);
// };

// serialcomm.onMessageReceived = function (message)
// {
//    // console.log ("from WS: " + message)

//     udp.sendMessage (message);
// };

// udp.onMessageReceived = function (message)
// {
//     //console.log ("from UDP: ");

//     SendMessage (message);
// };


console.log ('UDP <------> WebSocket Adapter');

