import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { GALLERY_IMAGES } from "@/lib/constants";
import type { GalleryImage } from "@/lib/types";

function getFallbackGallery(): GalleryImage[] {
  return GALLERY_IMAGES.map((img, i) => ({
    id: `default-${i}`,
    image_url: img.src,
    caption: img.alt,
    sort_order: i + 1,
    is_active: true,
    created_at: new Date().toISOString(),
  }));
}

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(getFallbackGallery());
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return NextResponse.json(data?.length ? data : getFallbackGallery());
  } catch {
    return NextResponse.json(getFallbackGallery());
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("gallery_images").insert(body).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add image" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const supabase = createAdminClient();
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
