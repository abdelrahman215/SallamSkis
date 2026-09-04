import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_SERVICES } from "@/lib/constants";
import type { Service } from "@/lib/types";

function getFallbackServices(): Service[] {
  return DEFAULT_SERVICES.map((s, i) => ({
    id: `default-${i}`,
    ...s,
    benefits: s.benefits,
    price: s.price,
    image_url: s.image_url,
    icon: s.icon,
    is_active: true,
    sort_order: i + 1,
    created_at: new Date().toISOString(),
  }));
}

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(getFallbackServices());
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return NextResponse.json(data?.length ? data : getFallbackServices());
  } catch {
    return NextResponse.json(getFallbackServices());
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("services").insert(body).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("services").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const supabase = createAdminClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
