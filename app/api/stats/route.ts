import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        totalAppointments: 0,
        pendingAppointments: 0,
        confirmedAppointments: 0,
        todayAppointments: 0,
        totalServices: 4,
      });
    }

    const supabase = createAdminClient();
    const today = new Date().toISOString().split("T")[0];

    const [all, pending, confirmed, todayAppts, services] = await Promise.all([
      supabase.from("appointments").select("id", { count: "exact", head: true }),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("appointment_date", today),
      supabase.from("services").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);

    return NextResponse.json({
      totalAppointments: all.count || 0,
      pendingAppointments: pending.count || 0,
      confirmedAppointments: confirmed.count || 0,
      todayAppointments: todayAppts.count || 0,
      totalServices: services.count || 0,
    });
  } catch {
    return NextResponse.json({
      totalAppointments: 0,
      pendingAppointments: 0,
      confirmedAppointments: 0,
      todayAppointments: 0,
      totalServices: 0,
    });
  }
}
