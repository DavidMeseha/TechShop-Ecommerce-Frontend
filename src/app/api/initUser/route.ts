import { checkTokenValidity } from "@/services/auth.service";
import createServerService from "@/services/server/createServerService";
import { NextResponse } from "next/server";

export async function GET() {
  const { token } = await createServerService();
  if (!token) return NextResponse.json(null, { status: 400 });

  try {
    const user = await checkTokenValidity();
    return NextResponse.json(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language,
        imageUrl: user.imageUrl,
        isRegistered: user.isRegistered,
        isVendor: user.isVendor,
        token: token.toString()
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(null, { status: 400 });
  }
}
