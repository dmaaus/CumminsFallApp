import {HttpClient} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';

import * as bcrypt from 'bcryptjs';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider implements OnDestroy {
    // TODO the app needs to send the credentials to the remote server rather than storing them locally
    db: any;

    constructor(public http: HttpClient, private sqlite: SQLite) {
        let self = this;
        this.sqlite.create({
            name: 'database.db',
            location: 'default',
        })
            .then((db: SQLiteObject) => {
                console.log('creating table');
                self.db = db;
                db.executeSql(
                    `CREATE TABLE IF NOT EXISTS ${Ranger.TABLE_NAME} (` +
                    `  ${Ranger.USERNAME} VARCHAR(128) PRIMARY KEY NOT NULL,` +
                    `  ${Ranger.PASSWORD} CHAR(60) NOT NULL` +
                    `)`, []).catch(self.error);
            }).catch(self.error);
    }

    ngOnDestroy() {
        this.db.close();
    }

    resetPassword(username: string, oldPassword: string, newPassword: string): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            if (oldPassword === newPassword) {
                reject('New password must not match current password');
            }
            self.authenticateUser(username, oldPassword).then((valid) => {
                if (!valid) {
                    reject('Invalid username or password');
                    return;
                }
                self.deleteUser(username).then((valid) => {
                    if (!valid) {
                        reject('Unable to change password');
                        return;
                    }
                    self.registerUser(username, newPassword).then((valid) => {
                        resolve(valid);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        });
    }

    deleteUser(username: string): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            self.db.executeSql(
                `DELETE FROM ${Ranger.TABLE_NAME} ` +
                `  WHERE ${Ranger.USERNAME} = ?`, [username]
            )
                .then(resolve(true))
                .catch(reject);
        });
    }

    registerUser(username: string, password: string): Promise<boolean> {
        // TODO only valid rangers should be able to register...
        // TODO confirm with email?
        console.log('registerUser');
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            let salt = bcrypt.genSaltSync();
            let hash = bcrypt.hashSync(password, salt);
            console.log('hash: ' + hash);
            let count = 'count';
            self.db.executeSql(
                `SELECT COUNT(*) AS ${count} FROM ${Ranger.TABLE_NAME}` +
                `  WHERE ${Ranger.USERNAME} = ?`,
                [username])
                .then((result) => {
                    if (result.rows.item(0)[count] > 0) {
                        reject(`There is already an account associated with ${username}.`);
                        return;
                    }
                    self.db.executeSql(
                        `INSERT INTO ${Ranger.TABLE_NAME}` +
                        `  (${Ranger.USERNAME}, ${Ranger.PASSWORD}) ` +
                        `  VALUES ` +
                        `  (?, ?)`,
                        [username, hash])
                        .then(() => {
                            resolve(true);
                        }).catch(reject);
                }).catch(reject);
        });
    }

    authenticateUser(username: string, password: string): Promise<boolean> {
        console.log('authenticateUser');
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            self.db.executeSql(
                `SELECT ${Ranger.PASSWORD} FROM ${Ranger.TABLE_NAME}` +
                ` WHERE ${Ranger.USERNAME} = ?`, [username])
                .then((resultSet) => {
                    let rows = resultSet.rows;
                    if (rows.length < 1) {
                        // user is not present
                        // TODO remove log for production
                        console.log('user is not present');
                        resolve(false);
                        return;
                    }
                    console.log(`password: ${rows.item(0).password}`);
                    resolve(bcrypt.compareSync(password, rows.item(0)[Ranger.PASSWORD]));
                })
                .catch((msg) => {
                        self.taskFailed('user authentication');
                        reject(msg);
                    }
                );
        });
    }

    callbacks(task: string) {
        return [this.success(task), this.taskFailed(task)];
    }

    success(task: string) {
        return function () {
            console.log(task + ' completed successfully');
        }
    }

    error(msg: string) {
        console.error(msg);
    }

    taskFailed(task: string) {
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
