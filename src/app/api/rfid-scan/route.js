import { supabase } from "@/app/lib/supabaseClient";

export async function POST(request) {
  try {
    const data = await request.json();

    const { error } = await supabase.from("student_logs").insert([
      {
        student_name: data.student_name,
        zone: data.zone,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
