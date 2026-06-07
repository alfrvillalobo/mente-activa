import { resend } from "@/lib/resend";
import type { Cita, Cliente } from "@prisma/client";

type CitaConCliente = Cita & { cliente: Cliente };

export async function enviarEmailConfirmacion(cita: CitaConCliente) {
  const fecha = new Date(cita.fecha).toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Santiago",
  });

  await resend.emails.send({
    from: "Mente Activa <no-reply@menteactiva.cl>",
    to: cita.cliente.email,
    subject: "Confirmación de tu cita — Mente Activa",
    html: `
      <h2>¡Tu cita fue agendada con éxito!</h2>
      <p>Hola ${cita.cliente.nombre},</p>
      <p>Te confirmamos tu cita para <strong>${cita.servicio}</strong>.</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p>Recuerda que el pago se realiza de forma presencial el día de la cita.</p>
      <p>Si necesitas cancelar o reprogramar, contáctanos con anticipación.</p>
      <br/>
      <p>Equipo Mente Activa</p>
    `,
  });
}

export async function enviarEmailRecordatorio(cita: CitaConCliente) {
  const fecha = new Date(cita.fecha).toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Santiago",
  });

  await resend.emails.send({
    from: "Mente Activa <no-reply@menteactiva.cl>",
    to: cita.cliente.email,
    subject: "Recordatorio de tu cita mañana — Mente Activa",
    html: `
      <h2>Recordatorio de tu cita</h2>
      <p>Hola ${cita.cliente.nombre},</p>
      <p>Te recordamos que mañana tienes una cita para <strong>${cita.servicio}</strong>.</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p>Recuerda que el pago se realiza de forma presencial.</p>
      <br/>
      <p>Equipo Mente Activa</p>
    `,
  });
}