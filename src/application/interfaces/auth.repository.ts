import { User } from "@/src/domain/entities/user.entity";

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  signUp(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  signIn(email: string, password: string): Promise<User | null>;
}
