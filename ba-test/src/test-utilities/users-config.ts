export interface User {
  role: string;
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  username: string;
  password: string;
}

export interface Students extends Record<string, User> {
  student1: User;
}

export interface Educators extends Record<string, User> {
  districtAdmin1: User;
}

export interface Users extends Students, Educators {}
