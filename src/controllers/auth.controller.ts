import { AuthUseCase } from "../application/use-cases/auth.use-case";
import { OAuthProvider } from "../lib/db/schema";

export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  async signUp(name: string, email: string, password: string) {
    return this.authUseCase.signUp(name, email, password);
  }

  async signIn(email: string, password: string) {
    return this.authUseCase.signIn(email, password);
  }

  async signOut(sessionId: string) {
    return this.authUseCase.signOut(sessionId);
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
  }) {
    return this.authUseCase.oAuthSignIn({
      email,
      name,
      strategy,
      providerAccountId,
    });
  }

  async getUserSession(sessionId: string) {
    return this.authUseCase.getUserSession(sessionId);
  }
}
