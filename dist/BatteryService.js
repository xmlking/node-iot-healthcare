'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BatteryService = (function () {
  function BatteryService() {
    _classCallCheck(this, BatteryService);
  }

  _createClass(BatteryService, [{
    key: 'readBatteryLevel',
    value: function readBatteryLevel(callback) {
      this.readUInt8Characteristic(BatteryService.BATTERY_UUID, BatteryService.BATTERY_LEVEL_UUID, callback);
    }
  }], [{
    key: 'BATTERY_UUID',
    value: '180f',
    enumerable: true
  }, {
    key: 'BATTERY_LEVEL_UUID',
    value: '2a19',
    enumerable: true
  }]);

  return BatteryService;
})();

exports['default'] = BatteryService;
module.exports = exports['default'];