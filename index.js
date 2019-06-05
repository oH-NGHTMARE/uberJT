'use strict';

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

var eventEmitter = require('./eventEmitter.js');
var universalEmitter = eventEmitter.universalEmitter;

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './config/token.json';

exports.setCreds = function(filepath) {
    if (filepath.includes('json') != true) throw 'Credential file must have .json extension.'
    return fs.readFileSync(`${filepath}`, (err, content) => {
        if (err) return console.log(err);
        return JSON.parse(content)
    })
}

/**  oAuth and Function for 
 * gathering data from a sheet
 * @credentials - set by user
 * @callback - function to run, should match oAuth
 * @spreadsheetId - id of the spreadsheet
 * @sheetName - if sheetname go to id then sheetname
 * @range - the range to gather data from
 * @id - attaches id to functions for event listeners
 * doing this allows us to not make duplicate calls
 */
exports.oAuthGetData = function(credentials, callback, spreadsheetId, sheetName, range, id) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    return fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        return callback(oAuth2Client, spreadsheetId, sheetName, range, id);
    })
}

exports.getData = function(auth, spreadsheetId, sheetName, range, id) {
    const sheets = google.sheets({version:'v4', auth:auth});
    return sheets.spreadsheets.values.get({
        spreadsheetId: `${spreadsheetId}`,
        range: sheetName != 'n/a' ? `${sheetName}!${range}`: `${range}`
    }, (err, res) => {
        if(err) return console.log(err);
        universalEmitter.emit(`success_get_data_${id}`, res.data.values);
        return res.data.values
    })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }