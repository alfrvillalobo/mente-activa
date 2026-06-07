"use client";

import { useState } from "react";
import Navbar from "@/components/public/Navbar";

const HORARIOS = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00"];

const SERVICIOS = ["Psicología clínica","Terapia familiar","Desarrollo personal"];

function esDiaHabil(fecha: string): boolean {
  const dia = new Date(fecha + "T12:00:00").getDay();
  return dia >= 1 && dia <= 5;
}

function formatearFecha(fecha: string): string {
  return new Date(fecha + "T12:00:00").toLocaleDateString("es-CL", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}

export default function AgendarPage() {
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState("");
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);

  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "",
    fecha: "", hora: "", servicio: "", notas: "",
  });

  const hoy = new Date().toISOString().split("T")[0];

  const actualizarCampo = (campo: string, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setError("");
  };

  const seleccionarFecha = async (fecha: string) => {
    if (!esDiaHabil(fecha)) return;
    actualizarCampo("fecha", fecha);
    actualizarCampo("hora", "");

    try {
      const res = await fetch(`/api/disponibilidad?fecha=${fecha}`);
      const data = await res.json();
      const ocupadas = (data.horasOcupadas || []).map((iso: string) =>
        new Date(iso).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Santiago" })
      );
      setHorasOcupadas(ocupadas);
    } catch {
      setHorasOcupadas([]);
    }
  };

  const validarPaso1 = () => {
    if (!form.nombre.trim()) return setError("El nombre es requerido"), false;
    if (!form.email.trim() || !form.email.includes("@")) return setError("Email inválido"), false;
    if (!form.telefono.trim()) return setError("El teléfono es requerido"), false;
    return true;
  };

  const validarPaso2 = () => {
    if (!form.servicio) return setError("Selecciona un servicio"), false;
    if (!form.fecha) return setError("Selecciona una fecha"), false;
    if (!form.hora) return setError("Selecciona un horario"), false;
    return true;
  };

  const enviar = async () => {
    if (!validarPaso2()) return;
    setCargando(true);
    setError("");

    try {
      const fechaHora = new Date(`${form.fecha}T${form.hora}:00`);
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, fecha: fechaHora.toISOString() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al agendar");
      }

      setExito(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al agendar la cita");
    } finally {
      setCargando(false);
    }
  };

  if (exito) {
    return (
      <main style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ maxWidth: "540px", margin: "0 auto", padding: "140px 24px", textAlign: "center" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "linear-gradient(135deg, #2C7A7B, #68D391)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "32px", margin: "0 auto 24px"
          }}>✓</div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text)", marginBottom: "12px" }}>¡Cita agendada!</h1>
          <p style={{ color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "8px" }}>
            Te enviamos un correo de confirmación a <strong>{form.email}</strong>
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "32px" }}>
            📅 {formatearFecha(form.fecha)} a las {form.hora}
          </p>
          <button onClick={() => { setExito(false); setPaso(1); setForm({ nombre:"",email:"",telefono:"",fecha:"",hora:"",servicio:"",notas:"" }); }}
            style={{
              backgroundColor: "var(--primary)", color: "white",
              padding: "12px 28px", borderRadius: "999px", fontWeight: "600",
              fontSize: "14px", border: "none", cursor: "pointer"
            }}>
            Agendar otra cita
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "120px 24px 60px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text)", marginBottom: "8px" }}>Agenda tu cita</h1>
          <p style={{ color: "var(--text-muted)" }}>Completa el formulario y recibirás una confirmación por email.</p>
        </div>

        {/* Pasos */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "40px", gap: "8px" }}>
          {[1, 2].map((p) => (
            <div key={p} style={{ display: "flex", alignItems: "center", flex: p < 2 ? 1 : "none" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                backgroundColor: paso >= p ? "var(--primary)" : "var(--border)",
                color: paso >= p ? "white" : "var(--text-muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "700", fontSize: "13px"
              }}>{p}</div>
              {p < 2 && <div style={{ flex: 1, height: "2px", backgroundColor: paso > p ? "var(--primary)" : "var(--border)", margin: "0 8px" }} />}
            </div>
          ))}
          <span style={{ fontSize: "13px", color: "var(--text-muted)", marginLeft: "8px" }}>
            {paso === 1 ? "Tus datos" : "Servicio y horario"}
          </span>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: "white", borderRadius: "24px", padding: "36px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid var(--border)"
        }}>

          {/* Paso 1 */}
          {paso === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)", marginBottom: "4px" }}>Tus datos personales</h2>

              {[
                { label: "Nombre completo", campo: "nombre", tipo: "text", placeholder: "Ej: María González" },
                { label: "Email", campo: "email", tipo: "email", placeholder: "tu@email.com" },
                { label: "Teléfono", campo: "telefono", tipo: "tel", placeholder: "+56 9 1234 5678" },
              ].map((f) => (
                <div key={f.campo}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "6px" }}>
                    {f.label}
                  </label>
                  <input
                    type={f.tipo}
                    placeholder={f.placeholder}
                    value={form[f.campo as keyof typeof form]}
                    onChange={(e) => actualizarCampo(f.campo, e.target.value)}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: "12px",
                      border: "1.5px solid var(--border)", fontSize: "15px",
                      color: "var(--text)", outline: "none", backgroundColor: "var(--background)",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "6px" }}>
                  Notas adicionales (opcional)
                </label>
                <textarea
                  placeholder="¿Algo que quieras contarnos antes de la cita?"
                  value={form.notas}
                  onChange={(e) => actualizarCampo("notas", e.target.value)}
                  rows={3}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "12px",
                    border: "1.5px solid var(--border)", fontSize: "15px",
                    color: "var(--text)", outline: "none", backgroundColor: "var(--background)",
                    resize: "vertical", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          )}

          {/* Paso 2 */}
          {paso === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)", marginBottom: "4px" }}>Servicio y horario</h2>

              {/* Servicio */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "10px" }}>Tipo de servicio</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {SERVICIOS.map((s) => (
                    <button key={s} onClick={() => actualizarCampo("servicio", s)}
                      style={{
                        padding: "12px 16px", borderRadius: "12px", textAlign: "left",
                        border: `1.5px solid ${form.servicio === s ? "var(--primary)" : "var(--border)"}`,
                        backgroundColor: form.servicio === s ? "#f0fafa" : "var(--background)",
                        color: form.servicio === s ? "var(--primary)" : "var(--text)",
                        fontWeight: form.servicio === s ? "600" : "400",
                        fontSize: "14px", cursor: "pointer"
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fecha */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "6px" }}>Fecha</label>
                <input
                  type="date"
                  min={hoy}
                  value={form.fecha}
                  onChange={(e) => seleccionarFecha(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "12px",
                    border: `1.5px solid ${form.fecha && !esDiaHabil(form.fecha) ? "var(--error)" : "var(--border)"}`,
                    fontSize: "15px", color: "var(--text)", outline: "none",
                    backgroundColor: "var(--background)", boxSizing: "border-box"
                  }}
                />
                {form.fecha && !esDiaHabil(form.fecha) && (
                  <p style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px" }}>Solo atendemos de lunes a viernes</p>
                )}
                {form.fecha && esDiaHabil(form.fecha) && (
                  <p style={{ color: "var(--primary)", fontSize: "12px", marginTop: "4px" }}>📅 {formatearFecha(form.fecha)}</p>
                )}
              </div>

              {/* Horarios */}
              {form.fecha && esDiaHabil(form.fecha) && (
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "10px" }}>Horario disponible</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {HORARIOS.map((h) => {
                      const ocupado = horasOcupadas.includes(h);
                      return (
                        <button key={h} onClick={() => !ocupado && actualizarCampo("hora", h)}
                          disabled={ocupado}
                          style={{
                            padding: "10px", borderRadius: "10px", fontSize: "14px", fontWeight: "500",
                            border: `1.5px solid ${form.hora === h ? "var(--primary)" : ocupado ? "var(--border)" : "var(--border)"}`,
                            backgroundColor: form.hora === h ? "var(--primary)" : ocupado ? "#f5f5f5" : "var(--background)",
                            color: form.hora === h ? "white" : ocupado ? "#ccc" : "var(--text)",
                            cursor: ocupado ? "not-allowed" : "pointer",
                            textDecoration: ocupado ? "line-through" : "none"
                          }}>
                          {h}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginTop: "16px", padding: "12px 16px", borderRadius: "12px",
              backgroundColor: "#fff5f5", border: "1px solid #fed7d7",
              color: "var(--error)", fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          {/* Botones */}
          <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
            {paso > 1 && (
              <button onClick={() => setPaso(paso - 1)}
                style={{
                  flex: 1, padding: "14px", borderRadius: "12px", fontWeight: "600",
                  fontSize: "15px", border: "1.5px solid var(--border)",
                  backgroundColor: "white", color: "var(--text)", cursor: "pointer"
                }}>
                ← Volver
              </button>
            )}
            <button
              onClick={() => {
                if (paso === 1) { if (validarPaso1()) setPaso(2); }
                else enviar();
              }}
              disabled={cargando}
              style={{
                flex: 1, padding: "14px", borderRadius: "12px", fontWeight: "600",
                fontSize: "15px", border: "none", cursor: cargando ? "not-allowed" : "pointer",
                backgroundColor: cargando ? "#a0c4c4" : "var(--primary)", color: "white",
                boxShadow: cargando ? "none" : "0 4px 16px rgba(44,122,123,0.3)"
              }}>
              {cargando ? "Agendando..." : paso === 1 ? "Continuar →" : "Confirmar cita"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}