import { User } from "../domain/entities/user.entity";
import { users } from "../lib/db/schema";
import { db } from "../lib/db";
import { eq } from "drizzle-orm";
import { IUserRepository } from "../application/interfaces/user.repositry";

class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }
  async updateUser(userId: string, user: User): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }
  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
    return;
  }
}

export default UserRepository;
