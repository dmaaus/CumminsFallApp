import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as querystring from 'query-string';


/*
  Generated class for the EmailProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EmailProvider {

    // TODO apiKey should be grabbed from server
    domain: string = 'sandboxff0637d7099b4069b7410adb473f3bfd.mailgun.org';
    apiKey: string = 'key-9b10dcf96845d9e84a8a3306ddfa2d87';

    url: string = `https://api:${this.apiKey}@api.mailgun.net/v3/${this.domain}/messages`;

    constructor(public http: HttpClient) {
        console.log('Hello EmailProvider Provider');
    }

    send(from: string, to: string, subject: string, message: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let params = {
                from: from,
                to: to,
                subject: subject,
                text: message
            };

            this.http.post(this.url + '?' + querystring.stringify(params), {})
                .subscribe(() => {
                    resolve(true);
                }, (error: HttpErrorResponse) => {
                    console.log(error.error.message);
                    reject('Unable to send confirmation email. Please make sure you are connected to the Internet ' +
                        'and the email address is valid.');
                });
        });
    }
}
