Node-IoT-HealthCare
===================

node.js lib for fitness and health tracking devices.

![Demo](./demo.gif)

###Pre-Requisites

iojs v2.1.0

```sh
[sudo] npm install -g babel
```
### Setup
```sh
npm install 
```

### Build
```sh
npm run prepublish
```

### Test
```sh
npm run test
```

### Run
```sh
sudo su # for RaspberryPi when running with pi account
babel-node --stage 0 -- test.js
```

### Debug
```sh
sudo su # for RaspberryPi when running with pi account
babel-node --debug --stage 0 -- test.js --debug
```
