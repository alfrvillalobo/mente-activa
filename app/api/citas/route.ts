import { NextResponse } from "next/server";
import { citaSchema } from "@/lib/validations";
import { crearCita, obtenerCitas } from "@/services/citas.service";
import { enviarEmailConfirmacion } from "@/services/emails.service";

export async function GET() {
  try {
    const citas = await obtenerCitas();
    return NextResponse.json(citas);
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return NextResponse.json(
      { error: "Error al obtener las citas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validacion = citaSchema.safeParse(body);

    if (!validacion.success) {
      return NextResponse.json(
        { error: validacion.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const cita = await crearCita(validacion.data);
    await enviarEmailConfirmacion(cita);

    return NextResponse.json(cita, { status: 201 });
  } catch (error) {
    console.error("Error al crear cita:", error);
    return NextResponse.json(
      { error: "Error al crear la cita" },
      { status: 500 }
    );
  }
}