// src/interfaces/userInterface.ts
export type Role =
  | "departmental_lecturer"
  | "level_coordinator"
  | "super_admin";

export interface User {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  roles: Role[];
}

export interface UserInput {
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  roles: Role[];
}
