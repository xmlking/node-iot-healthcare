import  PolarH7   from  '../PolarH7'
import  PolarRUN   from  '../PolarRUN'
import  BluetoothScanner   from  '../src/BluetoothScanner'

BluetoothScanner.discoverAll([PolarH7,PolarRUN])
  .then( (things) => {

    var h7 = things.find(thing => thing instanceof PolarH7);
    var run = things.find(thing => thing instanceof PolarRUN);

    h7.on('disconnect', function () {
      console.log('[PolarH7] got disconnected! :( ');
    });

    h7.connectAndSetUp(function (error) {
      console.log('[PolarH7] connected!');
    });

    h7.on(PolarH7.DATA, (heartRate) => {
      console.log('[PolarH7] heartRate', heartRate);
    });

    run.on('disconnect', function () {
      console.log('[PolarRUN] got disconnected! :( ');
    });

    run.connectAndSetUp(function (error) {
      console.log('[PolarRUN] connected!');
    });

    run.on(PolarRUN.SPEED, (speed) => {
      console.log('[PolarRUN] SPEED', speed);
    });

    run.on(PolarRUN.CADENCE, (cadence) => {
      console.log('[PolarRUN] CADENCE', cadence);
    });

  })
  .catch((err) => {
    console.log(err);
  });
