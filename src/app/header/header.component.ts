import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import 'rxjs/add/operator/distinctUntilChanged';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'hn-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  logged: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    const isAuthenticatedSubscription = this.authService.isAuthenticated
      .distinctUntilChanged()
      .subscribe(isAuthenticated => {
        this.logged = isAuthenticated
      });

    this.subscriptions = [...this.subscriptions, isAuthenticatedSubscription];

  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}
