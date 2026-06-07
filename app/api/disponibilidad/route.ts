import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get("fecha");

    if (!fecha) {
      return NextResponse.json({ error: "Fecha requerida" }, { status: 400 });
    }

    const inicio = new Date(fecha);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);

    const citasDelDia = await prisma.cita.findMany({
      where: {
        fecha: { gte: inicio, lte: fin },
        estado: { not: "CANCELADA" },
      },
      select: { fecha: true },
    });

    const horasOcupadas = citasDelDia.map((c) =>
      new Date(c.fecha).toISOString()
    );

    return NextResponse.json({ horasOcupadas });
  } catch (error) {
    console.error("Error al obtener disponibilidad:", error);
    return NextResponse.json({ error: "Error al obtener disponibilidad" }, { status: 500 });
  }
}