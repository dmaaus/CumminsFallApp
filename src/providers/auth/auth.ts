import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {DatabaseProvider, Ranger} from "../database/database";

@Injectable()
export class AuthProvider {

    loggedInRanger: Ranger = Ranger.NULL_RANGER;

    constructor(public http: HttpClient, private db: DatabaseProvider) {
    }

    loggedIn(): boolean {
        return !this.loggedInRanger.equals(Ranger.NULL_RANGER);
    }

    login(username: string, password: string): Promise<Ranger> {
        let self = this;
        return new Promise<Ranger>(function (resolve, reject) {
            self.db.authenticateUser(username, password).then(ranger => {
                self.loggedInRanger = ranger;
                console.log('loggedInRange is now ' + self.loggedInRanger.toString());
                resolve(ranger);
            })
                .catch(msg => {
                    self.loggedInRanger = Ranger.NULL_RANGER;
                    console.log('loggedInRange is now null');
                    reject(msg);
                });
        });
    }

    resetPassword(oldPassword, newPassword): Promise<boolean> {
        return this.db.resetPassword(this.loggedInRanger.username, oldPassword, newPassword);
    }

    logout() {
        this.loggedInRanger = Ranger.NULL_RANGER;
    }
}
