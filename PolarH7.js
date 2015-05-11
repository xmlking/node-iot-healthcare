//UUID ca67a8c081c04ce1a250d0b52f9da357 address: 00:22:d0:25:ba:b8

import  mixin from './src/mixin';
import BluetoothDevice  from './src/BluetoothDevice';
import BatteryService from './src/BatteryService';

//export default class PolarH7 extends mixin(BluetoothDevice,BatteryService) {
export default class PolarH7 extends BluetoothDevice {

  static NAME = 'Polar H7 25BAB8';
  static DATA = 'heartRate';
  static SERVICE_UUID = "180d";
  static NOTIFY_CHAR  = "2a37";

  constructor(peripheral) {
    super(peripheral);
  }

  static is(peripheral) {
    return (peripheral.advertisement.localName === this.NAME);
  };

  connectAndSetUp(callback) {
    super.connectAndSetUp( () =>  {
      this.notifyCharacteristic(
        PolarH7.SERVICE_UUID,
        PolarH7.NOTIFY_CHAR, true,
        this._onDataRead.bind(this), (err) => { callback(err);});
    });
  }

  _onDataRead(data) {
    if((data[0] & 0x01) === 0) {
      var heartRate = data[1];
      if(heartRate) {
        this.emit(PolarH7.DATA, heartRate);
      }
    }
  }

}

PolarH7.SCAN_UUIDS = [PolarH7.SERVICE_UUID];
