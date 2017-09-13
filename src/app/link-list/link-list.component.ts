import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Link} from '../types';
// 1
import {ALL_LINKS_QUERY, AllLinkQueryResponse} from '../graphql';

@Component({
  selector: 'link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.css']
})
export class LinkListComponent implements OnInit {
  // 2
  allLinks: Link[] = [];
  loading: boolean = true;

  // 3
  constructor(private apollo: Apollo) {
  }

  ngOnInit() {

    // 4
    this.apollo.query<AllLinkQueryResponse>({
      query: ALL_LINKS_QUERY
    }).subscribe((response) => {
      // 5
      this.allLinks = response.data.allLinks;
      this.loading = response.data.loading;
    });

  }

}
