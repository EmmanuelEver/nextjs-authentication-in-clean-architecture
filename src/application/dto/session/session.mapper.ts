import { SessionDto } from "./session.dto";
import { Session } from "@/src/domain/entities/session.entity";

export const toSessionDto = (session: Session): SessionDto => {
  return {
    id: session.id,
    userId: session.userId,
    issuedAt: session.issuedAt,
    expiresAt: session.expiresAt,
    lastActivityAt: session.lastActivityAt,
  };
};
