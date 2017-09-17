import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {ALL_LINKS_QUERY, CREATE_LINK_MUTATION, CreateLinkMutationResponse} from '../graphql';
import {Router} from '@angular/router';

@Component({
  selector: 'hn-create-link',
  templateUrl: './create-link.component.html',
  styleUrls: ['./create-link.component.css']
})
export class CreateLinkComponent implements OnInit {
  description: string = '';
  url: string = '';

  constructor(private apollo: Apollo, private router: Router) {
  }

  ngOnInit() {
  }

  createLink() {
    this.apollo.mutate<CreateLinkMutationResponse>({
      mutation: CREATE_LINK_MUTATION,
      variables: {
        description: this.description,
        url: this.url
      },
      update: (store, { data: { createLink } }) => {
        const data: any = store.readQuery({
          query: ALL_LINKS_QUERY
        });

        data.allLinks.push(createLink);
        store.writeQuery({ query: ALL_LINKS_QUERY, data })
      },
    }).subscribe((response) => {
      // We injected the Router service
      this.router.navigate(['/']);
    });
  }
}
