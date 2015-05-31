'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _noble = require('noble');

var _noble2 = _interopRequireDefault(_noble);

var _BluetoothDevice = require('./BluetoothDevice');

var _BluetoothDevice2 = _interopRequireDefault(_BluetoothDevice);

var BluetoothScanner = (function () {
  function BluetoothScanner() {
    _classCallCheck(this, BluetoothScanner);
  }

  _createClass(BluetoothScanner, null, [{
    key: 'discover',
    value: function discover(deviceClass) {
      return new Promise(function (resolve, reject) {

        console.info('Saning for : ', deviceClass.SCAN_UUIDS, deviceClass.SCAN_DUPLICATES);

        _noble2['default'].on('stateChange', function (state) {
          if (state === 'poweredOn') {
            _noble2['default'].startScanning(deviceClass.SCAN_UUIDS | [], this.SCAN_DUPLICATES);
          } else {
            _noble2['default'].stopScanning();
            reject('bluetooth off?');
          }
        });

        _noble2['default'].on('discover', function (peripheral) {
          resolve(new deviceClass(peripheral));
        });
      });
    }
  }, {
    key: 'discoverAll',
    value: function discoverAll(deviceClasses) {
      var devices = [];
      var SCAN_UUIDS = deviceClasses.map(function (devCls) {
        return devCls.SERVICE_UUID;
      });

      return new Promise(function (resolve, reject) {

        console.info('Saning for : ', SCAN_UUIDS);

        _noble2['default'].on('stateChange', function (state) {
          if (state === 'poweredOn') {
            _noble2['default'].startScanning(SCAN_UUIDS, false);
          } else {
            _noble2['default'].stopScanning();
            reject('bluetooth fff?');
          }
        });

        _noble2['default'].on('discover', function (peripheral) {
          var deviceClass = deviceClasses.find(function (devCls) {
            return devCls.is(peripheral);
          });
          devices.push(new deviceClass(peripheral));
          if (devices.length == deviceClasses.length) {
            _noble2['default'].stopScanning();
            resolve(devices);
          }
        });
      });
    }
  }]);

  return BluetoothScanner;
})();

exports['default'] = BluetoothScanner;
module.exports = exports['default'];