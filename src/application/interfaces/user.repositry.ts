import { User } from "@/src/domain/entities/user.entity";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updateUser(userId: string, userData: User): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
