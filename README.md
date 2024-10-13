# Open MCT / ROS 2 Telemetry Test (Open MCT)

This project should be used alongside the [ROS project](https://github.com/brandongasser/openmct-ros-test-ros)

## About this Project

### Server

The server is a minimal express server for hosting this project.

### index.html

This is the webpage for our project. Here, we install Open MCT plugins and start Open MCT.

### Robot Telemetry Plugin

This is a plugin that connects to the websocket server in the ROS project and displays the data in an Open MCT domain object called Robot.

### Open MCT Help

[Open MCT tutorial](https://github.com/nasa/openmct-tutorial)

[Open MCT API documentation](https://github.com/nasa/openmct/blob/master/API.md)

## Running this Project

Install dependencies

```
$ npm install
```

Run the project

```
$ npm start
```

Open your web browser and navigate to http://localhost:8001