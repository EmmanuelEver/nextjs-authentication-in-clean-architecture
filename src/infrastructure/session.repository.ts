import { eq } from "drizzle-orm";
import { ISessionRepository } from "../application/interfaces/session.repository";
import { Session } from "../domain/entities/session.entity";
import { generateSessionId } from "../lib/auth";
import { db } from "../lib/db";
import { sessions } from "../lib/db/schema";

export class SessionRepository implements ISessionRepository {
  async createSession(userId: string): Promise<Session> {
    const sessionId = generateSessionId();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    const lastActivityAt = new Date();

    const [createdSession] = await db
      .insert(sessions)
      .values({
        id: sessionId,
        userId,
        issuedAt: createdAt,
        expiresAt,
        lastActivityAt,
      })
      .returning();

    return createdSession as Session;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    return session ?? null;
  }

  async updateSession(
    sessionId: string,
    sessionData: Partial<Session>
  ): Promise<Session | null> {
    const [updatedSession] = await db
      .update(sessions)
      .set(sessionData)
      .where(eq(sessions.id, sessionId))
      .returning();

    return updatedSession ?? null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }
}
