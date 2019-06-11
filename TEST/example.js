'use strict';
require('pretty-error').start();

const uberJT = require('../index'); /** Require the package */
const eventEmitter = require('../eventEmitter.js'); /** Require the emitter */
const tasks = eventEmitter.universalEmitter; /** Set the emitter */

/** Your credentials can be downloaded from
 *  https://developers.google.com/sheets/api/quickstart/nodejs
 */
const creds = JSON.parse(uberJT.setCreds('../uberJT/config/credentials.json')); /** Set the credential file location */

/** Authenticate & Get Data  @credentials , @function , @spreadSheetId , @sheetName , @range , @customId */
/** Authenticate & Append Data @credentials , @function , @spreadSheetId , @sheetName , @range , @data , @customId */

function getAllClientData() {
    const ssId = '1kXyr6u8REeaNGsNfEbL6AjGCxSK_9GtXNGJ5NHlV9mQ'; /** SpreadSheet Id */
    uberJT.OAuthGetData(creds, uberJT.getData, ssId, 'Second', 'A:C', '001');
    /** Wait for the Get Data call then continue */
    tasks.on('success_get_data_001', function(data){
        console.log(data);console.log('All Data loaded from Client');
    }); 
}

function addClientData2SecondSheet() {
    const ssId = '1kXyr6u8REeaNGsNfEbL6AjGCxSK_9GtXNGJ5NHlV9mQ'; /** SpreadSheet Id */
    uberJT.OAuthGetData(creds, uberJT.getData, ssId, 'n/a', 'A:F', '002');
    /** Wait for the Get Data call then continue */
    tasks.on('success_get_data_002', function(data){
        const clientData = data.slice(1, data.length); /** Grabs client data  */
        /** Appends client data to the "Second" sheet of the spreadsheet ID */
        uberJT.OAuthAppendData(creds, uberJT.appendData, ssId, 'Second', 'A:F', clientData, '001');
    }); 
    /** Once appended, display message */
    tasks.on('success_append_data_001', function(){
        console.log('Successfully added data to "Second" sheet');
    });
}

// addClientData2SecondSheet();
// getAllClientData();