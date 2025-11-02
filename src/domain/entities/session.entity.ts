export interface Session {
  id: string;
  userId: string;
  issuedAt: Date;
  expiresAt: Date;
  lastActivityAt: Date;
}
