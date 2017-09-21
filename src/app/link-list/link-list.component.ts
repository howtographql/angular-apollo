import {Component, OnDestroy, OnInit} from '@angular/core';
import {Apollo, ApolloQueryObservable} from 'apollo-angular';
import {Link} from '../types';
// 1
import {ALL_LINKS_QUERY, AllLinkQueryResponse, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION} from '../graphql';
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

    const allLinkQuery: ApolloQueryObservable<AllLinkQueryResponse> = this.apollo.watchQuery<AllLinkQueryResponse>({
      query: ALL_LINKS_QUERY
    });

    allLinkQuery
      .subscribeToMore({
        document: NEW_LINKS_SUBSCRIPTION,
        updateQuery: (previous, { subscriptionData }) => {
          const newAllLinks = [
            subscriptionData.data.Link.node,
            ...previous.allLinks
          ];
          return {
            ...previous,
            allLinks: newAllLinks
          }
        }
      });

    allLinkQuery
      .subscribeToMore({
        document: NEW_VOTES_SUBSCRIPTION,
        updateQuery: (previous, { subscriptionData }) => {
          const votedLinkIndex = previous.allLinks.findIndex(link =>
            link.id === subscriptionData.data.Vote.node.link.id);
          const link = subscriptionData.data.Vote.node.link;
          const newAllLinks = previous.allLinks.slice();
          newAllLinks[votedLinkIndex] = link;
          return {
            ...previous,
            allLinks: newAllLinks
          }
        }
      });

    const querySubscription = allLinkQuery.subscribe((response) => {
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
