import {HttpClient} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';

import * as bcrypt from 'bcryptjs';
import * as generatePassword from 'generate-password';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {EmailProvider} from "../email/email";

@Injectable()
export class DatabaseProvider implements OnDestroy {
    // TODO the app needs to send the credentials to the remote server rather than storing them locally
    db: any;
    ready: boolean = false;
    static readonly NEW_RANGER_EXPIRATION_IN_MINUTES: number = 15;

    constructor(public http: HttpClient, private sqlite: SQLite, private email: EmailProvider) {

        let self = this;
        this.sqlite.create({
            name: 'database.db',
            location: 'default',
        }).then((db: SQLiteObject) => {
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
                self.deleteUser('joeschmoe').catch(self.error);
            }).catch(self.error);
        }).catch(self.error);
    }

    ngOnDestroy() {
        this.db.close();
    }

    static getExpiration(): Date {
        let res = new Date();
        res.setMinutes(res.getMinutes() + DatabaseProvider.NEW_RANGER_EXPIRATION_IN_MINUTES);
        return res;
    }

    sendConfirmationEmail(ranger: Ranger, password: string, expiration: Date): Promise<boolean> {
        return this.email.send(
            'no-reply@cumminsfalls.com',
            ranger.email,
            'Confirm Account Registration',
            `You have been added as a ranger of Cummins Falls. ` +
            `Please download the app and confirm your account registration. ` +
            `To do so, go to Settings > Ranger Login and use the code ${password}\n\n` +
            `Note that this code expires at ${expiration.toLocaleTimeString()}`);
    }

    static genPassword(): string {
        return generatePassword.generate({
            length: 12,
            numbers: true
        });
    }

    resendConfirmationCode(ranger: Ranger): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            let password = DatabaseProvider.genPassword();
            let hash = bcrypt.hashSync(password, bcrypt.genSaltSync());
            let expiration = DatabaseProvider.getExpiration();
            self.db.executeSql(
                `UPDATE ${DB_CONSTS.RANGER_TABLE_NAME}` +
                `  SET` +
                `  ${DB_CONSTS.RANGER_EXPIRATION} = ?,` +
                `  ${DB_CONSTS.RANGER_PASSWORD} = ?` +
                `  WHERE ${DB_CONSTS.RANGER_USERNAME} = ?`,
                [expiration, password, ranger.username]
            ).then(() => {
                self.sendConfirmationEmail(ranger, password, expiration)
                    .then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    resetPassword(ranger: Ranger, oldPassword: string, newPassword: string): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>((resolve, reject) => {
            if (newPassword.length < 8) {
                reject('Password must be at least 8 characters in length');
                return;
            }
            if (oldPassword === newPassword) {
                reject('New password must not match current password');
                return;
            }
            self.authenticateUser(ranger.username, oldPassword).then((ranger: Ranger) => {
                let salt = bcrypt.genSaltSync();
                let hash = bcrypt.hashSync(newPassword, salt);
                self.db.executeSql(
                    `UPDATE ${DB_CONSTS.RANGER_TABLE_NAME} SET` +
                    ` ${DB_CONSTS.RANGER_PASSWORD} = ?,` +
                    ` ${DB_CONSTS.RANGER_EXPIRATION} = ?` +
                    ` WHERE ${DB_CONSTS.RANGER_USERNAME} = ?`,
                    [hash, null, ranger.username]
                )
                    .then(() => {
                        ranger.state = Ranger.VALID;
                        resolve(ranger);
                    })
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
                .then(() => {
                    resolve(true);
                })
                .catch(reject);
        });
    }

    addUser(ranger: Ranger): Promise<boolean> {
        // Admin Rangers can add other rangers who will be sent an email to log in and register.
        console.log('addUser');
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            let password = DatabaseProvider.genPassword();
            let hash = bcrypt.hashSync(password, bcrypt.genSaltSync());
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
                    let expiration = DatabaseProvider.getExpiration();
                    console.log('expiration is ' + expiration);
                    self.db.executeSql(
                        `INSERT INTO ${DB_CONSTS.RANGER_TABLE_NAME}` +
                        `  (${DB_CONSTS.RANGER_USERNAME}, ${DB_CONSTS.RANGER_PASSWORD},` +
                        `   ${DB_CONSTS.RANGER_NAME}, ${DB_CONSTS.RANGER_EMAIL}, ${DB_CONSTS.RANGER_IS_ADMIN},` +
                        `   ${DB_CONSTS.RANGER_EXPIRATION}) ` +
                        `  VALUES ` +
                        `  (?, ?, ?, ?, ?, ?)`,
                        [ranger.username, hash, ranger.name, ranger.email, ranger.isAdmin ? 1 : 0, expiration])
                        .then(() => {
                            /* They should get their username from their admin (this process would usually be done
                            with the admin */
                            this.sendConfirmationEmail(ranger, password, expiration).then(resolve).catch((msg) => {
                                self.deleteUser(ranger.username).then(() => {
                                    reject(msg);
                                }).catch((msg2) => {
                                    reject(`Encountered two errors: 1) ${msg}. 2) ${msg2}`);
                                });
                            });
                        }).catch(reject);
                }).catch(reject);
        });
    }

    getRangerNames(): Promise<string[]> {
        let self = this;
        return new Promise<string[]>((resolve, reject) => {
            self.db.executeSql( // TODO not *
                `SELECT * FROM ${DB_CONSTS.RANGER_TABLE_NAME}`, []
            ).then(result => {
                let names: string[] = [];
                let rows = result.rows;
                let length = rows.length;
                for (let i = 0; i < length; i++) {
                    names.push(rows.item(i)[DB_CONSTS.RANGER_NAME]);
                }
                resolve(names);
            }).catch(reject);
        });
    }

    getRangerWithName(name: string): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>((resolve, reject) => {
            self.db.executeSql(
                `SELECT ${DB_CONSTS.RANGER_USERNAME}, ${DB_CONSTS.RANGER_NAME}, ${DB_CONSTS.RANGER_EXPIRATION}, ` +
                `${DB_CONSTS.RANGER_EMAIL}, ${DB_CONSTS.RANGER_IS_ADMIN}` +

                `  FROM ${DB_CONSTS.RANGER_TABLE_NAME}` +
                `  WHERE ${DB_CONSTS.RANGER_NAME} = ?`,
                [name]
            ).then(result => {
                let item = result.rows.item(0);
                Ranger.fromDatabaseQuery(item).then(value => {
                    resolve(value);
                }).catch(reject);
            }).catch(reject);
        });
    }

    authenticateUser(username: string, password: string): Promise<Ranger> {
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
                        // TODO remove
                        console.log(`password given: ${password} was wrong`);
                        return;
                    }
                    Ranger.fromDatabaseQuery(result).then(ranger => {
                        if (ranger.state === Ranger.EXPIRED) {
                            reject('Temporary code has expired. Please have an admin recreate the account');
                        }
                        else {
                            resolve(ranger);
                        }
                    });
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

    changeAdminRights(ranger: Ranger, isAdmin: boolean): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>((resolve, reject) => {
            self.db.executeSql(
                `UPDATE ${DB_CONSTS.RANGER_TABLE_NAME}` +
                `  SET` +
                `  ${DB_CONSTS.RANGER_IS_ADMIN} = ?` +
                `  WHERE ${DB_CONSTS.RANGER_USERNAME} = ?`,
                [isAdmin ? 1 : 0, ranger.username]
            ).then(() => {
                ranger.isAdmin = isAdmin;
                resolve(ranger);
            }).catch(reject);
        });
    }
}

export class Ranger {

    static readonly VALID: number = 1;
    static readonly EXPIRED: number = 2;
    static readonly NEEDS_CONFIRMATION: number = 0;

    constructor(public name: string,
                public username: string,
                public email: string,
                public isAdmin: boolean,
                public state: number = Ranger.VALID) {
    }



    isExpired() {
        return this.state === Ranger.EXPIRED;
    }

    needsToResetPassword() {
        return this.state === Ranger.NEEDS_CONFIRMATION;
    }

    static readonly NULL_RANGER: Ranger = Ranger.makeNullRanger();

    static makeNullRanger(): Ranger {
        return new Ranger('', '', '', false, Ranger.EXPIRED);
    }

    static fromDatabaseQuery(item: any): Promise<Ranger> {
        return new Promise<Ranger>((resolve, reject) => {
            let ranger = new Ranger(
                item[DB_CONSTS.RANGER_NAME],
                item[DB_CONSTS.RANGER_USERNAME],
                item[DB_CONSTS.RANGER_EMAIL],
                item[DB_CONSTS.RANGER_IS_ADMIN],
                item[DB_CONSTS.RANGER_STATE]);

            let expiration: Date = item[DB_CONSTS.RANGER_EXPIRATION];
            if (expiration != null) {
                if (new Date(expiration).getTime() < Date.now()) {
                    ranger.state = Ranger.EXPIRED;
                }
                else {
                    ranger.state = Ranger.NEEDS_CONFIRMATION;
                }
            }
            console.log(ranger);
            resolve(ranger);
        });
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

    equals(ranger: Ranger): boolean {
        return !Object.keys(this).some((key) => {
            return this.hasOwnProperty(key) && this[key] !== ranger[key];
        });
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
    static readonly RANGER_STATE: string = 'state';
}
