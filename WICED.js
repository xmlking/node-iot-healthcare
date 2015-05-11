//UUID fb1f654b17794d2ca3db6499ca5354a7 address 00:10:18:01:02:25

import  mixin from './src/mixin';
import BluetoothDevice  from './src/BluetoothDevice';
import BatteryService from './src/BatteryService';

//export default class WICED extends mixin(BluetoothDevice,BatteryService) {
export default class WICED extends BluetoothDevice {

  static NAME = 'WICED Sense Kit';
  static DATA = 'data';
  static SERVICE_UUID = "739298b687b64984a5dcbdc18b068985";
  static NOTIFY_CHAR  = "33ef91133b55413eb553fea1eaada459";

  static BIT_ACCELEROMETER = 1;
  static BIT_GYROSCOPE = 2;
  static BIT_HUMIDITY = 4;
  static BIT_MAGNETOMETER = 8;
  static BIT_PRESSURE = 16;
  static BIT_TEMPERATURE = 32;

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

    if (bitMask & WICED.BIT_ACCELEROMETER) {
      x = data.readInt16LE(pos);
      pos += 2;
      y = data.readInt16LE(pos);
      pos += 2;
      z = data.readInt16LE(pos);
      pos += 2;

      result["accelerometer"] = {x: x, y: y, z: z};
    }

    if (bitMask & WICED.BIT_GYROSCOPE) {
      x = data.readInt16LE(pos);
      pos += 2;
      y = data.readInt16LE(pos);
      pos += 2;
      z = data.readInt16LE(pos);
      pos += 2;

      result["gyroscope"] = {x: x, y: y, z: z};
    }

    if (bitMask & WICED.BIT_HUMIDITY) {
      var humidity = data.readInt16LE(pos);
      pos += 2;

      result["humidity"] = humidity;
    }

    if (bitMask & WICED.BIT_MAGNETOMETER) {
      x = data.readInt16LE(pos);
      pos += 2;
      y = data.readInt16LE(pos);
      pos += 2;
      z = data.readInt16LE(pos);
      pos += 2;

      result["magnetometer"] = {x: x, y: y, z: z};
    }

    if (bitMask & WICED.BIT_PRESSURE) {
      var pressure = data.readInt16LE(pos);
      pos += 2;

      result["pressure"] = pressure;
    }

    if (bitMask & WICED.BIT_TEMPERATURE) {
      var temperature = data.readInt16LE(pos);
      pos += 2;

      result["temperature"] = temperature;
    }

    return result;
  }

}

WICED.SCAN_UUIDS = [WICED.SERVICE_UUID];
