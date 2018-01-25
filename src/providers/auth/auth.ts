import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {DatabaseProvider} from "../database/database";

@Injectable()
export class AuthProvider {

  username: string = '';

  loggedIn(): boolean {
    return this.username !== '';
  }

  constructor(public http: HttpClient, private db: DatabaseProvider) {
    console.log('Hello AuthProvider Provider');
  }

  login(username: string, password: string): Promise<boolean> {
    let db = this.db;
    return new Promise<boolean>(function (resolve, reject) {
      db.authenticateUser(username, password).then(valid => {
        this.username = valid ? username : '';
        resolve(valid);
      })
        .catch(msg => {
          this.username = '';
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
