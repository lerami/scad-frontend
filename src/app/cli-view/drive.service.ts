import { Injectable } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import { google } from 'googleapis';
import {CypherService} from './cypher.service';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'tokens/token.json';

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  private oAuth2token;

  constructor(private cypherService: CypherService) {
  }

  checkToken() {
    fs.readFile('tokens/credentials.json', (err, content) => {
      if (err) {
        return console.log('Error loading client secret file:', err);
      }
        // Authorize a client with credentials, then call the Google Drive API.
      this.authorize(JSON.parse(content.toString()));
    });

 }

 authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return this.getAccessToken(oAuth2Client);
    }
    this.oAuth2token = oAuth2Client.setCredentials(JSON.parse(token.toString()));
  });
  }

   getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    // TODO: afficher une page permettant de générer le token OAuth2
    // console.log('Authorize this app by visiting this url:', authUrl);
   /* const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          return console.error('Error retrieving access token', err);
        }
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client, param);
      });
    });*/
  }

   listFiles() {
    const drive = google.drive({ version: 'v3', auth: this.oAuth2token });
    const params = {
      includeRemoved: false,
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    };

    drive.files.list(params, (err, res) => {
      if (err) {
        return console.log('The API returned an error: ' + err);
        // TODO
      }
      const files = res.data.files;
      if (files.length) {
        // TODO
        console.log('Files:');
        files.map((file) => {
          console.log(file);
        });
      } else {
        console.log('No files found.');
      }
    });
  }

   createFile(filePath) {

    const drive = google.drive({ version: 'v3', auth: this.oAuth2token });
    const fileMetadata = {
      'name': path.basename(filePath)
    };
    const media = {
      mimeType: 'text/plain',
      body: fs.createReadStream(filePath + '.enc')
    };
    const key_media = {
      mimeType: 'text/plain',
      body: fs.createReadStream(filePath + '.key')
    };
    const fileParams = {
      resource: fileMetadata,
      media: media,
      fields: 'id'
    };

    const keyParams = {
      resource: {
        'name': fileMetadata['name'] + '.key'
      },
      media: key_media,
      fields: 'id'
    };

    drive.files.create(fileParams, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log(`File uploaded with Id ${file.data.id}`);
        fs.unlinkSync(filePath + '.enc');
      }
    });
    drive.files.create(keyParams, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log(`File key uploaded with Id ${file.data.id}`);
        fs.unlinkSync(filePath + '.key');
      }
    });
  }

  deleteFile(fileId) {
    if (typeof fileId === 'undefined') {
      console.error('Please type the id of the file as an argument');
      return;
    }
    const drive = google.drive({ version: 'v3', auth: this.oAuth2token });
    // console.log(`Deleting file ${fileId}`);
    drive.files.delete({
      'fileId': fileId
    });
  }

  downloadFile(fileId, keyId) {
    if (typeof fileId === 'undefined') {
      // TODO
      // console.error("Please give and Id as argument to download the file");
      return;
    }
    const drive = google.drive({ version: 'v3', auth: this.oAuth2token });
    const crypted_dest = fs.createWriteStream(`./downloads/${fileId}_encrypted_download`);
    drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' },
      function (err, res: any) {
        res.data
          .on('end', () => {
            // TODO
            // console.log(`Downloaded file ${fileId}`);
            const cipherKey = fs.createWriteStream(`./downloads/${fileId}.key`);
            // Launch of an API call to download the key
            // TODO: get the key ID in database
            drive.files.get({ fileId: keyId, alt: 'media' }, { responseType: 'stream' },
              function (cipherErr, cipherRes: any) {
                cipherRes.data
                  .on('end', () => {
                    // console.log(`Downloaded key`);
                    // APPELER SERVICE CYPHER
                    this.cypherService.decrypt(fileId, `./downloads/${fileId}_encrypted_download`);
                  })
                  .on('error', cipherErr => {
                    // console.log('Error', err);
                  })
                  .pipe(cipherKey);
              });
          })
          .on('error', err => {
            console.log('Error', err);
          })
          .pipe(crypted_dest);
      });
  }

}
