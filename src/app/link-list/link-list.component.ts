import {Component, OnDestroy, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Link} from '../types';
// 1
import {ALL_LINKS_QUERY, AllLinkQueryResponse} from '../graphql';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'hn-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.css']
})
export class LinkListComponent implements OnInit, OnDestroy {
  allLinks: Link[] = [];
  loading: boolean = true;

  logged: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(private apollo: Apollo, private authService: AuthService) {
  }

  ngOnInit() {

    this.authService.isAuthenticated
      .distinctUntilChanged()
      .subscribe(isAuthenticated => {
        this.logged = isAuthenticated
      });

    const querySubscription = this.apollo.watchQuery<AllLinkQueryResponse>({
      query: ALL_LINKS_QUERY
    }).subscribe((response) => {
      this.allLinks = response.data.allLinks;
      this.loading = response.data.loading;
    });

    this.subscriptions = [...this.subscriptions, querySubscription];

  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}
