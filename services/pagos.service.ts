import { prisma } from "@/lib/prisma";
import type { PagoInput } from "@/lib/validations";

export async function registrarPago(data: PagoInput) {
  const cita = await prisma.cita.findUnique({
  where: { id: data.citaId },
  include: { pago: true },
});

if (!cita) {
  throw new Error("Cita no encontrada");
}

if (cita.pago) {
  throw new Error("Esta cita ya tiene un pago registrado");
}

  const pago = await prisma.pago.create({
    data: {
      citaId: data.citaId,
      monto: data.monto,
      metodoPago: data.metodoPago,
      notas: data.notas,
    },
  });

  await prisma.cita.update({
    where: { id: data.citaId },
    data: { estado: "COMPLETADA" },
  });

  return pago;
}

export async function obtenerPagos() {
  return prisma.pago.findMany({
    include: { cita: { include: { cliente: true } } },
    orderBy: { fechaPago: "desc" },
  });
}