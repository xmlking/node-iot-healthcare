var PolarH7 = require('../PolarH7');
import  BluetoothScanner   from  '../src/BluetoothScanner'
var com = require('serialport');

var serialport = new com.SerialPort('/dev/ttyAMA0',{
  baudrate:115200
});


serialport.on('open', function() {
  consol.log('port opened...');

  var bleScan = new BluetoothScanner(PolarH7);

  bleScan.discover().then((yourThing) => {

    yourThing.on('disconnect', function () {
      console.log('we got disconnected! :( ');
    });

    yourThing.connectAndSetUp(function (error) {
      console.log('were connected!');
    });

    yourThing.on(PolarH7.DATA, (heartRate) => {
      console.log('heartRate', heartRate);
      serialport.write(heartRate+'\n');
    });

  });


});
