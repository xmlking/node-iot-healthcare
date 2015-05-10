import  PolarRUN   from  './PolarRUN'
import  BluetoothScanner   from  './src/BluetoothScanner'

var bleScan = new BluetoothScanner(PolarRUN);

bleScan.discover().then( (yourThing) => {
  // you can be notified of disconnects
  yourThing.on('disconnect', function () {
    console.log('we got disconnected! :( ');
  });

  // you'll need to call connect and set up
  yourThing.connectAndSetUp(function (error) {
    console.log('were connected!');
  });

  // receive data
  yourThing.on(PolarRUN.SPEED, (speed) => {
    console.log('SPEED', speed);
  });

  yourThing.on(PolarRUN.CADENCE, (cadence) => {
    console.log('CADENCE', cadence);
  });

});
