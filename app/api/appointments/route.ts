import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingFormData } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date");

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json([]);
    }

    const supabase = createAdminClient();
    let query = supabase
      .from("appointments")
      .select("*, service:services(*)")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (status) query = query.eq("status", status);
    if (date) query = query.eq("appointment_date", date);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingFormData = await request.json();

    if (
      !body.service_id ||
      !body.appointment_date ||
      !body.appointment_time ||
      !body.customer_name ||
      !body.customer_phone ||
      !body.customer_email
    ) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        id: "demo-" + Date.now(),
        ...body,
        status: "pending",
        created_at: new Date().toISOString(),
        message: "Demo mode: Configure Supabase to persist bookings",
      }, { status: 201 });
    }

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("appointments")
      .select("id")
      .eq("appointment_date", body.appointment_date)
      .eq("appointment_time", body.appointment_time + ":00")
      .neq("status", "cancelled")
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please choose another time." },
        { status: 409 }
      );
    }

    const serviceId = body.service_id.startsWith("default-") ? null : body.service_id;

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        service_id: serviceId,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_email: body.customer_email,
        appointment_date: body.appointment_date,
        appointment_time: body.appointment_time + ":00",
        notes: body.notes || null,
        status: "pending",
      })
      .select("*, service:services(*)")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This time slot was just booked. Please choose another time." },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select("*, service:services(*)")
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const supabase = createAdminClient();
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}
