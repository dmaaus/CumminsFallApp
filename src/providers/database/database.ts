import {HttpClient} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';

import * as bcrypt from 'bcryptjs';
import * as generatePassword from 'generate-password';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {EmailProvider} from "../email/email";

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider implements OnDestroy {
    // TODO the app needs to send the credentials to the remote server rather than storing them locally
    db: any;
    static readonly NEW_RANGER_EXPIRATION_IN_MINUTES: number = 15;

    constructor(public http: HttpClient, private sqlite: SQLite, private email: EmailProvider) {
        let self = this;
        this.sqlite.create({
            name: 'database.db',
            location: 'default',
        })
            .then((db: SQLiteObject) => {
                self.db = db;
                db.executeSql(
                    `CREATE TABLE IF NOT EXISTS ${DB_CONSTS.RANGER_TABLE_NAME} (` +
                    `  ${DB_CONSTS.RANGER_USERNAME} VARCHAR(128) PRIMARY KEY NOT NULL,` +
                    `  ${DB_CONSTS.RANGER_PASSWORD} CHAR(60) NOT NULL,` +
                    `  ${DB_CONSTS.RANGER_NAME} VARCHAR(256) NOT NULL,` +
                    `  ${DB_CONSTS.RANGER_EMAIL} VARCHAR(254) NOT NULL,` +
                    `  ${DB_CONSTS.RANGER_IS_ADMIN} INTEGER NOT NULL,` +
                    `  ${DB_CONSTS.RANGER_EXPIRATION} DATE` +
                    `)`, []).then(() => {
                    self.deleteUser('jonmcclung').catch(self.error).then(() => {
                        self.addUser(new Ranger('Jon McClung', 'jonmcclung', 'jonmcclung@gmail.com', true)).catch(self.error);
                    });
                }).catch(self.error);
            }).catch(self.error);
        // self.addUser(new Ranger('Jon McClung2', 'jonmcclung2', 'jonmcclung@gmail.com', false));
        // self.addUser(new Ranger('Jon McClung3', 'jonmcclung3', 'jonmcclung@gmail.com', false));
        // self.addUser(new Ranger('Jon McClung4', 'jonmcclung4', 'jonmcclung@gmail.com', false));
        // self.addUser(new Ranger('Jon McClung5', 'jonmcclung5', 'jonmcclung@gmail.com', false));
        // self.addUser(new Ranger('Jon McClung6', 'jonmcclung6', 'jonmcclung@gmail.com', false));
        // self.addUser(new Ranger('Jon McClung7', 'jonmcclung7', 'jonmcclung@gmail.com', false));
        // self.addUser(new Ranger('Jon McClung8', 'jonmcclung8', 'jonmcclung@gmail.com', false));
    }

    ngOnDestroy() {
        this.db.close();
    }

    resetPassword(username: string, oldPassword: string, newPassword: string): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            if (newPassword.length < 8) {
                reject('Password must be at least 8 characters in length');
                return;
            }
            if (oldPassword === newPassword) {
                reject('New password must not match current password');
                return;
            }
            self.authenticateUser(username, oldPassword).then((ranger: Ranger) => {
                let salt = bcrypt.genSaltSync();
                let hash = bcrypt.hashSync(newPassword, salt);
                self.db.executeSql(
                    `UPDATE ${DB_CONSTS.RANGER_TABLE_NAME} SET` +
                    ` ${DB_CONSTS.RANGER_PASSWORD} = ?,` +
                    ` ${DB_CONSTS.RANGER_EXPIRATION} = ?` +
                    ` WHERE ${DB_CONSTS.RANGER_USERNAME} = ?`,
                    [newPassword, null, username]
                )
                    .then(resolve(true))
                    .catch(reject);
            }).catch(() => {
                reject('Old password is invalid.')
            });
        });
    }

    deleteUser(username: string): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            self.db.executeSql(
                `DELETE FROM ${DB_CONSTS.RANGER_TABLE_NAME} ` +
                `  WHERE ${DB_CONSTS.RANGER_USERNAME} = ?`, [username]
            )
                .then(resolve(true))
                .catch(reject);
        });
    }

    addUser(ranger: Ranger): Promise<boolean> {
        // Admin Rangers can add other rangers who will be sent an email to log in and register.
        console.log('addUser');
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            let password = generatePassword.generate({
                length: 12,
                numbers: true
            });
            let salt = bcrypt.genSaltSync();
            let hash = bcrypt.hashSync(password, salt);
            let count = 'count';
            self.db.executeSql(
                `SELECT COUNT(*) AS ${count} FROM ${DB_CONSTS.RANGER_TABLE_NAME}` +
                `  WHERE ${DB_CONSTS.RANGER_USERNAME} = ?`,
                [ranger.username])
                .then((result) => {
                    if (result.rows.item(0)[count] > 0) {
                        reject(`There is already an account associated with ${ranger.username}.`);
                        return;
                    }
                    let expiration = new Date();
                    expiration.setMinutes(expiration.getMinutes() + DatabaseProvider.NEW_RANGER_EXPIRATION_IN_MINUTES);
                    console.log('expiration is ' + expiration);
                    self.db.executeSql(
                        `INSERT INTO ${DB_CONSTS.RANGER_TABLE_NAME}` +
                        `  (${DB_CONSTS.RANGER_USERNAME}, ${DB_CONSTS.RANGER_PASSWORD}, ${DB_CONSTS.RANGER_NAME}, ${DB_CONSTS.RANGER_EMAIL}, ${DB_CONSTS.RANGER_IS_ADMIN}, ${DB_CONSTS.RANGER_EXPIRATION}) ` +
                        `  VALUES ` +
                        `  (?, ?, ?, ?, ?, ?)`,
                        [ranger.username, hash, ranger.name, ranger.email, ranger.isAdmin ? 1 : 0, expiration])
                        .then(() => {
                            /* They should get their username from their admin (this process would usually be done
                            with the admin */
                            let message = `You have been added as a ranger of Cummins Falls. Please download the app and confirm your account registration. To do so, go to Settings > Ranger Login and use the code ${password}\n\nNote that this code expires at ${expiration.toLocaleTimeString()}`;
                            this.email.send(
                                'no-reply@cumminsfalls.com',
                                ranger.email,
                                'Confirm Account Registration',
                                message)
                                .catch(reject);
                            console.log('email sent');
                            resolve(true);
                        }).catch(reject);
                }).catch(reject);
        });
    }

    getRangerNames(): string[] {
        // TODO make real
        return ['Jon McClung', 'Joe Schmoe', 'Alpha Schlarf'];
    }

    getRangerWithName(name: string): Ranger {
        // TODO make real
        return new Ranger(name, 'jonmcclung', 'jonmcclung@gmail.com', false);
    }

    authenticateUser(username: string, password: string): Promise<Ranger> {
        console.log('authenticateUser');
        let self = this;
        return new Promise<Ranger>((resolve, reject) => {
            let fail = function () {
                reject('username or password is invalid');
            };
            self.db.executeSql(
                `SELECT ${DB_CONSTS.RANGER_PASSWORD}, ${DB_CONSTS.RANGER_NAME}, ${DB_CONSTS.RANGER_USERNAME}, ` +
                `${DB_CONSTS.RANGER_EMAIL}, ${DB_CONSTS.RANGER_IS_ADMIN}, ${DB_CONSTS.RANGER_EXPIRATION}` +
                ` FROM ${DB_CONSTS.RANGER_TABLE_NAME}` +
                ` WHERE ${DB_CONSTS.RANGER_USERNAME} = ?`, [username])
                .then((resultSet) => {
                    let rows = resultSet.rows;
                    if (rows.length < 1) {
                        // user is not present
                        // TODO remove log for production
                        console.log('user is not present');
                        fail();
                        return;
                    }
                    let result = rows.item(0);
                    if (!bcrypt.compareSync(password, result[DB_CONSTS.RANGER_PASSWORD])) {
                        fail();
                        return;
                    }
                    let ranger = new Ranger(
                        result[DB_CONSTS.RANGER_NAME],
                        result[DB_CONSTS.RANGER_USERNAME],
                        result[DB_CONSTS.RANGER_EMAIL],
                        result[DB_CONSTS.RANGER_IS_ADMIN]);

                    let expiration: Date = result[DB_CONSTS.RANGER_EXPIRATION];
                    if (expiration != null) {
                        if (new Date(expiration).getTime() < Date.now()) {
                            reject('Temporary code has expired. Please have an admin recreate the account');
                            return;
                        }
                        else {
                            ranger.needsToResetPassword = true;
                        }
                    }
                    console.log(ranger);
                    resolve(ranger);
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

export class Ranger {
    constructor(public name: string, public username: string, public email: string, public isAdmin: boolean, public needsToResetPassword: boolean = false) {
    }

    toString(): string {
        let result = '[Ranger: {\n';
        Object.keys(this).forEach((key) => {
            if (this.hasOwnProperty(key)) {
                result += `  ${key}: ${this[key]},\n`;
            }
        });
        return result + '}]';
    }
}

class DB_CONSTS {
    static readonly RANGER_TABLE_NAME: string = 'Ranger';
    static readonly RANGER_USERNAME: string = 'username';
    static readonly RANGER_PASSWORD: string = 'password';
    static readonly RANGER_NAME: string = 'name';
    static readonly RANGER_EMAIL: string = 'email';
    static readonly RANGER_IS_ADMIN: string = 'isAdmin';
    static readonly RANGER_EXPIRATION: string = 'expiration';
}
