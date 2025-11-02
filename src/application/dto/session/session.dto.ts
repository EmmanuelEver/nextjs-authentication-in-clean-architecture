export type SessionDto = {
  id: string;
  userId: string;
  issuedAt: Date;
  expiresAt: Date;
  lastActivityAt: Date;
};
