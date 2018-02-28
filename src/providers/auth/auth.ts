import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {DatabaseProvider, Ranger} from "../database/database";

@Injectable()
export class AuthProvider {

    loggedInRanger: Ranger = Ranger.makeNullRanger();

    constructor(public http: HttpClient, private db: DatabaseProvider) {
    }

    loggedIn(): boolean {
        return !this.loggedInRanger.equals(Ranger.NULL_RANGER);
    }

    login(username: string, password: string): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>(function (resolve, reject) {
            self.db.setCredentials(username, password);
            self.db.authenticate().then(ranger => {
                self.loggedInRanger = ranger;
                console.log('loggedInRanger is now ' + self.loggedInRanger.toString());
                resolve(ranger);
            })
                .catch(msg => {
                    self.logout();
                    console.log('loggedInRanger is now null');
                    reject(msg);
                });
        });
    }

    resetPassword(oldPassword: string, newPassword: string): Promise<boolean> {
        let self = this;
        return new Promise<boolean>((resolve, reject) => {
            self.db.resetPassword(self.loggedInRanger, oldPassword, newPassword).then((ranger) => {
                self.loggedInRanger = ranger;
                self.db.setCredentials(ranger.username, newPassword);
                resolve(true);
            }).catch(reject);
        });
    }

    logout() {
        this.loggedInRanger = Ranger.makeNullRanger();
        this.db.setCredentials(null);
    }
}
