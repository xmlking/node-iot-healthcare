export default class BatteryService {

  static BATTERY_UUID = '180f';
  static BATTERY_LEVEL_UUID = '2a19';

  readBatteryLevel(callback) {
    this.readUInt8Characteristic(BatteryService.BATTERY_UUID, BatteryService.BATTERY_LEVEL_UUID, callback);
  };

}
