export default class DeviceInformationService {

  static DEVICE_INFORMATION_UUID  = '180a';
  static SYSTEM_ID_UUID           = '2a23';
  static MODEL_NUMBER_UUID        = '2a24';
  static SERIAL_NUMBER_UUID       = '2a25';
  static FIRMWARE_REVISION_UUID   = '2a26';
  static HARDWARE_REVISION_UUID   = '2a27';
  static SOFTWARE_REVISION_UUID   = '2a28';
  static MANUFACTURER_NAME_UUID   = '2a29';

  readSystemId(callback) {
    this.readDataCharacteristic(DEVICE_INFORMATION_UUID, SYSTEM_ID_UUID, function(error, data) {
      if (error) {
        return callback(error);
      }

      var systemId = data.toString('hex').match(/.{1,2}/g).reverse().join(':');

      callback(null, systemId);
    });
  }

  readModelNumber(callback) {
    this.readStringCharacteristic(DeviceInformationService.DEVICE_INFORMATION_UUID, DeviceInformationService.MODEL_NUMBER_UUID, callback);
  }

  readSerialNumber(callback) {
    this.readStringCharacteristic(DeviceInformationService.DEVICE_INFORMATION_UUID, DeviceInformationService.SERIAL_NUMBER_UUID, callback);
  }

  readFirmwareRevision(callback) {
    this.readStringCharacteristic(DeviceInformationService.DEVICE_INFORMATION_UUID, DeviceInformationService.FIRMWARE_REVISION_UUID, callback);
  }

  readHardwareRevision(callback) {
    this.readStringCharacteristic(DeviceInformationService.DEVICE_INFORMATION_UUID, DeviceInformationService.HARDWARE_REVISION_UUID, callback);
  }

  readSoftwareRevision(callback) {
    this.readStringCharacteristic(DeviceInformationService.DEVICE_INFORMATION_UUID, DeviceInformationService.SOFTWARE_REVISION_UUID, callback);
  }

  readManufacturerName(callback) {
    this.readStringCharacteristic(DeviceInformationService.DEVICE_INFORMATION_UUID, DeviceInformationService.MANUFACTURER_NAME_UUID, callback);
  }

}
