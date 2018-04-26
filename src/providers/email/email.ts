import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as querystring from 'query-string';
import * as config from '../../assets/config.json';

@Injectable()
export class EmailProvider {
    domain: string = (config['Email'])['url'];
    apiKey: string = (config['Email'])['apiKey'];

    constructor(public http: HttpClient) {
    }

    url(): string {
        return `https://api:${this.apiKey}@api.mailgun.net/v3/${this.domain}/messages`;
    }

    send(from: string, to: string, subject: string, message: string): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            if (self.apiKey === '') {
                reject('apiKey has not been set, so how was send called?');
            }
            let params = {
                from: from,
                to: to,
                subject: subject,
                text: message
            };

            this.http.post(self.url() + '?' + querystring.stringify(params), {})
                .subscribe(() => {
                    resolve(true);
                }, (error: HttpErrorResponse) => {
                    console.log(error.error.message);
                    reject('Unable to send confirmation email. Please make sure you are connected to the internet ' +
                        'and the email address is valid.');
                });
        });
    }
}
