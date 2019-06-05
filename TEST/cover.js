'use strict';

const uberJT = require('../index');

var eventEmitter = require('../eventEmitter.js');
var tasks = eventEmitter.universalEmitter;

require('pretty-error').start();

const creds = JSON.parse(uberJT.setCreds('../uberJT/config/credentials.json'));
uberJT.oAuthGetData(creds, uberJT.getData, '1kXyr6u8REeaNGsNfEbL6AjGCxSK_9GtXNGJ5NHlV9mQ', 'n/a', 'A:F', '001');

tasks.on('success_get_data_001', function(data){
    console.log(data);
}); 

tasks.on('success_get_data_003', function(data){
    console.log(data);
}); 