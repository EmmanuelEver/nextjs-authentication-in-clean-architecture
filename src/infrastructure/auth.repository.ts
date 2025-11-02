import { eq } from "drizzle-orm";
import { User, users } from "../lib/db/schema";
import { db } from "../lib/db";
import { comparePasswords } from "../lib/auth";
import { IAuthRepository } from "../application/interfaces/auth.repository";

export class AuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0] || null;
  }

  async signUp(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const [createdUser] = await db.insert(users).values(userData).returning();
    return createdUser;
  }

  async signIn(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
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
}
