import noble   from 'noble';
import BluetoothDevice from './BluetoothDevice';

export default class BluetoothScanner {

  static discover(deviceClass : BluetoothDevice) {
    return new Promise((resolve, reject) => {

      console.info('Scanning for : ', deviceClass.SCAN_UUIDS);

      noble.on('stateChange', function(state) {
        if (state === 'poweredOn') {
          noble.startScanning(deviceClass.SCAN_UUIDS | [], this.SCAN_DUPLICATES);
        } else {
          noble.stopScanning();
          reject('bluetooth off?');
        }
      });

      noble.on('discover', (peripheral) => {
        resolve(new deviceClass(peripheral));
      });

    });

  }

  static discoverAll(deviceClasses : Array<BluetoothDevice>) {
    let devices = [];
    let SCAN_UUIDS = deviceClasses.map((devCls) => devCls.SERVICE_UUID);

    return new Promise((resolve, reject) => {

      console.info('Saning for : ',SCAN_UUIDS);

      noble.on('stateChange', function(state) {
        if (state === 'poweredOn') {
          noble.startScanning(SCAN_UUIDS, false);
        } else {
          noble.stopScanning();
          reject('bluetooth fff?');
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

}
