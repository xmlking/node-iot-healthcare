import events  from 'events';

export default class BluetoothDevice extends events.EventEmitter {

  static GENERIC_ACCESS_UUID  = '1800';
  static DEVICE_NAME_UUID     = '2a00';
  static SCAN_UUIDS : Array<String>;
  static SCAN_DUPLICATES : Boolean = false;

  _services = {};
  _characteristics = {};
  connectedAndSetUp = false;

  constructor(peripheral) {
    super();
    events.EventEmitter.call(this);

    this._peripheral = peripheral;
    this.uuid = peripheral.uuid;
    this._peripheral.on('disconnect', this.onDisconnect.bind(this));
  }

  //======
  is(peripheral) {
    return true;
  }

  //=======

  onDisconnect() {
    this.connectedAndSetUp = false;
    this.emit('disconnect');
  }

  toString() {
    return JSON.stringify({
      uuid: this.uuid
    });
  }

  connect(callback) {
    this._peripheral.connect(callback);
  }

  disconnect(callback) {
    this._peripheral.disconnect(callback);
  }

  discoverServicesAndCharacteristics(callback) {
    this._peripheral.discoverAllServicesAndCharacteristics( (error, services, characteristics) => {
      if (error) {
        return callback(error);
      }

      for (var i in services) {
        var service = services[i];
        var characteristics = service.characteristics;

        var serviceUuid = service.uuid;

        this._services[serviceUuid] = service;
        this._characteristics[serviceUuid] = {};

        for (var j in characteristics) {
          var characteristic = characteristics[j];

          this._characteristics[serviceUuid][characteristic.uuid] = characteristic;
        }
      }

      callback();
    });
  }

  connectAndSetUp(callback) {
    this.connect((error) => {
      if (error) {
        return callback(error);
      }

      this.discoverServicesAndCharacteristics( () => {
        this.connectedAndSetUp = true;
        callback();
      });

    });
  }

  readDataCharacteristic(serviceUuid, characteristicUuid, callback) {
    if (!this._characteristics[serviceUuid]) {
      return callback(new Error('service uuid ' + serviceUuid + ' not found!'));
    } else if (!this._characteristics[serviceUuid][characteristicUuid]) {
      return callback(new Error('characteristic uuid ' + characteristicUuid + ' not found in service uuid ' + serviceUuid + '!'));
    }

    this._characteristics[serviceUuid][characteristicUuid].read(callback);
  }

  writeDataCharacteristic(serviceUuid, characteristicUuid, data, callback) {
    if (!this._characteristics[serviceUuid]) {
      return callback(new Error('service uuid ' + serviceUuid + ' not found!'));
    } else if (!this._characteristics[serviceUuid][characteristicUuid]) {
      return callback(new Error('characteristic uuid ' + characteristicUuid + ' not found in service uuid ' + serviceUuid + '!'));
    }

    var characteristic = this._characteristics[serviceUuid][characteristicUuid];

    var withoutResponse = (characteristic.properties.indexOf('writeWithoutResponse') !== -1) &&
      (characteristic.properties.indexOf('write') === -1);

    characteristic.write(data, withoutResponse, function(error) {
      if (typeof callback === 'function') {
        callback(error);
      }
    });
  }

  notifyCharacteristic(serviceUuid, characteristicUuid, notify, listener, callback) {
    if (!this._characteristics[serviceUuid]) {
      return callback(new Error('service uuid ' + serviceUuid + ' not found!'));
    } else if (!this._characteristics[serviceUuid][characteristicUuid]) {
      return callback(new Error('characteristic uuid ' + characteristicUuid + ' not found in service uuid ' + serviceUuid + '!'));
    }

    var characteristic = this._characteristics[serviceUuid][characteristicUuid];

    characteristic.notify(notify, function(error) {
      if (notify) {
        characteristic.addListener('read', listener);
      } else {
        characteristic.removeListener('read', listener);
      }

      if (typeof callback === 'function') {
        callback(error);
      }
    });
  }

  readStringCharacteristic(serviceUuid, characteristicUuid, callback) {
    this.readDataCharacteristic(serviceUuid, characteristicUuid, function(error, data) {
      if (error) {
        return callback(error);
      }

      callback(null, data.toString());
    });
  }

  readUInt8Characteristic(serviceUuid, characteristicUuid, callback) {
    this.readDataCharacteristic(serviceUuid, characteristicUuid, function(error, data) {
      if (error) {
        return callback(error);
      }

      callback(null, data.readUInt8(0));
    });
  }

  readUInt16LECharacteristic(serviceUuid, characteristicUuid, callback) {
    this.readDataCharacteristic(serviceUuid, characteristicUuid, function(error, data) {
      if (error) {
        return callback(error);
      }

      callback(null, data.readUInt16LE(0));
    });
  }

  readUInt32LECharacteristic(serviceUuid, characteristicUuid, callback) {
    this.readDataCharacteristic(serviceUuid, characteristicUuid, function(data) {
      if (error) {
        return callback(error);
      }

      callback(null, data.readUInt32LE(0));
    });
  }

  readFloatLECharacteristic(serviceUuid, characteristicUuid, callback) {
    this.readDataCharacteristic(serviceUuid, characteristicUuid, function(error, data) {
      if (error) {
        return callback(error);
      }

      callback(null, data.readFloatLE(0));
    });
  }

  writeStringCharacteristic(serviceUuid, characteristicUuid, string, callback) {
    this.writeDataCharacteristic(serviceUuid, characteristicUuid, new Buffer(string), callback);
  }

  writeUInt8Characteristic(serviceUuid, characteristicUuid, value, callback) {
    var buffer = new Buffer(1);
    buffer.writeUInt8(value, 0);

    this.writeDataCharacteristic(serviceUuid, characteristicUuid, buffer, callback);
  }

  writeUInt16LECharacteristic(serviceUuid, characteristicUuid, value, callback) {
    var buffer = new Buffer(2);
    buffer.writeUInt16LE(value, 0);

    this.writeDataCharacteristic(serviceUuid, characteristicUuid, buffer, callback);
  }

  writeUInt32LECharacteristic(serviceUuid, characteristicUuid, value, callback) {
    var buffer = new Buffer(4);
    buffer.writeUInt32LE(value, 0);

    this.writeDataCharacteristic(serviceUuid, characteristicUuid, buffer, callback);
  }

  writeFloatLECharacteristic(serviceUuid, characteristicUuid, value, callback) {
    var buffer = new Buffer(4);
    buffer.writeFloatLE(value, 0);

    this.writeDataCharacteristic(serviceUuid, characteristicUuid, buffer, callback);
  }

  readDeviceName(callback) {
    this.readStringCharacteristic(BluetoothDevice.GENERIC_ACCESS_UUID, BluetoothDevice.DEVICE_NAME_UUID, callback);
  }

}
