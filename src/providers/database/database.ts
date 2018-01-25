import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import * as bcrypt from 'bcryptjs';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  // TODO the app needs to send the credentials to the remote server rather than storing them locally
  db: any;

  constructor(public http: HttpClient) {
    let self = this;

    self.db = (<any>window).sqlitePlugin.openDatabase({
      name: 'database.db',
      location: 'default',
      androidDatabaseImplementation: 2
    }, function (db) {
      db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${Ranger.TABLE_NAME} (` +
        `  ${Ranger.USERNAME} VARCHAR(128) PRIMARY KEY NOT NULL,` +
        `  ${Ranger.PASSWORD} CHAR(60) NOT NULL` +
        `)`,
        [],
        ...self.callbacks('db creation')
      )
    }, self.error('open db'));
  }

  registerUser(username: string, password: string): Promise<boolean> {
    // TODO only valid rangers should be able to register...
    console.log('registerUser');
    let self = this;
    return new Promise<boolean>(function (resolve, reject) {
      let salt = bcrypt.genSaltSync();
      let hash = bcrypt.hashSync(password, salt);
      console.log(`self: ${self}`);
      Object.keys(self).forEach(function (key, index) {
        if (self.hasOwnProperty(key)) {
          console.log(`key: ${key}, value: ${self[key]}`);
        }
      });
      self.db.executeSql(
        `SELECT COUNT(*) AS count FROM ${Ranger.TABLE_NAME}` +
        `  WHERE ${Ranger.USERNAME} = ?`,
        [username],
        function (ignored, resultSet) {
          if (resultSet.rows.items(0).count > 0) {
            reject(`There is already an account associated with ${username}.`);
          }
        },
        reject
      );
      self.db.executeSql(
        `INSERT INTO ${Ranger.TABLE_NAME}` +
        `  (${Ranger.USERNAME}, ${Ranger.PASSWORD}) ` +
        `  VALUES ` +
        `  (?, ?)`,
        [username, hash],
        function () {
          resolve(true);
        },
        reject
      )
    });
  }

  authenticateUser(username: string, password: string): Promise<boolean> {
    console.log('authenticateUser');
    let self = this;
    return new Promise<boolean>(function (resolve, reject) {
      console.log(`self: ${self}`);
      Object.keys(self).forEach(function (key, index) {
        if (self.hasOwnProperty(key)) {
          console.log(`key: ${key}, value: ${self[key]}`);
        }
      });
      self.db.executeSql(
        `SELECT ${Ranger.PASSWORD} FROM ${Ranger.TABLE_NAME}` +
        ` WHERE ${Ranger.USERNAME} = ?`,
        [username],
        function (ignored, resultSet) {
          let rows = resultSet.rows;
          if (rows.length() < 1) {
            // user is not present
            resolve(false);
          }
          console.log(`ignored: ${ignored}, resultSet: ${resultSet}, password: ${rows.items(0).password}`);
          resolve(bcrypt.compareSync(password, rows.items(0).password));
        },
        function (msg) {
          self.error('user authentication');
          reject(msg);
        }
      );
    });
  }

  callbacks(task: string) {
    return [this.success(task), this.error(task)];
  }

  success(task: string) {
    return function () {
      console.log(task + ' completed successfully');
    }
  }

  error(task: string) {
    return function (msg) {
      console.error(task + ' encountered error: ' + msg);
    }
  }
}

class Ranger {
  static readonly TABLE_NAME: string = 'Ranger';
  static readonly USERNAME: string = 'username';
  static readonly PASSWORD: string = 'password';
}
