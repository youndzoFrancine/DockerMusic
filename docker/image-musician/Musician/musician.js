
/*
*This program simulates someone who plays an instrument in an orchestra. 
*When the app is started, it is assigned an instrument (piano, flute, etc.).
* As long as it is running, every second it will emit a sound (well... simulate the emission of a sound: 
* we are talking about a communication protocol). Of course, the sound depends on the instrument.
*/
/*
 * Include standard and third-party npm modules
 */
var PORT = 2205;
var net = require('net');
var async = require("async");
var expect = require('chai').expect;
var uuid=require('node-uuid');//module pour generer le uuid

//we use a standard node.js module to work with udp
var dgram=require('dgram');

//create datagram socket we will use to send our datagram wich is music
var dgramSocket=dgram.createSocket('udp4');

//definition of our javascript class for musician


function Musician(instrument){
    
    this.uuid = uuid();
    this.instrument=instrument;
    Musician.prototype.soundDetection=function(){//fonction global de la classe musician
  
        switch(this.instrument){
            
            case "piano": this.sound='ti-ta-ti';
                break;
            case "trumpet" : this.sound="pouet";
                break;
            case "flute" : this.sound="trulu";
                break;
            case "violin": this.sound="gzi-gzi";
                break;
            case "drum":this.sound="boum-boum";
                break;
            default:console.log("not an instrument");
        }
        var play={ //objet
            sound : this.sound,
            uuid : this.uuid
        };
        
        var payload=JSON.stringify(play);//pour parser
        
        message=new Buffer(payload);
        dgramSocket.send(message,0,message.length,PORT,"239.255.22.5",function(err,byte){
            console.log("joue le song " +this.sound +"à travers le port" + dgramSocket.address().port);
        }
        );
  
        //setInterval(this.soundDetection.bind(this), 1000);

    } 
}
var instrument = process.argv[2];
var musician=new Musician(instrument);
 musician.soundDetection();
console.log("uuid" + musician.uuid + "  " +musician.instrument + " " + musician.sound);



