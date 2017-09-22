import {Component, OnDestroy, OnInit} from '@angular/core';
import {Apollo, ApolloQueryObservable} from 'apollo-angular';
import {Link} from '../types';
import {ALL_LINKS_QUERY, AllLinkQueryResponse, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION} from '../graphql';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/switch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';
import {LINKS_PER_PAGE} from '../constants';
import {Observable} from 'rxjs/Observable';
import _ from 'lodash';

@Component({
  selector: 'hn-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.css']
})
export class LinkListComponent implements OnInit, OnDestroy {
  allLinks: Link[] = [];
  loading: boolean = true;
  linksPerPage = LINKS_PER_PAGE;
  count = 0;

  logged: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(private apollo: Apollo,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {

    this.authService.isAuthenticated
      .distinctUntilChanged()
      .subscribe(isAuthenticated => {
        this.logged = isAuthenticated
      });

    // 0
    const pageParams$: Observable<number> = this.route.paramMap
      .map((params) => {
        return parseInt(params.get('page'), 10);
      });

    // 1
    const path$: Observable<string> = this.route.url
      .map((segments) => segments.toString());

    // 2
    const first$: Observable<number> = path$
      .map((path) => {
        const isNewPage = path.includes('new');
        return isNewPage ? this.linksPerPage : 100;
      });

    // 3
    const skip$: Observable<number> = Observable.combineLatest(path$, pageParams$)
      .map(([path, page]) => {
        const isNewPage = path.includes('new');
        return isNewPage ? (page - 1) * this.linksPerPage : 0;
      });

    // 4
    const orderBy$: Observable<string | null> = path$
      .map((path) => {
        const isNewPage = path.includes('new');
        return isNewPage ? 'createdAt_DESC' : null;
      });

    // 5
    const allLinkQuery: ApolloQueryObservable<AllLinkQueryResponse> = this.apollo.watchQuery<AllLinkQueryResponse>({
      query: ALL_LINKS_QUERY,
      variables: {
        first: first$,
        skip: skip$,
        orderBy: orderBy$
      }
    });

    // 6
    const querySubscription = allLinkQuery.subscribe((response) => {
      this.allLinks = response.data.allLinks;
      this.count = response.data._allLinksMeta.count;
      this.loading = response.data.loading;
    });

    // Comment due to issue : https://github.com/kamilkisiela/apollo-client-rxjs/issues/37
    // allLinkQuery
    //   .subscribeToMore({
    //     document: NEW_LINKS_SUBSCRIPTION,
    //     updateQuery: (previous, { subscriptionData }) => {
    //       const newAllLinks = [
    //         subscriptionData.data.Link.node,
    //         ...previous.allLinks
    //       ];
    //       return {
    //         ...previous,
    //         allLinks: newAllLinks
    //       }
    //     }
    //   });
    //
    // allLinkQuery
    //   .subscribeToMore({
    //     document: NEW_VOTES_SUBSCRIPTION,
    //     updateQuery: (previous, { subscriptionData }) => {
    //       const votedLinkIndex = previous.allLinks.findIndex(link =>
    //         link.id === subscriptionData.data.Vote.node.link.id);
    //       const link = subscriptionData.data.Vote.node.link;
    //       const newAllLinks = previous.allLinks.slice();
    //       newAllLinks[votedLinkIndex] = link;
    //       return {
    //         ...previous,
    //         allLinks: newAllLinks
    //       }
    //     }
    //   });

    this.subscriptions = [...this.subscriptions, querySubscription];

  }

  get orderedLinks(): Observable<Link[]> {
    return this.route.url
      .map((segments) => segments.toString())
      .map(path => {
        if (path.includes('top')) {
          return _.orderBy(this.allLinks, 'votes.length').reverse()
        } else {
          return this.allLinks
        }
      })
  }

  get isFirstPage(): Observable<boolean> {
    return this.route.paramMap
      .map((params) => {
        return parseInt(params.get('page'), 10);
      })
      .map(page => page === 1)
  }

  get isNewPage(): Observable<boolean> {
    return this.route.url
      .map((segments) => segments.toString())
      .map(path => path.includes('new'))
  }

  get pageNumber(): Observable<number> {
    return this.route.paramMap
      .map((params) => {
        return parseInt(params.get('page'), 10);
      });
  }

  get morePages(): Observable<boolean> {
    return this.pageNumber.map(pageNumber => pageNumber < this.count / this.linksPerPage);
  }

  nextPage() {
    const page = parseInt(this.route.snapshot.params.page, 10);
    if (page < this.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      this.router.navigate([`/new/${nextPage}`])
    }
  }


  previousPage() {
    const page = parseInt(this.route.snapshot.params.page, 10);
    if (page > 1) {
      const previousPage = page - 1;
      this.router.navigate([`/new/${previousPage}`])
    }
  }

  getLinksToRender(isNewPage: boolean): Link[] {
    if (isNewPage) {
      return this.allLinks;
    }
    const rankedLinks = this.allLinks.slice();
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
    return rankedLinks
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}
