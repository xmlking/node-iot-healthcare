'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x,
    property = _x2,
    receiver = _x3; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var BluetoothDevice = (function (_events$EventEmitter) {
  function BluetoothDevice(peripheral) {
    _classCallCheck(this, BluetoothDevice);

    _get(Object.getPrototypeOf(BluetoothDevice.prototype), 'constructor', this).call(this);
    this._services = {};
    this._characteristics = {};
    this.connectedAndSetUp = false;
    _events2['default'].EventEmitter.call(this);

    this._peripheral = peripheral;
    this.uuid = peripheral.uuid;
    this._peripheral.on('disconnect', this.onDisconnect.bind(this));
  }

  _inherits(BluetoothDevice, _events$EventEmitter);

  _createClass(BluetoothDevice, [{
    key: 'is',

    //======
    value: function is(peripheral) {
      return true;
    }
  }, {
    key: 'onDisconnect',

    //=======

    value: function onDisconnect() {
      this.connectedAndSetUp = false;
      this.emit('disconnect');
    }
  }, {
    key: 'toString',
    value: function toString() {
      return JSON.stringify({
        uuid: this.uuid
      });
    }
  }, {
    key: 'connect',
    value: function connect(callback) {
      this._peripheral.connect(callback);
    }
  }, {
    key: 'disconnect',
    value: function disconnect(callback) {
      this._peripheral.disconnect(callback);
    }
  }, {
    key: 'discoverServicesAndCharacteristics',
    value: function discoverServicesAndCharacteristics(callback) {
      var _this2 = this;

      this._peripheral.discoverAllServicesAndCharacteristics(function (error, services, characteristics) {
        if (error) {
          return callback(error);
        }

        for (var i in services) {
          var service = services[i];
          var characteristics = service.characteristics;

          var serviceUuid = service.uuid;

          _this2._services[serviceUuid] = service;
          _this2._characteristics[serviceUuid] = {};

          for (var j in characteristics) {
            var characteristic = characteristics[j];

            _this2._characteristics[serviceUuid][characteristic.uuid] = characteristic;
          }
        }

        callback();
      });
    }
  }, {
    key: 'connectAndSetUp',
    value: function connectAndSetUp(callback) {
      var _this3 = this;

      this.connect(function (error) {
        if (error) {
          return callback(error);
        }

        _this3.discoverServicesAndCharacteristics(function () {
          _this3.connectedAndSetUp = true;
          callback();
        });
      });
    }
  }, {
    key: 'readDataCharacteristic',
    value: function readDataCharacteristic(serviceUuid, characteristicUuid, callback) {
      if (!this._characteristics[serviceUuid]) {
        return callback(new Error('service uuid ' + serviceUuid + ' not found!'));
      } else if (!this._characteristics[serviceUuid][characteristicUuid]) {
        return callback(new Error('characteristic uuid ' + characteristicUuid + ' not found in service uuid ' + serviceUuid + '!'));
      }

      this._characteristics[serviceUuid][characteristicUuid].read(callback);
    }
  }, {
    key: 'writeDataCharacteristic',
    value: function writeDataCharacteristic(serviceUuid, characteristicUuid, data, callback) {
      if (!this._characteristics[serviceUuid]) {
        return callback(new Error('service uuid ' + serviceUuid + ' not found!'));
      } else if (!this._characteristics[serviceUuid][characteristicUuid]) {
        return callback(new Error('characteristic uuid ' + characteristicUuid + ' not found in service uuid ' + serviceUuid + '!'));
      }

      var characteristic = this._characteristics[serviceUuid][characteristicUuid];

      var withoutResponse = characteristic.properties.indexOf('writeWithoutResponse') !== -1 && characteristic.properties.indexOf('write') === -1;

      characteristic.write(data, withoutResponse, function (error) {
        if (typeof callback === 'function') {
          callback(error);
        }
      });
    }
  }, {
    key: 'notifyCharacteristic',
    value: function notifyCharacteristic(serviceUuid, characteristicUuid, notify, listener, callback) {
      if (!this._characteristics[serviceUuid]) {
        return callback(new Error('service uuid ' + serviceUuid + ' not found!'));
      } else if (!this._characteristics[serviceUuid][characteristicUuid]) {
        return callback(new Error('characteristic uuid ' + characteristicUuid + ' not found in service uuid ' + serviceUuid + '!'));
      }

      var characteristic = this._characteristics[serviceUuid][characteristicUuid];

      characteristic.notify(notify, function (error) {
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
  }, {
    key: 'readStringCharacteristic',
    value: function readStringCharacteristic(serviceUuid, characteristicUuid, callback) {
      this.readDataCharacteristic(serviceUuid, characteristicUuid, function (error, data) {
        if (error) {
          return callback(error);
        }

        callback(null, data.toString());
      });
    }
  }, {
    key: 'readUInt8Characteristic',
    value: function readUInt8Characteristic(serviceUuid, characteristicUuid, callback) {
      this.readDataCharacteristic(serviceUuid, characteristicUuid, function (error, data) {
        if (error) {
          return callback(error);
        }

        callback(null, data.readUInt8(0));
      });
    }
  }, {
    key: 'readUInt16LECharacteristic',
    value: function readUInt16LECharacteristic(serviceUuid, characteristicUuid, callback) {
      this.readDataCharacteristic(serviceUuid, characteristicUuid, function (error, data) {
        if (error) {
          return callback(error);
        }

        callback(null, data.readUInt16LE(0));
      });
    }
  }, {
    key: 'readUInt32LECharacteristic',
    value: function readUInt32LECharacteristic(serviceUuid, characteristicUuid, callback) {
      this.readDataCharacteristic(serviceUuid, characteristicUuid, function (data) {
        if (error) {
          return callback(error);
        }

        callback(null, data.readUInt32LE(0));
      });
    }
  }, {
    key: 'readFloatLECharacteristic',
    value: function readFloatLECharacteristic(serviceUuid, characteristicUuid, callback) {
      this.readDataCharacteristic(serviceUuid, characteristicUuid, function (error, data) {
        if (error) {
          return callback(error);
        }

        callback(null, data.readFloatLE(0));
      });
    }
  }, {
    key: 'writeStringCharacteristic',
    value: function writeStringCharacteristic(serviceUuid, characteristicUuid, string, callback) {
      this.writeDataCharacteristic(serviceUuid, characteristicUuid, new Buffer(string), callback);
    }
  }, {
    key: 'writeUInt8Characteristic',
    value: function writeUInt8Characteristic(serviceUuid, characteristicUuid, value, callback) {
      var buffer = new Buffer(1);
      buffer.writeUInt8(value, 0);

      this.writeDataCharacteristic(serviceUuid, characteristicUuid, buffer, callback);
    }
  }, {
    key: 'writeUInt16LECharacteristic',
    value: function writeUInt16LECharacteristic(serviceUuid, characteristicUuid, value, callback) {
      var buffer = new Buffer(2);
      buffer.writeUInt16LE(value, 0);

      this.writeDataCharacteristic(serviceUuid, characteristicUuid, buffer, callback);
    }
  }, {
    key: 'writeUInt32LECharacteristic',
    value: function writeUInt32LECharacteristic(serviceUuid, characteristicUuid, value, callback) {
      var buffer = new Buffer(4);
      buffer.writeUInt32LE(value, 0);

      this.writeDataCharacteristic(serviceUuid, characteristicUuid, buffer, callback);
    }
  }, {
    key: 'writeFloatLECharacteristic',
    value: function writeFloatLECharacteristic(serviceUuid, characteristicUuid, value, callback) {
      var buffer = new Buffer(4);
      buffer.writeFloatLE(value, 0);

      this.writeDataCharacteristic(serviceUuid, characteristicUuid, buffer, callback);
    }
  }, {
    key: 'readDeviceName',
    value: function readDeviceName(callback) {
      this.readStringCharacteristic(BluetoothDevice.GENERIC_ACCESS_UUID, BluetoothDevice.DEVICE_NAME_UUID, callback);
    }
  }], [{
    key: 'GENERIC_ACCESS_UUID',
    value: '1800',
    enumerable: true
  }, {
    key: 'DEVICE_NAME_UUID',
    value: '2a00',
    enumerable: true
  }]);

  return BluetoothDevice;
})(_events2['default'].EventEmitter);

exports['default'] = BluetoothDevice;
module.exports = exports['default'];