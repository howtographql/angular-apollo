import {Component, OnDestroy, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {ALL_LINKS_QUERY, CREATE_LINK_MUTATION, CreateLinkMutationResponse} from '../graphql';
import {Router} from '@angular/router';
import {GC_USER_ID} from '../constants';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'hn-create-link',
  templateUrl: './create-link.component.html',
  styleUrls: ['./create-link.component.css']
})
export class CreateLinkComponent implements OnInit, OnDestroy {
  description: string = '';
  url: string = '';

  subscriptions: Subscription[] = [];

  constructor(private apollo: Apollo, private router: Router) {
  }

  ngOnInit() {
  }

  createLink() {
    const postedById = localStorage.getItem(GC_USER_ID);
    if (!postedById) {
      console.error('No user logged in');
      return
    }

    const newDescription = this.description;
    const newUrl = this.url;
    this.description = '';
    this.url = '';

    const createMutationSubscription = this.apollo.mutate<CreateLinkMutationResponse>({
      mutation: CREATE_LINK_MUTATION,
      variables: {
        description: newDescription,
        url: newUrl,
        postedById
      },
      update: (store, { data: { createLink } }) => {
        const data: any = store.readQuery({
          query: ALL_LINKS_QUERY,
          variables: {
            first: 5,
            skip: 0,
            orderBy: 'createdAt_DESC'
          }
        });

        data.allLinks.push(createLink);
        store.writeQuery({
          query: ALL_LINKS_QUERY,
          variables: {
            first: 5,
            skip: 0,
            orderBy: 'createdAt_DESC'
          },
          data
        })
      },
    }).subscribe((response) => {
      // We injected the Router service
      this.router.navigate(['/']);
    }, (error) => {
      console.error(error);
      this.description = newDescription;
      this.url = newUrl;
    });

    this.subscriptions = [...this.subscriptions, createMutationSubscription];
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}
