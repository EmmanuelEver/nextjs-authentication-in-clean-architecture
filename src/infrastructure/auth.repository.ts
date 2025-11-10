import { eq } from "drizzle-orm";
import {
  OAuthProvider,
  User,
  userOAuthAccounts,
  users,
} from "../lib/db/schema";
import { db } from "../lib/db";
import { comparePasswords } from "../lib/auth";
import { IAuthRepository } from "../application/interfaces/auth.repository";

export class AuthRepository implements IAuthRepository {
  async signInEmailPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.password || !user.salt) {
      return null;
    }
    const isPasswordValid = await comparePasswords({
      password,
      salt: user.salt,
      hashedPassword: user.password,
    });
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  async createOAuthAccount(
    userId: string,
    provider: OAuthProvider,
    providerAccountId: string
  ): Promise<void> {
    await db
      .insert(userOAuthAccounts)
      .values({
        userId,
        provider,
        providerAccountId,
      })
      .onConflictDoNothing();
  }
}
