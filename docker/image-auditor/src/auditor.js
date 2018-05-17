/*
*simulates someone who listens to the orchestra.
*This application has two responsibilities.
* Firstly, it must listen to Musicians and keep track of active musicians.
*  A musician is active if it has played a sound during the last 5 seconds.
*   Secondly, it must make this information available to you.
*   Concretely, this means that it should implement a very simple TCP-based protocol.
*/



// We use a standard Node.js module to work with UDP
var dgram = require('dgram');


// Let's create a datagram socket. We will use it to listen for datagrams published in the
// multicast group by thermometers and containing measures
var s = dgram.createSocket('udp4');
s.bind(2205, function() {
  console.log("Joining multicast group");
});

// This call back is invoked when a new datagram has arrived.
s.on('message', function(msg, source) {
    console.log("Data has arrived: " + msg + ". Source port: " + source.port);
});

var net=require('net');
var server=net.createServer(function(socket){
    socket.write("echo server");
});
server.listen(2205, '127.0.0.1');
