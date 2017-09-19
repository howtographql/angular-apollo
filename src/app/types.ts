export class Link {
  id?: string;
  description?: string;
  url?: string;
  createdAt?: string;
  postedBy?: User;
  votes?: Vote[];
}

export class User {
  id?: string;
  name?: string;
  email?: string;
  votes?: Vote[];
}

export class Vote {
  id?: string;
  user?: User;
  link?: Link;
}
