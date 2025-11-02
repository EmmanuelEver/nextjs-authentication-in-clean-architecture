import Header from "@/components/header";
import SessionProvider from "@/nextjs-contexts/SessionProvider";
import { getUserSession, signout } from "@/lib/actions/auth";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await getUserSession();

  const user = result.success ? result.user : null;
  const session = result.success ? result.session : null;

  return (
    <SessionProvider
      session={session ?? null}
      user={user ?? null}
      signOut={signout}
    >
      <div className="min-h-screen">
        <Header />
        {children}
      </div>
    </SessionProvider>
  );
}
