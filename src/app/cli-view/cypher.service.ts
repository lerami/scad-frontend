import { Injectable } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import * as asym_crypto from 'quick-encrypt';
import * as crypto from 'crypto';
import { AppendInitVectComponent } from './append-init-vect/append-init-vect.component';
import { DriveService } from './drive.service';


@Injectable({
  providedIn: 'root',
})
export class CypherService {
  private keys;
  constructor(private driveService: DriveService) {
    if (fs.existsSync('tokens/asym_keys.json')) {
      const keysFile = fs.readFileSync('tokens/asym_keys.json');
      this.keys = JSON.parse(keysFile.toString());
    } else {
      this.keys = asym_crypto.generate(2048);
      const asym_key = fs.createWriteStream('tokens/asym_keys.json');
      asym_key.write(JSON.stringify(this.keys));
      console.log('Keys generated');
    }
  }

  encrypt(filePath) {
    const name = path.basename(filePath);
    if (typeof filePath === 'undefined') {
      // TODO
      console.error('Please type the name of the file as an argument');
      return;
    }

    // Generation of a random initialization vector
    const initVect = crypto.randomBytes(16);

    // Generation of a random Key
    const CIPHER_KEY = crypto.randomBytes(32);
    const readStream = fs.createReadStream(`./downloads/${filePath}`); // The file to encrypt
    const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect); // The cipher
    const appendInitVect = new AppendInitVectComponent(initVect); // AppendInitVect to append it to the file after encryption
    // Create a write stream with a different file extension.
    const writeStream = fs.createWriteStream(path.join(filePath + '.enc'));

    readStream
      .pipe(cipher)
      .pipe(appendInitVect)
      .pipe(writeStream);

    const cipherKeyFile = fs.createWriteStream(`./downloads/${filePath}` + '.key'); // Creation of the key File
    // Asymetric encryption of the file key
    // The base64 option allows to keep the correct key size
    cipherKeyFile.write(asym_crypto.encrypt(CIPHER_KEY.toString('base64'), this.keys.public));

    writeStream.on('finish', () => {
      console.log('File encrypted');
      this.driveService.createFile(`./downloads/${filePath}`); // call for the upload of the file
    });
  }

  getCipherKey(fileId) {
    const encrypted_key = fs.readFileSync(`./downloads/${fileId}.key`);
    const d_key = asym_crypto.decrypt(encrypted_key.toString(), this.keys.private); // Decryption of the key with the peer's key
    return Buffer.from(d_key, 'base64'); // Change to buffer with base64 format to have the correct key size for decryption of the file
  }

  decrypt(fileId, cipherFile) {
    const readInitVect = fs.createReadStream(`./downloads/${cipherFile}`, { end: 15 });
    const dest = fs.createWriteStream(`./downloads/${fileId}.download`);

    // fetch the initialization Vector on the downloaded file
    let initVect;
    readInitVect.on('data', (chunk) => {
      initVect = chunk;
    });

    // Once we’ve got the initialization vector, we can decrypt the file.
    readInitVect.on('close', () => {
      const cipherKey = this.getCipherKey(fileId); // Call for the decryption of the key
      // Start at 16 since the initialization vector is of size 16
      const readStream = fs.createReadStream(`./downloads/${cipherFile}`, { start: 16 });
      const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);

      readStream
      .pipe(decipher)
      .pipe(dest);
      dest.on('finish', () => {
        console.log('File decrypted');
        fs.unlinkSync(`downloads/${cipherFile}`); // Cleaning the temporary files
        fs.unlinkSync(`downloads/${fileId}.key`);
      });

  });
}
}
