import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {DatabaseProvider} from "../database/database";

@Injectable()
export class AuthProvider {

    username: string = '';

    constructor(public http: HttpClient, private db: DatabaseProvider) {
        console.log('Hello AuthProvider Provider');
    }

    loggedIn(): boolean {
        return this.username !== '';
    }

    login(username: string, password: string): Promise<boolean> {
        let self = this;
        return new Promise<boolean>(function (resolve, reject) {
            self.db.authenticateUser(username, password).then(valid => {
                self.username = valid ? username : '';
                resolve(valid);
            })
                .catch(msg => {
                    self.username = '';
                    reject(msg);
                });
        });
    }

    logout() {
        this.username = '';
    }

    register(username: string, password: string): Promise<boolean> {
        return this.db.registerUser(username, password);
    }

}
