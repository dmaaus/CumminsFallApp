import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {DatabaseProvider, Ranger} from "../database/database";

@Injectable()
export class AuthProvider {

    ranger: Ranger = null;

    constructor(public http: HttpClient, private db: DatabaseProvider) {
    }

    loggedIn(): boolean {
        return this.ranger !== null;
    }

    login(username: string, password: string): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>(function (resolve, reject) {
            self.db.authenticateUser(username, password).then(ranger => {
                self.ranger = ranger;
                resolve(ranger);
            })
                .catch(msg => {
                    self.ranger = null;
                    reject(msg);
                });
        });
    }

    resetPassword(oldPassword, newPassword): Promise<boolean> {
        return this.db.resetPassword(this.ranger.username, oldPassword, newPassword);
    }

    logout() {
        this.ranger = null;
    }
}
