"use server";

import { treeifyError, z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OAuthProvider } from "@/src/lib/db/schema";
import { authControllerInstance } from "../di/authServiceProvider";

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
  try {
    const { name, email, password } = signUpSchema.parse({
      ...data,
    });

    const newUser = await authControllerInstance.signUp(name, email, password);

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
  try {
    const { email, password } = signInSchema.parse({
      ...data,
    });
    const userWithSession = await authControllerInstance.signIn(
      email,
      password
    );
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
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;
  if (!sessionId) {
    redirect("/sign-in"); // no session, just go home
  }

  try {
    await authControllerInstance.signOut(sessionId!);
    cookieStore.delete("session");
  } catch (error) {
    console.error("❌ Signout error:", error);
  }

  redirect("/sign-in");
};

export const getUserSession = async () => {
  try {
    const sessionId = (await cookies()).get("session")?.value;
    if (!sessionId) {
      return { success: false, message: "Session not found" };
    }
    const { session, user } = await authControllerInstance.getUserSession(
      sessionId
    );
    if (!session) {
      return { success: false, message: "Session not found" };
    }
    return { success: true, session, user };
  } catch (error) {
    console.log({ error });
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    return { success: false, message: (error as Error).message };
  }
};

export const signInWithGoogle = async () => {
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set(
    "client_id",
    process.env.GOOGLE_OAUTH_CLIENT_ID!
  );
  googleAuthUrl.searchParams.set(
    "redirect_uri",
    process.env.GOOGLE_OAUTH_REDIRECT_URI!
  );
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "email profile");
  redirect(googleAuthUrl.toString());
};

export const signUpIfNotExists = async ({
  email,
  name,
  strategy,
  providerAccountId,
}: {
  email: string;
  name: string;
  strategy: OAuthProvider;
  providerAccountId: string;
}) => {
  try {
    const { user, session } = await authControllerInstance.oAuthSignIn({
      email,
      name,
      strategy,
      providerAccountId,
    });
    if (user && session) {
      const cookieStore = await cookies();
      cookieStore.set("session", session.id, {
        httpOnly: true,
        secure: true,
        expires: session.expiresAt,
        sameSite: "lax",
        path: "/",
      });
      return { success: true, user: user, session: session };
    }
    return { success: false, message: "User not found" };
  } catch (error) {
    console.log({ error });
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    return { success: false, message: (error as Error).message };
  }
};
