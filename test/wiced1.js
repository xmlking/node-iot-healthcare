import  WICED   from  '../WICED'
import  BluetoothScanner   from  '../src/BluetoothScanner'

BluetoothScanner.discover(WICED).then( (myThing) => {
  // you can be notified of disconnects
  myThing.on('disconnect', function () {
    console.log('we got disconnected! :( ');
  });

  // you'll need to call connect and set up
  myThing.connectAndSetUp(function (error) {
    console.log('were connected!');
  });

  // receive data
  myThing.on(WICED.DATA, (data) => {
    console.log('data', data);
  });

});
