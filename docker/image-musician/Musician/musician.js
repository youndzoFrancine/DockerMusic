/*
 *This program simulates someone who plays an instrument in an orchestra. 
 *When the app is started, it is assigned an instrument (piano, flute, etc.).
 * As long as it is running, every second it will emit a sound (well... simulate the emission of a sound: 
 * we are talking about a communication protocol). Of course, the sound depends on the instrument.
 */
/*
 * Include standard and third-party npm modules
 */
var PROTOCOL_PORT = 2205;
var PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";
var net = require('net');
var uuid = require('node-uuid'); //module pour generer le uuid

//we use a standard node.js module to work with udp
var dgram = require('dgram');

//create datagram socket we will use to send our datagram wich is music
var dgramSocket = dgram.createSocket('udp4');

//detect the sound according the instrument
var soundDetection = function(instrument) {
    var tmpSound = null;
    switch (instrument) {

        case "piano":
            tmpSound = "ti-ta-ti";
            break;
        case "trumpet":
            tmpSound = "pouet";
            break;
        case "flute":
            tmpSound = "trulu";
            break;
        case "violin":
            tmpSound = "gzi-gzi";
            break;
        case "drum":
            tmpSound = "boum-boum";
            break;
        default:
            console.log("not an instrument");
    }

    return tmpSound;
}

//definition of our javascript class for musician

function Musician(instrument) {

    this.uuid = uuid();
    this.instrument = instrument;
    this.sound = soundDetection(instrument);

    Musician.prototype.createMessage = function() {

        var play = { //objet
            uuid: this.uuid,
            sound: this.sound
        };

        var payload = JSON.stringify(play); //pour parser

        message = new Buffer(payload);

        dgramSocket.send(message, 0, message.length, PROTOCOL_PORT, PROTOCOL_MULTICAST_ADDRESS, function(err, byte) {
            console.log("Sending payload: " + payload + " via port " + dgramSocket.address().port);
        });
    };

    setInterval(this.createMessage.bind(this), 1000);

}

var instrument = process.argv[2];
var musician = new Musician(instrument);

console.log("uuid: " + musician.uuid + "; " + musician.instrument + "; " + musician.sound);