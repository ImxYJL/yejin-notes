import { NextResponse } from "next/server";
import { checkIsAdmin } from "@/services/authService";
import { handleRouteError } from "@/utils/error";

export const GET = async () => {
  try {
    const isAdmin = await checkIsAdmin();

    return NextResponse.json({
      success: true,
      data: { isAdmin },
    });
  } catch (error) {
    return handleRouteError(error);
  }
};
