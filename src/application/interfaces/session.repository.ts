import { Session } from "@/src/domain/entities/session.entity";

export interface ISessionRepository {
  createSession(userId: string): Promise<Session>;
  getSession(sessionId: string): Promise<Session | null>;
  updateSession(
    sessionId: string,
    sessionData: Partial<Session>
  ): Promise<Session | null>;
  deleteSession(sessionId: string): Promise<void>;
}
