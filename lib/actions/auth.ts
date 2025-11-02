"use server";

import { AuthRepository } from "@/src/infrastructure/auth.repository";
import { treeifyError, z } from "zod";
import { AuthUseCase } from "@/src/application/use-cases/auth.use-case";
import { SessionRepository } from "@/src/infrastructure/session.repository";
import { AuthController } from "@/src/controllers/auth.controller";
import { cookies } from "next/headers";
import UserRepository from "@/src/infrastructure/user.repository";
import { UserUseCase } from "@/src/application/use-cases/user.use-case";
import { redirect } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character"
  );

const signUpSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signup = async (data: z.infer<typeof signUpSchema>) => {
  const userRepository = new AuthRepository();
  const sessionRepository = new SessionRepository();
  const signupUserUseCase = new AuthUseCase(userRepository, sessionRepository);
  const authController = new AuthController(signupUserUseCase);
  try {
    const { name, email, password } = signUpSchema.parse({
      ...data,
    });

    const newUser = await authController.signUp(name, email, password);

    console.log("User registered successfully:", newUser);
    return { success: true };
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return { success: false, errors: treeifyError(error) };
    }
    return { success: false, message: (error as Error).message };
  }
};

export const signin = async (data: z.infer<typeof signInSchema>) => {
  const userRepository = new AuthRepository();
  const sessionRepository = new SessionRepository();
  const authUseCase = new AuthUseCase(userRepository, sessionRepository);
  const authController = new AuthController(authUseCase);
  try {
    const { email, password } = signInSchema.parse({
      ...data,
    });
    const userWithSession = await authController.signIn(email, password);
    if (!userWithSession?.user) {
      return { success: false, message: "Invalid email or password" };
    }
    const cookieStore = await cookies();
    cookieStore.set("session", userWithSession.session.id, {
      httpOnly: true,
      secure: true,
      expires: userWithSession.session.expiresAt,
      sameSite: "lax",
      path: "/",
    });
    return { success: true };
  } catch (error) {
    console.log({ error });
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    return { success: false, message: (error as Error).message };
  }
};

export const signout = async () => {
  const userRepository = new AuthRepository();
  const sessionRepository = new SessionRepository();
  const authUseCase = new AuthUseCase(userRepository, sessionRepository);
  const authController = new AuthController(authUseCase);
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;
  if (!sessionId) {
    redirect("/sign-in"); // no session, just go home
  }

  try {
    await authController.signOut(sessionId!);
    cookieStore.delete("session");
  } catch (error) {
    console.error("❌ Signout error:", error);
  }

  redirect("/sign-in");
};

export const getUserSession = async () => {
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
    const session = await authController.getUserSession(sessionId);
    if (!session) {
      return { success: false, message: "Session not found" };
    }
    const user = await userUseCase.findById(session.userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }
    return { success: true, user: user, session: session };
  } catch (error) {
    console.log({ error });
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    return { success: false, message: (error as Error).message };
  }
};
