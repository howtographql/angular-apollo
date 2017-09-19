import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Apollo} from 'apollo-angular';
import {Subscription} from 'rxjs/Subscription';
import {Link} from '../types';
// 2
import {ALL_LINKS_SEARCH_QUERY, AllLinksSearchQueryResponse} from '../graphql';

@Component({
  selector: 'hn-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  allLinks: Link[] = [];
  loading: boolean = true;
  searchText: string = '';

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

  }

  // 3
  executeSearch() {
    if (!this.searchText) {
      return;
    }

    const querySubscription = this.apollo.watchQuery<AllLinksSearchQueryResponse>({
      query: ALL_LINKS_SEARCH_QUERY,
      variables: {
        searchText: this.searchText
      },
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

