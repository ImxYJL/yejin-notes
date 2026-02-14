import { NextResponse } from "next/server";
import { getCategories } from "@/services/categoryService";
import { handleRouteError } from "@/utils/error";

export const GET = async () => {
  try {
    const categories = await getCategories();
    
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return handleRouteError(error);
  }
};