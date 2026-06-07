import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pagoSchema } from "@/lib/validations";
import { registrarPago, obtenerPagos } from "@/services/pagos.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const pagos = await obtenerPagos();
    return NextResponse.json(pagos);
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    return NextResponse.json({ error: "Error al obtener los pagos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validacion = pagoSchema.safeParse(body);

    if (!validacion.success) {
      return NextResponse.json(
        { error: validacion.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const pago = await registrarPago(validacion.data);
    return NextResponse.json(pago, { status: 201 });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : "Error al registrar el pago";
    console.error("Error al registrar pago:", error);
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}