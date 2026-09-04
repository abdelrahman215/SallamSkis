import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BOOKING_TIME_SLOTS } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date parameter required" }, { status: 400 });
  }

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ availableSlots: BOOKING_TIME_SLOTS, bookedSlots: [] });
    }

    const supabase = createAdminClient();

    const [{ data: appointments }, { data: blocked }] = await Promise.all([
      supabase
        .from("appointments")
        .select("appointment_time")
        .eq("appointment_date", date)
        .neq("status", "cancelled"),
      supabase
        .from("availability_slots")
        .select("*")
        .eq("specific_date", date)
        .eq("is_blocked", true),
    ]);

    const bookedSlots = (appointments || []).map((a) =>
      a.appointment_time.slice(0, 5)
    );

    const blockedTimes = (blocked || []).flatMap((slot) => {
      const slots: string[] = [];
      const start = parseInt(slot.start_time.slice(0, 2), 10);
      const end = parseInt(slot.end_time.slice(0, 2), 10);
      for (let h = start; h < end; h++) {
        slots.push(`${h.toString().padStart(2, "0")}:00`);
      }
      return slots;
    });

    const unavailable = new Set([...bookedSlots, ...blockedTimes]);
    const availableSlots = BOOKING_TIME_SLOTS.filter((t) => !unavailable.has(t));

    return NextResponse.json({ availableSlots, bookedSlots: [...unavailable] });
  } catch {
    return NextResponse.json({ availableSlots: BOOKING_TIME_SLOTS, bookedSlots: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("availability_slots").insert(body).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create availability slot" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const supabase = createAdminClient();
    const { error } = await supabase.from("availability_slots").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete slot" }, { status: 500 });
  }
}
