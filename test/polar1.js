import  PolarH7   from  '../PolarH7'
import  BluetoothScanner   from  '../src/BluetoothScanner'
import  mqtt from 'mqtt';

var client  = mqtt.connect({ host: 'localhost', port: 1883 });


client.on('connect',  () => {

  BluetoothScanner.discover(PolarH7).then((myThing) => {
    // you can be notified of disconnects
    myThing.on('disconnect', function () {
      console.log('we got disconnected! :( ');
    });

    // you'll need to call connect and set up
    myThing.connectAndSetUp(function (error) {
      console.log('were connected!');
    });

    // receive data
    myThing.on(PolarH7.DATA, (heartRate) => {
      console.log('heartRate', heartRate);
      client.publish('hrm', "" + heartRate);
    });

  });

});




