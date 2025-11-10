import { NextResponse } from "next/server";
// Your getUserSession function that uses the crypto library
import { getUserSession as getInternalSession } from "@/lib/actions/auth";

export async function GET() {
  const { success, session, user } = await getInternalSession();

  // Return a success status if the session is valid
  if (success) {
    return NextResponse.json({
      success: true,
      session: session,
      user: user,
    });
  }
  // Return an unauthorized status if the session is invalid
  return NextResponse.json({ success: false }, { status: 401 });
}
