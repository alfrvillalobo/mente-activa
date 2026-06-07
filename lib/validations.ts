import { z } from "zod";

export const citaSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(8, "Teléfono inválido"),
  fecha: z.string().min(1, "La fecha es requerida"),
  servicio: z.string().min(1, "El servicio es requerido"),
  notas: z.string().optional(),
});

export const pagoSchema = z.object({
  citaId: z.string().min(1),
  monto: z.number().positive("El monto debe ser mayor a 0"),
  metodoPago: z.string().min(1, "El método de pago es requerido"),
  notas: z.string().optional(),
});

export type CitaInput = z.infer<typeof citaSchema>;
export type PagoInput = z.infer<typeof pagoSchema>;