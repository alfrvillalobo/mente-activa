import { NextResponse } from "next/server";
import { obtenerCitaPorId, actualizarEstadoCita } from "@/services/citas.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cita = await obtenerCitaPorId(id);

    if (!cita) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
    }

    return NextResponse.json(cita);
  } catch (error) {
    console.error("Error al obtener cita:", error);
    return NextResponse.json({ error: "Error al obtener la cita" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { estado } = body;

    const estadosValidos = ["PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"];
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const cita = await actualizarEstadoCita(id, estado);
    return NextResponse.json(cita);
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    return NextResponse.json({ error: "Error al actualizar la cita" }, { status: 500 });
  }
}