import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as generatePassword from 'generate-password';
import {EmailProvider} from "../email/email";
import {NotificationProvider} from "../notification/notification";


@Injectable()
export class DatabaseProvider {
    static readonly NEW_RANGER_EXPIRATION_IN_MINUTES: number = 15;
    static readonly AWS_URL: string = 'https://3ujc77b01b.execute-api.us-east-2.amazonaws.com/prod/ranger';
    static readonly API_KEY: string = 'cdIRFxmAYK3JctGIHCyQE82XM3Nv5cwT9gJXzqiU';

    db: any = null; // TODO remove
    ready: boolean = false;
    private credentials: Credentials = null;

    setCredentials(username: string, password: string = null) {
        if (username === null) {
            this.credentials = null;
        }
        else {
            this.credentials = new Credentials(username, password);
        }
    }

    constructor(
        public http: HttpClient,
        private email: EmailProvider,
        private notification: NotificationProvider) {
    }

    static getExpiration(): Date {
        let res = new Date();
        res.setMinutes(res.getMinutes() + DatabaseProvider.NEW_RANGER_EXPIRATION_IN_MINUTES);
        return res;
    }

    api(functionName: string, args: Object): Promise<Object> {
        let self = this;
        let headers = new HttpHeaders()
            .append('x-api-key', DatabaseProvider.API_KEY)
            .append('functionName', functionName)
            .append('username', this.credentials.username)
            .append('password', this.credentials.password)
            .append('args', JSON.stringify(args));

        return new Promise<Object>((resolve, reject) => {
                self.http.post(
                    DatabaseProvider.AWS_URL,
                    {},
                    {headers: headers}
                ).subscribe(resolve, function (error) {
                    reject(error.error.message);
                });
            }
        );
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
            let args = {
                ranger: ranger,
                newPassword: password
            };
            self.api('resetUnconfirmedPassword', args)
                .then((result) => {
                    self.sendConfirmationEmail(ranger, password, result['expiration'])
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
            let args = {
                oldPassword: oldPassword,
                newPassword: newPassword
            };
            self.api('resetPassword', args).then(() => {
                ranger.state = Ranger.VALID;
                resolve(ranger);
            }).catch(reject);
        });
    }

    deleteUser(ranger: Ranger): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            self.api('deleteUser', {ranger: ranger})
                .then(() => {
                    resolve(true);
                }).catch(reject);
        });
    }

    addUser(ranger: Ranger): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            self.api('addUser', {ranger: ranger})
                .then((result) => {
                    this.sendConfirmationEmail(
                        ranger,
                        result['password'],
                        result['expiration'])

                        .then(resolve).catch((msg) => {
                        reject(`A confirmation email could not be sent to ${ranger.name}` +
                            `because of the following error: ${msg}\n` +
                            `Please try again later.`);
                    });
                }).catch(reject);
        });
    }

    getRangerNames(): Promise<string[]> {
        let self = this;
        return new Promise<string[]>((resolve, reject) => {
            self.api('getRangerNames', {}).then((result) => {
                resolve(result['names']);
            }).catch(reject);
        });
    }

    getRangerWithName(name: string): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>((resolve, reject) => {
            self.api('getRangerWithName', {name: name})
                .then(ranger => {
                    resolve(ranger as Ranger);
                }).catch(reject);
        });
    }

    authenticate(): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>((resolve, reject) => {
            self.api('authenticate', {}).then(result => {
                let ranger: Ranger = result['ranger'] as Ranger;
                self.email.apiKey = result['emailKey'];
                self.notification.apiKey = result['notificationKey'];
                if (ranger.state === Ranger.EXPIRED) {
                    reject('Temporary code has expired. Please have an admin recreate the account');
                }
                else {
                    resolve(ranger);
                }
            }).catch(msg => {
                reject(msg);
            });
        });
    }

    updateAdminRights(ranger: Ranger, isAdmin: boolean): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>((resolve, reject) => {
            self.api('updateAdminRights', {ranger: ranger})
                .then(result => {
                    ranger.isAdmin = isAdmin;
                    resolve(ranger);
                }).catch(reject);
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

export class Credentials {
    constructor(public username: string, public password: string) {
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
