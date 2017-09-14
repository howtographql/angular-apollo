import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_LINK_MUTATION, CreateLinkMutationResponse} from '../graphql';

@Component({
  selector: 'create-link',
  templateUrl: './create-link.component.html',
  styleUrls: ['./create-link.component.css']
})
export class CreateLinkComponent implements OnInit {
  description: string = '';
  url: string = '';

  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
  }

  createLink() {
    this.apollo.mutate<CreateLinkMutationResponse>({
      mutation: CREATE_LINK_MUTATION,
      variables: {
        description: this.description,
        url: this.url
      }
    }).subscribe((response) => {

    });
  }
}
