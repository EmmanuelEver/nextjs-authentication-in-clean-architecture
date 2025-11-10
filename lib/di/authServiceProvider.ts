import { AuthUseCase } from "@/src/application/use-cases/auth.use-case";
import { AuthController } from "@/src/controllers/auth.controller";
import { AuthRepository } from "@/src/infrastructure/auth.repository";
import { SessionRepository } from "@/src/infrastructure/session.repository";
import UserRepository from "@/src/infrastructure/user.repository";

const userRepository = new UserRepository();
const sessionRepository = new SessionRepository();
const authRepository = new AuthRepository();

const authUseCase = new AuthUseCase(
  userRepository,
  sessionRepository,
  authRepository
);

export const authControllerInstance = new AuthController(authUseCase);
