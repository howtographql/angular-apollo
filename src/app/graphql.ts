import {Link} from './types';
// 1
import gql from 'graphql-tag'

// 2
export const ALL_LINKS_QUERY = gql`
  query AllLinksQuery {
    allLinks {
      id
      createdAt
      url
      description
    }
  }
`;

//3
export interface AllLinkQueryResponse {
  allLinks: Link[];
  loading: boolean;
}


// 1
export const CREATE_LINK_MUTATION = gql`
  # 2
  mutation CreateLinkMutation($description: String!, $url: String!) {
    createLink(
      description: $description,
      url: $url,
    ) {
      id
      createdAt
      url
      description
    }
  }
`;

//3
export interface CreateLinkMutationResponse {
  createLink: Link;
  loading: boolean;
}
