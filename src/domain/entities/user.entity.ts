export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
}

// Optional: A class for more complex business logic
export class UserEntity implements User {
  id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string, email: string, password: string, salt: string) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.salt = salt;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
