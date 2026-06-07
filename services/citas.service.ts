import { prisma } from "@/lib/prisma";
import type { CitaInput } from "@/lib/validations";

export async function crearCita(data: CitaInput) {
  const cliente = await prisma.cliente.upsert({
    where: { email: data.email },
    update: { nombre: data.nombre, telefono: data.telefono },
    create: { nombre: data.nombre, email: data.email, telefono: data.telefono },
  });

  const cita = await prisma.cita.create({
    data: {
      clienteId: cliente.id,
      fecha: new Date(data.fecha),
      servicio: data.servicio,
      notas: data.notas,
    },
    include: { cliente: true },
  });

  return cita;
}

export async function obtenerCitas() {
  return prisma.cita.findMany({
    include: { cliente: true, pago: true },
    orderBy: { fecha: "asc" },
  });
}

export async function obtenerCitaPorId(id: string) {
  return prisma.cita.findUnique({
    where: { id },
    include: { cliente: true, pago: true },
  });
}

export async function actualizarEstadoCita(id: string, estado: "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "COMPLETADA") {
  return prisma.cita.update({
    where: { id },
    data: { estado },
  });
}

export async function obtenerCitasProximas(horas: number) {
  const ahora = new Date();
  const limite = new Date(ahora.getTime() + horas * 60 * 60 * 1000);

  return prisma.cita.findMany({
    where: {
      fecha: { gte: ahora, lte: limite },
      estado: { in: ["PENDIENTE", "CONFIRMADA"] },
    },
    include: { cliente: true },
  });
}