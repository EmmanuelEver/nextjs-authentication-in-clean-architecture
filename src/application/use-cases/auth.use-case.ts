import { toUserDto } from "../dto/user/user.mapper";
import { UserDto } from "../dto/user/user.dto";
import { generateSalt, hashPassword } from "@/src/lib/auth";
import { ISessionRepository } from "../interfaces/session.repository";
import { SessionDto } from "../dto/session/session.dto";
import { toSessionDto } from "../dto/session/session.mapper";
import { UnauthenticatedError } from "@/src/domain/errors/auth.errors";
import { IUserRepository } from "../interfaces/user.repositry";
import { IAuthRepository } from "../interfaces/auth.repository";
import { OAuthProvider } from "@/src/lib/db/schema";

export class AuthUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly authRepository: IAuthRepository
  ) {}

  async signUp(
    name: string,
    email: string,
    password: string
  ): Promise<UserDto> {
    // Check if a user with this email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UnauthenticatedError("User with this email already exists.");
    }
    try {
      // Hash the password securely
      const salt = generateSalt();
      const hashedPassword = await hashPassword(password, salt);

      // Create the user using the interface
      const newUser = await this.userRepository.createUser({
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
    const user = await this.authRepository.signInEmailPassword(email, password);
    if (!user) {
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

  async getUserSession(
    sessionId: string
  ): Promise<{ user: UserDto; session: SessionDto }> {
    try {
      const session = await this.sessionRepository.getSession(sessionId);
      if (!session) {
        throw new UnauthenticatedError("Session not found");
      }
      const user = await this.userRepository.findById(session.userId);
      if (!user) {
        throw new UnauthenticatedError("User not found");
      }
      return {
        user: toUserDto(user),
        session: toSessionDto(session),
      };
    } catch (error) {
      console.error("Get user session error:", error);
      throw new UnauthenticatedError("Failed to get user session");
    }
  }

  async oAuthSignIn({
    email,
    name,
    strategy,
    providerAccountId,
  }: {
    email: string;
    name: string;
    strategy: OAuthProvider;
    providerAccountId: string;
  }): Promise<{ user: UserDto; session: SessionDto }> {
    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      user = await this.userRepository.createUser({ email, name });
    }
    if (!user) {
      throw new UnauthenticatedError("Failed to create user");
    }

    const session = await this.sessionRepository.createSession(user.id);
    if (!session) {
      throw new UnauthenticatedError("Failed to create session");
    }
    await this.authRepository.createOAuthAccount(
      user.id,
      strategy,
      providerAccountId
    );
    return {
      user: toUserDto(user),
      session: toSessionDto(session),
    };
  }
}
