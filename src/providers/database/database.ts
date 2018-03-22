import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {EmailProvider} from "../email/email";
import {NotificationProvider} from "../notification/notification";


@Injectable()
export class DatabaseProvider {
    static readonly AWS_URL: string = 'https://3ujc77b01b.execute-api.us-east-2.amazonaws.com/prod/';
    static readonly API_KEY: string = 'cdIRFxmAYK3JctGIHCyQE82XM3Nv5cwT9gJXzqiU';

    db: any = null;
    credentials: Credentials = null;

    constructor(public http: HttpClient,
                private email: EmailProvider,
                private notification: NotificationProvider) {
    }

    static api(http: HttpClient, lambda: string, functionName: string, args: Object = {}, otherHeaders: Object = {}): Promise<Object> {
        let headersObj = {
            'x-api-key': DatabaseProvider.API_KEY,
            'function-name': functionName,
            'args': JSON.stringify(args)
        };

        Object.assign(headersObj, otherHeaders);

        let headers = new HttpHeaders(headersObj);

        return new Promise<Object>((resolve, reject) => {
                http.post(
                    DatabaseProvider.AWS_URL + lambda,
                    {},
                    {headers: headers}
                ).subscribe((response: Object) => {
                    if (!response.hasOwnProperty('body')) {
                        let message = '';
                        if (response.hasOwnProperty('message')) {
                            message = response['message'];
                        }
                        else if (response.hasOwnProperty('errorMessage')) {
                            message = response['errorMessage'];
                        }
                        else if (response.hasOwnProperty('error')) {
                            message = response['error'];
                        }
                        else if (!response.hasOwnProperty('statusCode')) {
                            /* sometimes, for whatever reason, AWS sends back *just* the body without the fluff
                            around it. In this case, the whole response is really just the body. */
                            console.log('response', response);
                            resolve(response);
                            return;
                        }
                        else {
                            message = 'unknown error occurred. response: ' + JSON.stringify(response);
                        }
                        console.error(message);
                        reject(
                            'An error has occurred while attempting to process your request. Please try again later. ' +
                            'If the error persists, contact your IT administrator.');
                        return;
                    }
                    let body = JSON.parse(response['body']);
                    if (body.hasOwnProperty('error')) {
                        reject(body.error);
                        return;
                    }
                    resolve(body);
                }, error => {
                    reject(error.error.message);
                });
            }
        );
    }

    setCredentials(username: string, password: string = null) {
        if (username === null) {
            this.credentials = null;
        }
        else {
            this.credentials = new Credentials(username, password);
        }
    }

    _api(functionName: string, args: Object): Promise<Object> {
        return DatabaseProvider.api(this.http, 'ranger', functionName, args, this.credentials);
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

    resendConfirmationCode(ranger: Ranger): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            let args = {
                username: ranger.username
            };
            self._api('resetUnconfirmedPassword', args)
                .then((result) => {
                    self.sendConfirmationEmail(ranger, result['password'], result['expiration'])
                        .then(resolve).catch(reject);
                }).catch(reject);
        });
    }

    resetPassword(ranger: Ranger, newPassword: string): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>((resolve, reject) => {
            if (newPassword.length < 8) {
                reject('Password must be at least 8 characters in length');
                return;
            }
            if (self.credentials.password === newPassword) {
                reject('New password must not match current password');
                return;
            }
            let args = {
                newPassword: newPassword
            };
            self._api('resetPassword', args).then(() => {
                ranger.state = Ranger.VALID;
                resolve(ranger);
            }).catch(reject);
        });
    }

    deleteUser(ranger: Ranger): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            self._api('deleteUser', {username: ranger.username})
                .then(() => {
                    resolve(true);
                }).catch(reject);
        });
    }

    addUser(ranger: Ranger): Promise<Date> {
        let self = this;
        return new Promise<Date>((resolve, reject) => {
            self._api('addUser', {ranger: ranger})
                .then((result) => {
                    let expiration = new Date(result['expiration']);
                    this.sendConfirmationEmail(
                        ranger,
                        result['password'],
                        expiration)

                        .then(() => {
                            resolve(expiration);
                        }).catch((msg) => {
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
            self._api('getRangerNames', {}).then((result) => {
                resolve(result['names']);
            }).catch(reject);
        });
    }

    getRangerWithName(name: string): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>((resolve, reject) => {
            self._api('getRangerWithName', {name: name})
                .then(ranger => {
                    resolve(Ranger.fromObject(ranger));
                }).catch(reject);
        });
    }

    authenticate(): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>((resolve, reject) => {
            self._api('authenticate', {}).then(result => {
                let ranger = Ranger.fromObject(result['ranger']);
                self.email.apiKey = result['emailKey'];
                self.notification.apiKey = result['notificationKey'];
                if (ranger.state === Ranger.EXPIRED) {
                    reject('Temporary code has expired. Please have an admin recreate the account');
                }
                else {
                    resolve(ranger);
                }
            }).catch(msg => {
                console.error(msg);
                reject(msg);
            });
        });
    }

    updateAdminRights(ranger: Ranger, isAdmin: boolean): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>((resolve, reject) => {
            self._api(
                'updateAdminRights',
                {username: ranger.username, isAdmin: isAdmin})
                .then(() => {
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
    static readonly NULL_RANGER: Ranger = Ranger.makeNullRanger();

    constructor(public name: string,
                public username: string,
                public email: string,
                public isAdmin: boolean,
                public state: number = Ranger.VALID) {
    }

    static makeNullRanger(): Ranger {
        return new Ranger('', '', '', false, Ranger.EXPIRED);
    }

    static fromObject(obj): Ranger {
        return new Ranger(obj.name, obj.username, obj.email, obj.isAdmin, obj.state);
    }

    isExpired() {
        return this.state === Ranger.EXPIRED;
    }

    needsToResetPassword() {
        return this.state === Ranger.NEEDS_CONFIRMATION;
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
