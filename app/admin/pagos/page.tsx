"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../dashboard/page";

type Cita = {
  id: string;
  fecha: string;
  servicio: string;
  estado: string;
  cliente: { nombre: string; email: string };
  pago: { monto: number; metodoPago: string; fechaPago: string; notas: string | null } | null;
};

const METODOS_PAGO = ["Efectivo", "Transferencia", "Débito", "Crédito"];

export default function PagosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [form, setForm] = useState({ monto: "", metodoPago: "Efectivo", notas: "" });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") cargarCitas();
  }, [status]);

  const cargarCitas = async () => {
    try {
      const res = await fetch("/api/citas");
      const data = await res.json();
      setCitas(data);
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setForm({ monto: "", metodoPago: "Efectivo", notas: "" });
    setError("");
    setModalAbierto(true);
  };

  const registrarPago = async () => {
    if (!citaSeleccionada) return;
    if (!form.monto || isNaN(Number(form.monto)) || Number(form.monto) <= 0) {
      return setError("Ingresa un monto válido");
    }

    setGuardando(true);
    setError("");

    try {
      const res = await fetch("/api/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citaId: citaSeleccionada.id,
          monto: Number(form.monto),
          metodoPago: form.metodoPago,
          notas: form.notas || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al registrar pago");
      }

      setModalAbierto(false);
      await cargarCitas();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar el pago");
    } finally {
      setGuardando(false);
    }
  };

  if (status === "loading" || cargando) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--background)" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Cargando...</p>
      </div>
    );
  }

  if (!session) return null;

  const citasSinPago = citas.filter((c) => !c.pago && c.estado !== "CANCELADA");
  const citasConPago = citas.filter((c) => c.pago);
  const totalIngresos = citasConPago.reduce((acc, c) => acc + (c.pago?.monto || 0), 0);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>
      <Sidebar />
      <div style={{ marginLeft: "240px", padding: "40px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text)", marginBottom: "4px" }}>Pagos</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Registro contable de pagos presenciales</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {[
            { label: "Total ingresos", valor: `$${totalIngresos.toLocaleString("es-CL")}`, icono: "💰", color: "#f0fff4" },
            { label: "Pagos registrados", valor: citasConPago.length, icono: "✅", color: "#f0fafa" },
            { label: "Pagos pendientes", valor: citasSinPago.length, icono: "⏳", color: "#fffbf0" },
          ].map((s) => (
            <div key={s.label} style={{
              backgroundColor: "white", borderRadius: "20px", padding: "24px",
              border: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                backgroundColor: s.color, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "20px", marginBottom: "16px"
              }}>{s.icono}</div>
              <p style={{ fontSize: "26px", fontWeight: "800", color: "var(--text)", marginBottom: "4px" }}>{s.valor}</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Citas sin pago */}
        {citasSinPago.length > 0 && (
          <div style={{
            backgroundColor: "white", borderRadius: "20px", padding: "28px",
            border: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: "28px"
          }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text)", marginBottom: "20px" }}>
              Citas sin pago registrado
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {citasSinPago.map((cita) => (
                <div key={cita.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px", borderRadius: "14px", backgroundColor: "var(--background)",
                  border: "1px solid var(--border)", flexWrap: "wrap", gap: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #2C7A7B, #68D391)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: "700", fontSize: "15px"
                    }}>
                      {cita.cliente.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: "600", fontSize: "14px", color: "var(--text)", marginBottom: "2px" }}>{cita.cliente.nombre}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{cita.servicio}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    {new Date(cita.fecha).toLocaleDateString("es-CL", {
                      day: "numeric", month: "short", year: "numeric", timeZone: "America/Santiago"
                    })}
                    {" · "}
                    {new Date(cita.fecha).toLocaleTimeString("es-CL", {
                      hour: "2-digit", minute: "2-digit", timeZone: "America/Santiago"
                    })}
                  </p>
                  <button onClick={() => abrirModal(cita)}
                    style={{
                      padding: "9px 20px", borderRadius: "999px", fontSize: "13px",
                      fontWeight: "600", border: "none", cursor: "pointer",
                      backgroundColor: "var(--primary)", color: "white",
                      boxShadow: "0 2px 8px rgba(44,122,123,0.25)"
                    }}>
                    Registrar pago
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historial de pagos */}
        <div style={{
          backgroundColor: "white", borderRadius: "20px", padding: "28px",
          border: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
        }}>
          <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text)", marginBottom: "20px" }}>
            Historial de pagos
          </h2>
          {citasConPago.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "24px 0" }}>
              No hay pagos registrados aún
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {citasConPago.map((cita) => (
                <div key={cita.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px", borderRadius: "14px", backgroundColor: "var(--background)",
                  border: "1px solid var(--border)", flexWrap: "wrap", gap: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #2C7A7B, #68D391)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: "700", fontSize: "15px"
                    }}>
                      {cita.cliente.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: "600", fontSize: "14px", color: "var(--text)", marginBottom: "2px" }}>{cita.cliente.nombre}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{cita.servicio} · {cita.pago?.metodoPago}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "18px", fontWeight: "800", color: "var(--primary)", marginBottom: "2px" }}>
                      ${cita.pago?.monto.toLocaleString("es-CL")}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {cita.pago && new Date(cita.pago.fechaPago).toLocaleDateString("es-CL", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal registrar pago */}
      {modalAbierto && citaSeleccionada && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: "24px"
        }}>
          <div style={{
            backgroundColor: "white", borderRadius: "24px", padding: "36px",
            width: "100%", maxWidth: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)", marginBottom: "4px" }}>Registrar pago</h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
              {citaSeleccionada.cliente.nombre} · {citaSeleccionada.servicio}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "6px" }}>
                  Monto ($CLP)
                </label>
                <input
                  type="number"
                  placeholder="Ej: 50000"
                  value={form.monto}
                  onChange={(e) => { setForm((p) => ({ ...p, monto: e.target.value })); setError(""); }}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "12px",
                    border: "1.5px solid var(--border)", fontSize: "15px",
                    color: "var(--text)", outline: "none", backgroundColor: "var(--background)",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "6px" }}>
                  Método de pago
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {METODOS_PAGO.map((m) => (
                    <button key={m} onClick={() => setForm((p) => ({ ...p, metodoPago: m }))}
                      style={{
                        padding: "10px", borderRadius: "10px", fontSize: "13px", fontWeight: "500",
                        border: `1.5px solid ${form.metodoPago === m ? "var(--primary)" : "var(--border)"}`,
                        backgroundColor: form.metodoPago === m ? "#f0fafa" : "var(--background)",
                        color: form.metodoPago === m ? "var(--primary)" : "var(--text)",
                        cursor: "pointer"
                      }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "6px" }}>
                  Notas (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Observaciones del pago"
                  value={form.notas}
                  onChange={(e) => setForm((p) => ({ ...p, notas: e.target.value }))}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "12px",
                    border: "1.5px solid var(--border)", fontSize: "15px",
                    color: "var(--text)", outline: "none", backgroundColor: "var(--background)",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            {error && (
              <div style={{
                marginTop: "16px", padding: "12px 16px", borderRadius: "12px",
                backgroundColor: "#fff5f5", border: "1px solid #fed7d7",
                color: "var(--error)", fontSize: "14px"
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button onClick={() => setModalAbierto(false)}
                style={{
                  flex: 1, padding: "13px", borderRadius: "12px", fontWeight: "600",
                  fontSize: "14px", border: "1.5px solid var(--border)",
                  backgroundColor: "white", color: "var(--text-muted)", cursor: "pointer"
                }}>
                Cancelar
              </button>
              <button onClick={registrarPago} disabled={guardando}
                style={{
                  flex: 1, padding: "13px", borderRadius: "12px", fontWeight: "600",
                  fontSize: "14px", border: "none",
                  backgroundColor: guardando ? "#a0c4c4" : "var(--primary)",
                  color: "white", cursor: guardando ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 16px rgba(44,122,123,0.3)"
                }}>
                {guardando ? "Guardando..." : "Registrar pago"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}