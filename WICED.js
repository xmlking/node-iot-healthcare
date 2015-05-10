import  mixin from './src/mixin';
import BluetoothDevice  from './src/BluetoothDevice';
import BatteryService from './src/BatteryService';

//export default class WICED extends mixin(BluetoothDevice,BatteryService) {
export default class WICED extends BluetoothDevice {

  static NAME = 'Polar H7 25BAB8';
  static DATA = 'data';
  static SERVICE_UUID = "739298b687b64984a5dcbdc18b068985";
  static NOTIFY_CHAR  = "33ef91133b55413eb553fea1eaada459";

  constructor(peripheral) {
    super(peripheral);
  }

  static is(peripheral) {
    return (peripheral.advertisement.localName === this.NAME);
  };

  connectAndSetUp(callback) {
    super.connectAndSetUp( () =>  {
      this.notifyCharacteristic(
        WICED.SERVICE_UUID,
        WICED.NOTIFY_CHAR, true,
        this._onDataRead.bind(this), (err) => { callback(err);});
    });
  }

  _onDataRead(data) {
    console.log('data', data);
    this.emit(WICED.DATA,  this._parseData(data));
  }

  _parseData(data) {
    var bitMask = data[0],
      result = {}, pos = 1,
      x, y, z;

    if (bitMask & BIT_ACCELEROMETER) {
      x = data.readInt16LE(pos);
      pos += 2;
      y = data.readInt16LE(pos);
      pos += 2;
      z = data.readInt16LE(pos);
      pos += 2;

      result["accelerometer"] = {x: x, y: y, z: z};
    }

    if (bitMask & BIT_GYROSCOPE) {
      x = data.readInt16LE(pos);
      pos += 2;
      y = data.readInt16LE(pos);
      pos += 2;
      z = data.readInt16LE(pos);
      pos += 2;

      result["gyroscope"] = {x: x, y: y, z: z};
    }

    if (bitMask & BIT_HUMIDITY) {
      var humidity = data.readInt16LE(pos);
      pos += 2;

      result["humidity"] = humidity;
    }

    if (bitMask & BIT_MAGNETOMETER) {
      x = data.readInt16LE(pos);
      pos += 2;
      y = data.readInt16LE(pos);
      pos += 2;
      z = data.readInt16LE(pos);
      pos += 2;

      result["magnetometer"] = {x: x, y: y, z: z};
    }

    if (bitMask & BIT_PRESSURE) {
      var pressure = data.readInt16LE(pos);
      pos += 2;

      result["pressure"] = pressure;
    }

    if (bitMask & BIT_TEMPERATURE) {
      var temperature = data.readInt16LE(pos);
      pos += 2;

      result["temperature"] = temperature;
    }

    return result;
  }

}

WICED.SCAN_UUIDS = [WICED.SERVICE_UUID];
