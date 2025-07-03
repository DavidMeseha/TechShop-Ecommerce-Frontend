import { checkTokenValidity } from "@/common/services/auth.service";
import configureServerRequest from "@/common/services/server/configureServerRequest";
import { NextResponse } from "next/server";

export async function GET() {
  const { token } = await configureServerRequest();
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
