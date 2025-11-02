"use client";

import { SessionDto } from "@/src/application/dto/session/session.dto";
import { UserDto } from "@/src/application/dto/user/user.dto";
import { createContext, useContext } from "react";

type SessionContextType = {
  session: SessionDto | null;
  user: UserDto | null;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | null>(null);

const SessionProvider = ({
  session,
  user,
  signOut,
  children,
}: {
  session: SessionDto | null;
  user: UserDto | null;
  signOut: () => Promise<void>;
  children: React.ReactNode;
}) => {
  return (
    <SessionContext.Provider value={{ session, user, signOut }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export default SessionProvider;
