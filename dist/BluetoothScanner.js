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

var _noble = require('noble');

var _noble2 = _interopRequireDefault(_noble);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var BluetoothScanner = (function (_events$EventEmitter) {
  function BluetoothScanner(deviceClass) {
    _classCallCheck(this, BluetoothScanner);

    _get(Object.getPrototypeOf(BluetoothScanner.prototype), 'constructor', this).call(this);
    _events2['default'].EventEmitter.call(this);

    this.deviceClass = deviceClass;
    this.SCAN_UUIDS = deviceClass.SCAN_UUIDS;
    this.SCAN_DUPLICATES = false;
  }

  _inherits(BluetoothScanner, _events$EventEmitter);

  _createClass(BluetoothScanner, [{
    key: 'onDiscover',
    value: function onDiscover(peripheral) {

      if (this.deviceClass.is(peripheral)) {
        var device = new this.deviceClass(peripheral);

        this.emit('discover', device);
      }
    }
  }, {
    key: 'discover',
    value: function discover() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {

        var onDiscover = function onDiscover(device) {
          _this2.stopDiscoverAll(onDiscover);
          resolve(device);
        };

        _this2.discoverAll(onDiscover);
      });
    }
  }, {
    key: 'discoverAll',
    value: function discoverAll(callback) {
      var _this3 = this;

      this.addListener('discover', callback);

      if (this.listeners('discover').length == 1) {

        var startScanningOnPowerOn = function startScanningOnPowerOn() {
          if (_noble2['default'].state === 'poweredOn') {
            _noble2['default'].on('discover', _this3.onDiscover.bind(_this3));
            _noble2['default'].startScanning(_this3.SCAN_UUIDS, _this3.SCAN_DUPLICATES);
          } else {
            _noble2['default'].once('stateChange', startScanningOnPowerOn);
          }
        };

        startScanningOnPowerOn();
      }
    }
  }, {
    key: 'stopDiscoverAll',
    value: function stopDiscoverAll(discoverCallback) {
      this.removeListener('discover', discoverCallback);

      if (this.listeners('discover').length == 0) {
        _noble2['default'].removeListener('discover', this.onDiscover);

        _noble2['default'].stopScanning();
      }
    }
  }, {
    key: 'discoverWithFilter',
    value: function discoverWithFilter(filter, callback) {
      var _this4 = this;

      var onDiscoverWithFilter = function onDiscoverWithFilter(device) {
        if (filter(device)) {
          _this4.stopDiscoverAll(onDiscoverWithFilter);

          callback(device);
        }
      };

      this.discoverAll(onDiscoverWithFilter);
    }
  }, {
    key: 'discoverByUuid',
    value: function discoverByUuid(uuid, callback) {
      this.discoverWithFilter(function (device) {
        return device.uuid === uuid;
      }, callback);
    }
  }], [{
    key: 'SCAN_UUIDS',
    value: [],
    enumerable: true
  }, {
    key: 'SCAN_DUPLICATES',
    value: false,
    enumerable: true
  }]);

  return BluetoothScanner;
})(_events2['default'].EventEmitter);

exports['default'] = BluetoothScanner;
module.exports = exports['default'];