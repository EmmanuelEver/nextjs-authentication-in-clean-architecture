import { User } from "@/src/domain/entities/user.entity";

export interface IAuthRepository {
  signInEmailPassword(email: string, password: string): Promise<User | null>;
  createOAuthAccount(
    userId: string,
    provider: string,
    providerAccountId: string
  ): Promise<void>;
}
