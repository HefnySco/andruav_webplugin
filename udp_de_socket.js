"use strict";

let colors = require('./helpers/colors.js');
const { SerialPort } = require('serialport')
var mavlink20 = require ('./mavlink').mavlink20;
var MAVLink20Processor = require ('./mavlink').MAVLink20Processor;


class udp_de_socket {
 
    constructor(target_host,target_port,func, parent)
    {
        this._isReady = false;
        this.parent = parent;
        this._dgram = require('dgram');
        this._ready_counter=0;
        this._caller_port = null;
        this._caller_ip   = null;
        this._server = null;
        this._host   = "0.0.0.0";
        this._port   = 0;
        this._target_host   = target_host;
        this._target_port   = target_port;
        this._onMessageReceived = func;
        this._last_access_time = 0;
        this._server = this._dgram.createSocket('udp4');

        this._server.on('listening', function () {
            Me._port = this.address().port;
            Me._host = this.address().address;
            Me._isReady = true;
            Me.parent._onReady(Me.parent, Me._isReady);
            console.log('UDP Listener Active ' + Me._host + ':' + Me._port );
        });
        var Me = this;
        this._server.on('message', function (message, remote) {
                let p_mavlinkGCSProcessor = new MAVLink20Processor(null, 0, 0);
                var m = p_mavlinkGCSProcessor.parseBuffer(message);
                parent.sendMessage (message);
            });

        this._server.on('error', function (err)
        {
           console.log ("socket error:" + err);
        });
       
        try
        {
           this._server.bind(port, host);
        }
        catch 
        {
           this._isReady = false;
           this.parent._onReady(this.parent, this._isReady);
        }
        
    }

    close ()
    {
        try
        {
           this._isReady = false;
           this._server.close();
        }
        catch
        {
            
        }
    }

    isReady ()
    {
       return this._isReady;
    }

    getLastAccessTime()
    {
        return this._last_access_time;
    }

    setOnReceive (func)
    {
        _onMessageReceived = func;
    }
    
    sendMessage (message)
    {
        //if ((this._caller_port == null) || (this._server==null)) return ;
        this._server.send(message, 0, message.length, this._target_port, this._target_host); 
    }

    getConfig()
    {
       /*
           Note that socket may be listening to an ip that is not the public IP.
           so you need to return the public IP "public_host".
           The only exception is that host is listening to a particular ip given by this._host
           in this case chat parties can see tihis ip as it is specified by them.
       */
       var host = global.m_serverconfig.m_configuration.public_host;

       if (this._host != "0.0.0.0")
       {
           host = this._host;
       }
        var config = {
            'address':host,
            'port': this._port
        };

        return config;
    }
    
}

class udp_main {
    constructor (config_obj)
    {
        this._host = config_obj.host;
        this._port = config_obj.port;
        this._client_sockets = {};
        
        config_obj.client_sockets.forEach(element => {
            config_obj.client_sockets;
            element.socket = new udp_de_socket(element.target_host,element.target_port, this.udp2_onreceive, this);
            this._client_sockets[element.sys_id] = element;
        });

        this._dgram = require('dgram');
        this.createMainSocket();
    }

    createMainSocket()
    {
        this._server = this._dgram.createSocket('udp4');

        this._server.on('listening', function () {
            console.log('UDP Listener Active ' + this._host + ' at port ' + this._port);
        }); 

        var Me = this;
        this._server.on('message', function (message, remote) {
            Me._last_access_time = Date.now();
            Me._caller_ip   = remote.address;
            Me._caller_port = remote.port;
            
                let p_mavlinkGCSProcessor = new MAVLink20Processor(null, 0, 0);
                var m = p_mavlinkGCSProcessor.parseBuffer(message);
                let messages_num = m.length;
                
                for (var i=0; i<messages_num; ++i)
                {
                    const msg = m[i];
                    if (msg.id == -1) continue;
                    const sys_id = msg.header.srcSystem;
                    const vehicle =  Me._client_sockets[sys_id];
                    if (vehicle == null) continue;
                    vehicle.socket.sendMessage(message);
                    //console.log ("I want this " + msg.header.srcSystem);
                }
                
                // const len = m.length;
                // for (var j=0 ; j< len; ++j)
                // {   
                //     if (m[j].hmeader!=undefined)
                //     {
                //     const v = m[j].pack(m[j].header.seq);
                //     Me.onMessageReceived (Buffer.alloc(v.length,v));
                //     }
                // }
            
        });

        this._server.on('error', function (err)
        {
           console.log ("socket error:" + err);
        });

        try
        {
           this._server.bind(this._port, this._host);
        }
        catch 
        {
           
        }
    }

    

    udp2_onreceive (message, Me)
    {
         Me._udp_socket2.sendMessage(message); 
    }

    sendMessage (message)
    {
        //if ((this._caller_port == null) || (this._server==null)) return ;
        let p_mavlinkGCSProcessor = new MAVLink20Processor(null, 0, 0);
        var m = p_mavlinkGCSProcessor.parseBuffer(message);
        this._server.send(message, 0, message.length, this._caller_port, this._caller_ip); 
    }

    _onReady(Me, status)
    {
        Me._ready_counter +=1;
        if (Me._ready_counter==2)
        {
            this._callback();
        }
    }

}

module.exports = 
 {
    udp_main
 }
 