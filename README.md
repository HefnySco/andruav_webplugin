# Andruav Web-Plugin
[![N|Solid](http://www.andruav.com/_static/andruav.png)](https://nodesource.com/products/nsolid)

Andruav is an interconnected Android-based system that allow both vehicle-to-vehicle and vehicle-to-GCS communication and control. 

Andruav & Drone-Engage are part of **Ardupilot Eco-System** now please see [[cloud.ardupilot.org](http://cloud.ardupilot.org "cloud.ardupilot.org")]

ONLY two mobile devices and Andruav are what you need to get Imaging & FPV Gears and Unlimited Telemetry Range over Wifi & 3G/4G. 

Now this plugin allows you to use only a single mobile on your drone, and use [Andruav-web]

###  Web-Plugin Function

It is a websocket-to-UDP tunnel, that allows you to connect Mission Planner, QGroundControl or similar apps, to your Drone via Andruav Web, without the need to use another mobile for GCS.

It simply creates a websocket between the website in browser, and broadcasts received telemetry using UDP, and receives commands from GCS applications via UDP and resends it via websocket to the website that forwards it to your drone using 3G/4G or Wifi.

### Installation

```sh
$ npm install andruavwebplugin -g 
```

### Run Plugin
```sh
 $ andruavplugin 
```
1- Run the application 
2- Open Andruav Web-Client.
3- Run Mission planner and connect using UDP connection to port 14450

you can run 
```sh
 $ andruavplugin -h
```
for more parmaterers.
you can use -p to change the UDP port that app sends packet to, default port is 14550.
you can use -i to change the UDP target ip. By default the app broadcast packets to all available IPs "255.255.255.255".
That means you can use multipl GCS to access your drone.

   [andruav.com]: <http://cloud.ardupilot.org>
   [Andruav-web]: <https://cloud.ardupilot.org:8001/webclient.html>