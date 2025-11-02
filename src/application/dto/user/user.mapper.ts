import { User } from "@/src/domain/entities/user.entity";
import { UserDto } from "./user.dto";

export const toUserDto = (user: User): UserDto => {
  return {
    name: user.name,
    email: user.email,
  };
};
