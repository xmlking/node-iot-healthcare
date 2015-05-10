'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DeviceInformationService = (function () {
  function DeviceInformationService() {
    _classCallCheck(this, DeviceInformationService);
  }

  _createClass(DeviceInformationService, [{
    key: 'readSystemId',
    value: function readSystemId(callback) {
      this.readDataCharacteristic(DEVICE_INFORMATION_UUID, SYSTEM_ID_UUID, function (error, data) {
        if (error) {
          return callback(error);
        }

        var systemId = data.toString('hex').match(/.{1,2}/g).reverse().join(':');

        callback(null, systemId);
      });
    }
  }, {
    key: 'readModelNumber',
    value: function readModelNumber(callback) {
      this.readStringCharacteristic(DeviceInformationService.DEVICE_INFORMATION_UUID, DeviceInformationService.MODEL_NUMBER_UUID, callback);
    }
  }, {
    key: 'readSerialNumber',
    value: function readSerialNumber(callback) {
      this.readStringCharacteristic(DeviceInformationService.DEVICE_INFORMATION_UUID, DeviceInformationService.SERIAL_NUMBER_UUID, callback);
    }
  }, {
    key: 'readFirmwareRevision',
    value: function readFirmwareRevision(callback) {
      this.readStringCharacteristic(DeviceInformationService.DEVICE_INFORMATION_UUID, DeviceInformationService.FIRMWARE_REVISION_UUID, callback);
    }
  }, {
    key: 'readHardwareRevision',
    value: function readHardwareRevision(callback) {
      this.readStringCharacteristic(DeviceInformationService.DEVICE_INFORMATION_UUID, DeviceInformationService.HARDWARE_REVISION_UUID, callback);
    }
  }, {
    key: 'readSoftwareRevision',
    value: function readSoftwareRevision(callback) {
      this.readStringCharacteristic(DeviceInformationService.DEVICE_INFORMATION_UUID, DeviceInformationService.SOFTWARE_REVISION_UUID, callback);
    }
  }, {
    key: 'readManufacturerName',
    value: function readManufacturerName(callback) {
      this.readStringCharacteristic(DeviceInformationService.DEVICE_INFORMATION_UUID, DeviceInformationService.MANUFACTURER_NAME_UUID, callback);
    }
  }], [{
    key: 'DEVICE_INFORMATION_UUID',
    value: '180a',
    enumerable: true
  }, {
    key: 'SYSTEM_ID_UUID',
    value: '2a23',
    enumerable: true
  }, {
    key: 'MODEL_NUMBER_UUID',
    value: '2a24',
    enumerable: true
  }, {
    key: 'SERIAL_NUMBER_UUID',
    value: '2a25',
    enumerable: true
  }, {
    key: 'FIRMWARE_REVISION_UUID',
    value: '2a26',
    enumerable: true
  }, {
    key: 'HARDWARE_REVISION_UUID',
    value: '2a27',
    enumerable: true
  }, {
    key: 'SOFTWARE_REVISION_UUID',
    value: '2a28',
    enumerable: true
  }, {
    key: 'MANUFACTURER_NAME_UUID',
    value: '2a29',
    enumerable: true
  }]);

  return DeviceInformationService;
})();

exports['default'] = DeviceInformationService;
module.exports = exports['default'];