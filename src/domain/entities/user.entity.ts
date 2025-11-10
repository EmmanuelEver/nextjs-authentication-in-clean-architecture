export interface User {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  salt?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
