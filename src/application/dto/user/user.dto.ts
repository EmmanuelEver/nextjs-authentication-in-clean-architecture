import { User } from "@/src/domain/entities/user.entity";

export type UserDto = {
  name: string;
  email: string;
};

export type UpdateUserSchema = Partial<
  Omit<User, "id" | "createdAt" | "updatedAt" | "password" | "salt">
>;
