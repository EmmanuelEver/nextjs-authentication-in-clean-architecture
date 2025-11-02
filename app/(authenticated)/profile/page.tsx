import { getUserSession } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getUserSession();
  if (!session.success) redirect("/sign-in");
  return <div className="w-full min-h-screen p-10  bg-gray-100"></div>;
}
