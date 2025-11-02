import { UpdateUserSchema, UserDto } from "../dto/user/user.dto";
import { toUserDto } from "../dto/user/user.mapper";
import { NotFoundError } from "@/src/domain/errors/commons.errors";
import { IUserRepository } from "../interfaces/user.repositry";

export class UserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async findById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return toUserDto(user);
  }

  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return toUserDto(user);
  }

  async updateUser(
    userId: string,
    userData: UpdateUserSchema
  ): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const updatedUser = await this.userRepository.updateUser(userId, {
      ...user,
      ...userData,
    });
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }
    return toUserDto(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    await this.userRepository.deleteUser(id);
  }
}
