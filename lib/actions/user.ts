import { AuthUseCase } from "@/src/application/use-cases/auth.use-case";
import { UserUseCase } from "@/src/application/use-cases/user.use-case";
import { AuthController } from "@/src/controllers/auth.controller";
import { AuthRepository } from "@/src/infrastructure/auth.repository";
import { SessionRepository } from "@/src/infrastructure/session.repository";
import UserRepository from "@/src/infrastructure/user.repository";
import { cookies } from "next/headers";

export const getUser = async () => {
  const authRepository = new AuthRepository();
  const userRepository = new UserRepository();
  const sessionRepository = new SessionRepository();
  const userUseCase = new UserUseCase(userRepository);
  const authUseCase = new AuthUseCase(authRepository, sessionRepository);
  const authController = new AuthController(authUseCase);
  try {
    const sessionId = (await cookies()).get("session")?.value;
    if (!sessionId) {
      return { success: false, message: "Session not found" };
    }
    const userSession = await authController.getUserSession(sessionId);

    if (!userSession) {
      return { success: false, message: "User not found" };
    }
    const user = await userRepository.findById(userSession.userId);
    return { success: true, user };
  } catch (error) {
    console.log({ error });
    return { success: false, message: (error as Error).message };
  }
};
