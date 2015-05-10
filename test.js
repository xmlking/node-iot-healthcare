import  PolarH7   from  './PolarH7'
import  BluetoothScanner   from  './src/BluetoothScanner'

var bleScan = new BluetoothScanner(PolarH7);

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
  yourThing.on(PolarH7.DATA, (heartRate) => {
    console.log('heartRate', heartRate);
  });

});
