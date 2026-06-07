import { NextResponse } from "next/server";
import { obtenerCitasProximas } from "@/services/citas.service";
import { enviarEmailRecordatorio } from "@/services/emails.service";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const citas = await obtenerCitasProximas(24);
    let enviados = 0;

    for (const cita of citas) {
      await enviarEmailRecordatorio(cita);
      enviados++;
    }

    return NextResponse.json({ mensaje: `Recordatorios enviados: ${enviados}` });
  } catch (error) {
    console.error("Error al enviar recordatorios:", error);
    return NextResponse.json({ error: "Error al enviar recordatorios" }, { status: 500 });
  }
}