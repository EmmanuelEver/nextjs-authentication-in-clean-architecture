import { User } from "@/src/domain/entities/user.entity";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  updateUser(userId: string, userData: User): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
