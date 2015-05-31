import  PolarRUN   from  '../PolarRUN'
import  BluetoothScanner   from  '../src/BluetoothScanner'

BluetoothScanner.discover(PolarRUN).then( (myThing) => {
  // you can be notified of disconnects
  myThing.on('disconnect', function () {
    console.log('we got disconnected! :( ');
  });

  // you'll need to call connect and set up
  myThing.connectAndSetUp(function (error) {
    console.log('were connected!');
  });

  // receive data
  myThing.on(PolarRUN.SPEED, (speed) => {
    console.log('SPEED', speed);
  });

  myThing.on(PolarRUN.CADENCE, (cadence) => {
    console.log('CADENCE', cadence);
  });

});
