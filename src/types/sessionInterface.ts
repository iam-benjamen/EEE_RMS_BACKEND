export interface Session {
  id: number;
  date: string;
  current: boolean;
}

export interface SessionInput {
  date: string;
  current: boolean;
}
