let colors = require('./colors.js');
const { SerialPort } = require('serialport')
var mavlink20 = require ('./mavlink').mavlink20;
var MAVLink20Processor = require ('./mavlink').MAVLink20Processor;


var Me = this;
exports.onMessageReceived = undefined;

exports.connect = function (port, baudrate, key)
{
    var port = new SerialPort({ path: port, baudRate: parseInt(baudrate) });
    Me.port = port;
    Me.key = parseInt(key);
    // Open errors will be emitted as an error event
    port.on('error', function(err) {
        console.log (colors.colors.Bright + colors.colors.FgRed +  'Error:' + err.message + colors.colors.Reset);

        exit(1);
    });

    port.on('data', function (message) {
        if (Me.onMessageReceived!= undefined)
           {
                for (var i =0 ; i< message.length; ++i)
                {
                    const ch = message[i];
                    if (ch<Me.key) 
                    {
                        message[i] = 256-Me.key+ch;
                    }
                    else
                    {
                        message[i] = (ch - Me.key) %255;
                    }
                    
                }
                let p_mavlinkGCSProcessor = new MAVLink20Processor(null, 0, 0);
                var m = p_mavlinkGCSProcessor.parseBuffer(message);
                // const len = m.length;
                // for (var j=0 ; j< len; ++j)
                // {   
                //     if (m[j].header!=undefined)
                //     {
                //     const v = m[j].pack(m[j].header.seq);
                //     Me.onMessageReceived (Buffer.alloc(v.length,v));
                //     }
                // }
                Me.onMessageReceived (message);
           }
      });
}


exports.sendMessage = function (message)
{
    if (Me.port == null) return ;
    Me.port.write(message, function(err) {
        if (err) {
          return console.log('Error on write: ', err.message);
        }
        //console.log('message written');
      });
}