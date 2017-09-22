import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Link} from '../types';
import {timeDifferenceForDate} from '../utils';
import {ALL_LINKS_QUERY, CREATE_VOTE_MUTATION} from '../graphql';
import {GC_USER_ID} from '../constants';
import {Apollo} from 'apollo-angular';
import {Subscription} from 'rxjs/Subscription';
import { LINKS_PER_PAGE } from '../constants'

@Component({
  selector: 'hn-link-item',
  templateUrl: './link-item.component.html',
  styleUrls: ['./link-item.component.css']
})
export class LinkItemComponent implements OnInit, OnDestroy {
  @Input()
  link: Link;

  @Input()
  index: number = 0;

  @Input()
  pageNumber: number = 0;

  @Input()
  isAuthenticated: boolean = false;

  linksPerPage = LINKS_PER_PAGE;
  subscriptions: Subscription[] = [];

  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
  }

  voteForLink() {
    const userId = localStorage.getItem(GC_USER_ID);
    const voterIds = this.link.votes.map(vote => vote.user.id);
    if (voterIds.includes(userId)) {
      alert(`User (${userId}) already voted for this link.`);
      return
    }
    const linkId = this.link.id;

    const mutationSubscription = this.apollo.mutate({
      mutation: CREATE_VOTE_MUTATION,
      variables: {
        userId,
        linkId
      },
      update: (store, { data: { createVote } }) => {
        this.updateStoreAfterVote(store, createVote, linkId);
      }
    })
      .subscribe();

    this.subscriptions = [...this.subscriptions, mutationSubscription];
  }

  updateStoreAfterVote (store, createVote, linkId) {
    // 1
    const data = store.readQuery({
      query: ALL_LINKS_QUERY
    });

    // 2
    const votedLink = data.allLinks.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    // 3
    store.writeQuery({ query: ALL_LINKS_QUERY, data })
  }

  humanizeDate(date: string) {
    return timeDifferenceForDate(date);
  }


  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}
