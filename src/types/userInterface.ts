export interface Role {
  id: number;
  name: string;
  description: string;
}
export interface User {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  roles: Role[];
}

export interface UserInput {
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
}
