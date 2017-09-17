import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {GC_AUTH_TOKEN, GC_USER_ID} from './constants';

@Injectable()
export class AuthService {
  private userId: string = null;

  private _isAuthenticated = new BehaviorSubject(false);

  constructor() {
  }

  // Providing a observable to listen the authentication state
  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  setUserId(id: string) {
    this.userId = id;

    // Dispatching to all listeners that the user is authenticated
    this._isAuthenticated.next(true);
  }

  saveUserData(id: string, token: string) {

    localStorage.setItem(GC_USER_ID, id);
    localStorage.setItem(GC_AUTH_TOKEN, token);
    this.setUserId(id);
  }

  logout() {
    // Removing user data from local storage and the service
    localStorage.removeItem(GC_USER_ID);
    localStorage.removeItem(GC_AUTH_TOKEN);
    this.userId = null;

    // Dispatching to all listeners that the user is not authenticated
    this._isAuthenticated.next(false);
  }

  autoLogin() {
    const id = localStorage.getItem(GC_USER_ID);

    if (id) {
      this.setUserId(id);
    }
  }
}
