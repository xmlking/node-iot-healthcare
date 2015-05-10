var PolarH7 = require('./dist/PolarH7');
var com = require('serialport');

var serialport = new com.SerialPort('/dev/ttyAMA0',{
  baudrate:115200
});


serialport.on('open', function() {
  consol.log('port opened...');


  var h7 = new PolarH7();

  h7.on(PolarH7.DATA, function (heartRate)  {
    console.log('heartRate',heartRate);
    serialport.write(heartRate+'\n');
  });


});
