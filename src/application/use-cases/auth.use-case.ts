import { toUserDto } from "../dto/user/user.mapper";
import { UserDto } from "../dto/user/user.dto";
import { generateSalt, hashPassword, comparePasswords } from "@/src/lib/auth";
import { IAuthRepository } from "../interfaces/auth.repository";
import { ISessionRepository } from "../interfaces/session.repository";
import { SessionDto } from "../dto/session/session.dto";
import { toSessionDto } from "../dto/session/session.mapper";
import { UnauthenticatedError } from "@/src/domain/errors/auth.errors";

export class AuthUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly sessionRepository: ISessionRepository
  ) {}

  async signUp(
    name: string,
    email: string,
    password: string
  ): Promise<UserDto> {
    // Check if a user with this email already exists
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new UnauthenticatedError("User with this email already exists.");
    }
    try {
      // Hash the password securely
      const salt = generateSalt();
      const hashedPassword = await hashPassword(password, salt);

      // Create the user using the interface
      const newUser = await this.authRepository.signUp({
        name,
        email,
        password: hashedPassword,
        salt,
      });
      if (!newUser) {
        throw new UnauthenticatedError("Failed to create user");
      }
      return toUserDto(newUser);
    } catch (error) {
      console.error("Sign up error:", error);
      throw new UnauthenticatedError("Failed to create user");
    }
  }

  async signIn(
    email: string,
    password: string
  ): Promise<{ user: UserDto; session: SessionDto }> {
    // Check if a user with this email already exists
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new UnauthenticatedError("Invalid email or password");
    }

    try {
      const isPasswordValid = await comparePasswords({
        password,
        salt: user.salt,
        hashedPassword: user.password,
      });
      if (!isPasswordValid) {
        throw new UnauthenticatedError("Invalid email or password");
      }
      const session = await this.sessionRepository.createSession(user.id);
      if (!session) {
        throw new UnauthenticatedError("Failed to create session");
      }
      return {
        user: toUserDto(user),
        session: toSessionDto(session),
      };
    } catch (error) {
      console.error("Sign in error:", error);
      throw new UnauthenticatedError("Invalid email or password");
    }
  }

  async signOut(sessionId: string): Promise<void> {
    try {
      const session = await this.sessionRepository.getSession(sessionId);
      if (!session) {
        throw new UnauthenticatedError("Session not found");
      }

      await this.sessionRepository.deleteSession(sessionId);
    } catch (error) {
      console.error("Sign out error:", error);
      throw new UnauthenticatedError("Failed to sign out");
    }
  }

  async getUserSession(sessionId: string): Promise<SessionDto> {
    try {
      const session = await this.sessionRepository.getSession(sessionId);
      if (!session) {
        throw new UnauthenticatedError("Session not found");
      }
      return toSessionDto(session);
    } catch (error) {
      console.error("Get user session error:", error);
      throw new UnauthenticatedError("Failed to get user session");
    }
  }
}
