//UUID: c605db72a30e4bd9903282c5ad994fae  address: dd:89:22:d8:c1:cb

import  mixin from './src/mixin';
import BluetoothDevice  from './src/BluetoothDevice';
import BatteryService from './src/BatteryService';

//export default class PolarRUN extends mixin(BluetoothDevice,BatteryService) {
export default class PolarRUN extends BluetoothDevice {

  static NAME = 'Polar RUN 46E2EC17';
  static SPEED = 'speed';
  static CADENCE = 'cadence';
  static SERVICE_UUID = "1814";
  static NOTIFY_CHAR = "2a53";

  constructor(peripheral) {
    super(peripheral);
  }

  static is(peripheral) {
    return (peripheral.advertisement.localName === this.NAME);
  };

  connectAndSetUp(callback) {
    super.connectAndSetUp( () =>  {
      this.notifyCharacteristic(
        PolarRUN.SERVICE_UUID,
        PolarRUN.NOTIFY_CHAR, true,
        this._onDataRead.bind(this), (err) => { callback(err);});
    });
  }

  _onDataRead(data) {
    //console.log('raw',data);
    this.emit(PolarRUN.SPEED, data[1]);
    this.emit(PolarRUN.CADENCE, data[2]);
  }

}

PolarRUN.SCAN_UUIDS = [PolarRUN.SERVICE_UUID];
