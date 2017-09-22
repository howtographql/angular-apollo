import {Link, User, Vote} from './types';
// 1
import gql from 'graphql-tag'

// 2
export const ALL_LINKS_QUERY = gql`
  query AllLinksQuery($first: Int, $skip: Int, $orderBy: LinkOrderBy) {
    allLinks(first: $first, skip: $skip, orderBy: $orderBy) {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
    _allLinksMeta {
      count
    }
  }
`;

export interface AllLinkQueryResponse {
  allLinks: Link[];
  _allLinksMeta: { count: number };
  loading: boolean;
}


// 1
export const CREATE_LINK_MUTATION = gql`
  # 2
  mutation CreateLinkMutation($description: String!, $url: String!, $postedById: ID!) {
    createLink(
      description: $description,
      url: $url,
      postedById: $postedById
    ) {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
    }
  }
`;

//3
export interface CreateLinkMutationResponse {
  createLink: Link;
  loading: boolean;
}

// ...
export const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($name: String!, $email: String!, $password: String!) {
    createUser(
      name: $name,
      authProvider: {
        email: {
          email: $email,
          password: $password
        }
      }
    ) {
      id
    }

    signinUser(email: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
      }
    }
  }
`;

export interface CreateUserMutationResponse {
  loading: boolean;
  createUser: User;
  signinUser: {
    token: string,
    user?: User
  };
}

export const SIGNIN_USER_MUTATION = gql`
  mutation SigninUserMutation($email: String!, $password: String!) {
    signinUser(email: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
      }
    }
  }
`;


export interface SigninUserMutationResponse {
  loading: boolean;
  signinUser: {
    token: string,
    user?: User
  };
}


export const CREATE_VOTE_MUTATION = gql`
  mutation CreateVoteMutation($userId: ID!, $linkId: ID!) {
    createVote(userId: $userId, linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

export interface CreateVoteMutationResponse {
  loading: boolean;
  createVote: {
    id: string;
    link: Link;
    user: User;
  };
}


export const ALL_LINKS_SEARCH_QUERY = gql`
  query AllLinksSearchQuery($searchText: String!) {
    allLinks(filter: {
      OR: [{
        url_contains: $searchText
      }, {
        description_contains: $searchText
      }]
    }) {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

export interface AllLinksSearchQueryResponse {
  loading: boolean;
  allLinks: Link[];
}

export const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    Link(filter: {
      mutation_in: [CREATED]
    }) {
      node {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

export interface NewLinkSubcriptionResponse {
  node: Link;
}


export const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    Vote(filter: {
      mutation_in: [CREATED]
    }) {
      node {
        id
        link {
          id
          url
          description
          createdAt
          postedBy {
            id
            name
          }
          votes {
            id
            user {
              id
            }
          }
        }
        user {
          id
        }
      }
    }
  }
`;

export interface NewVoteSubcriptionResponse {
  node: Vote;
}
