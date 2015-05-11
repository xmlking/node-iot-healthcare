import noble   from 'noble';
import events  from 'events';

export default class BluetoothScanner  extends events.EventEmitter {

  static SCAN_UUIDS           = [];
  static SCAN_DUPLICATES      = false;

  constructor(deviceClass) {
    super();
    events.EventEmitter.call(this);

    this.deviceClass = deviceClass;
    this.SCAN_UUIDS = deviceClass.SCAN_UUIDS;
    this.SCAN_DUPLICATES = false;

  }

  onDiscover(peripheral) {

    if (this.deviceClass.is(peripheral)) {
      var device = new this.deviceClass(peripheral);

      this.emit('discover', device);
    }
  };

  discover() {
    return new Promise((resolve, reject) => {

      var onDiscover = (device) => {
        this.stopDiscoverAll(onDiscover);
        resolve(device);
      };

      this.discoverAll(onDiscover);
    });

  }

  scan(deviceClasses) {
    let devices = [];
    let SCAN_UUIDS = deviceClasses.map((devCls) => devCls.SERVICE_UUID);
    console.log('SCAN_UUIDS',SCAN_UUIDS);

    return new Promise((resolve, reject) => {

      noble.on('stateChange', function(state) {
        if (state === 'poweredOn') {
          noble.startScanning(SCAN_UUIDS, false);
        } else {
          noble.stopScanning();
          reject('not on..');
        }
      });

      noble.on('discover', (peripheral) => {
        let deviceClass = deviceClasses.find(devCls => devCls.is(peripheral));
        devices.push(new deviceClass(peripheral));
        if(devices.length == deviceClasses.length) {
          noble.stopScanning();
          resolve(devices);
        }
      });

    });
  }

  discoverAll(callback) {
    this.addListener('discover', callback);

    if (this.listeners('discover').length == 1) {

      var startScanningOnPowerOn = () => {
        if (noble.state === 'poweredOn') {
          noble.on('discover', this.onDiscover.bind(this));
          noble.startScanning(this.SCAN_UUIDS, this.SCAN_DUPLICATES);
        } else {
          noble.once('stateChange', startScanningOnPowerOn);
        }
      };

      startScanningOnPowerOn();
    }
  }

  stopDiscoverAll(discoverCallback) {
    this.removeListener('discover', discoverCallback);

    if (this.listeners('discover').length == 0) {
      noble.removeListener('discover', this.onDiscover);

      noble.stopScanning();
    }
  };

  discoverWithFilter(filter, callback) {
    var onDiscoverWithFilter = (device) => {
      if (filter(device)) {
        this.stopDiscoverAll(onDiscoverWithFilter);

        callback(device);
      }
    };

    this.discoverAll(onDiscoverWithFilter);
  };

  discoverByUuid(uuid, callback) {
    this.discoverWithFilter((device) => {
      return (device.uuid === uuid);
    }, callback);
  };

}
