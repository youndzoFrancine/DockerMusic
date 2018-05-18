/*
 *simulates someone who listens to the orchestra.
 *This application has two responsibilities.
 * Firstly, it must listen to Musicians and keep track of active musicians.
 *  A musician is active if it has played a sound during the last 5 seconds.
 *   Secondly, it must make this information available to you.
 *   Concretely, this means that it should implement a very simple TCP-based protocol.
 */

/*
 * We use a standard Node.js module to work with UDP
 */
var dgram = require('dgram');

const PROTOCOL_PORT_UDP = 9907;
const PROTOCOL_PORT_TCP = 2205;
const PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";
const PROTOCOL_TCP_ADDRESS = "0.0.0.0";

var musicians = new Map();
/*
 * Let's create a datagram socket. We will use it to listen for datagrams
 */
var s = dgram.createSocket('udp4');
s.bind(PROTOCOL_PORT_UDP, function() {
    console.log("Joining multicast group");
    s.addMembership(PROTOCOL_MULTICAST_ADDRESS);
});

/*
 * This call back is invoked when a new datagram has arrived.
 */
s.on('message', function(msg, source) {
    console.log("Data has arrived: " + msg + ". Source port: " + source.port);
    //update or add the instrument in instruments map

    var musician_req = JSON.parse(msg);

    if (!musicians.has(musician_req.uuid)) {
        var musician_feature = {
            "uuid": musician_req.uuid,
            "instrument": getInstrumentBySound(musician_req.sound),
            "activeSince": new Date().toISOString()
        };
        musicians.set(musician_req.uuid, musician_feature);
    } else {
        var tmp = musicians.get(musician_req.uuid);
        tmp.activeSince = new Date().toISOString();
        musicians.set(musician_req.uuid, tmp);
    }
});



var net = require('net');
var server = net.createServer(function(socket) {
    console.log("CONNECTED");
    musicians.forEach((value, key) => {
        if (Date.now() - Date.parse(value.activeSince) > 5000)
            musicians.delete(key);
    });

    //Create the musician tab to send
    var tabMusician = new Array();
    musicians.forEach((value) => {
        tabMusician.push(value);
    });

    var payload = JSON.stringify(tabMusician) + "\r\n";
    console.log("Sending TCP payload: " + payload);

    socket.write(payload);

    console.log("CLOSE CONNEXION");
    socket.destroy();

});
server.listen(PROTOCOL_PORT_TCP, PROTOCOL_TCP_ADDRESS);

//detect the instrument according the sound
var getInstrumentBySound = function(sound) {
    var instrument = null;
    switch (sound) {

        case "ti-ta-ti":
            instrument = "piano";
            break;
        case "pouet":
            instrument = "trumpet";
            break;
        case "trulu":
            instrument = "flute";
            break;
        case "gzi-gzi":
            instrument = "violin";
            break;
        case "boum-boum":
            instrument = "drum";
            break;
        default:
            console.log("not a valid sound");
    }

    return instrument;
}
