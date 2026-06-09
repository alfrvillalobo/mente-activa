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
  notas: string | null;
  cliente: { nombre: string; email: string; telefono: string };
  pago: { monto: number; metodoPago: string } | null;
};

const ESTADOS = ["TODOS", "PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"];

export default function CitasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("TODOS");
  const [actualizando, setActualizando] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      cargarCitas();
    }
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

  const cambiarEstado = async (id: string, estado: string) => {
    setActualizando(id);
    try {
      await fetch(`/api/citas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      await cargarCitas();
    } finally {
      setActualizando(null);
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

  const citasFiltradas = filtro === "TODOS" ? citas : citas.filter((c) => c.estado === filtro);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>
      <Sidebar />
      <div style={{ marginLeft: "240px", padding: "40px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text)", marginBottom: "4px" }}>Citas</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{citas.length} citas en total</p>
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {ESTADOS.map((e) => (
            <button key={e} onClick={() => setFiltro(e)}
              style={{
                padding: "8px 16px", borderRadius: "999px", fontSize: "13px",
                fontWeight: "600", border: "1.5px solid",
                borderColor: filtro === e ? "var(--primary)" : "var(--border)",
                backgroundColor: filtro === e ? "var(--primary)" : "white",
                color: filtro === e ? "white" : "var(--text-muted)",
                cursor: "pointer"
              }}>
              {e === "TODOS" ? "Todas" : e.charAt(0) + e.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Tabla */}
        <div style={{
          backgroundColor: "white", borderRadius: "20px",
          border: "1px solid var(--border)", overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
        }}>
          {citasFiltradas.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No hay citas para mostrar</p>
            </div>
          ) : (
            citasFiltradas.map((cita, i) => (
              <div key={cita.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "20px 24px", flexWrap: "wrap", gap: "16px",
                borderBottom: i < citasFiltradas.length - 1 ? "1px solid var(--border)" : "none",
                backgroundColor: i % 2 === 0 ? "white" : "var(--background)"
              }}>
                {/* Cliente */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: "200px" }}>
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
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{cita.cliente.email}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{cita.cliente.telefono}</p>
                  </div>
                </div>

                {/* Servicio y fecha */}
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}>{cita.servicio}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {new Date(cita.fecha).toLocaleDateString("es-CL", {
                      day: "numeric", month: "short", year: "numeric", timeZone: "America/Santiago"
                    })}
                    {" · "}
                    {new Date(cita.fecha).toLocaleTimeString("es-CL", {
                      hour: "2-digit", minute: "2-digit", timeZone: "America/Santiago"
                    })}
                  </p>
                  {cita.notas && <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", fontStyle: "italic" }}>"{cita.notas}"</p>}
                </div>

                {/* Estado + acciones */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <EstadoBadge estado={cita.estado} />

                  {cita.pago && (
                    <span style={{
                      backgroundColor: "#f0fff4", color: "#276749",
                      fontSize: "11px", fontWeight: "700", padding: "3px 10px",
                      borderRadius: "999px"
                    }}>
                      💰 ${cita.pago.monto.toLocaleString("es-CL")}
                    </span>
                  )}

                  {/* Selector de estado */}
                  <select
                    value={cita.estado}
                    disabled={actualizando === cita.id}
                    onChange={(e) => cambiarEstado(cita.id, e.target.value)}
                    style={{
                      padding: "7px 12px", borderRadius: "10px", fontSize: "12px",
                      border: "1.5px solid var(--border)", backgroundColor: "var(--background)",
                      color: "var(--text)", cursor: "pointer", fontWeight: "500"
                    }}>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="CONFIRMADA">Confirmada</option>
                    <option value="COMPLETADA">Completada</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const colores: Record<string, { bg: string; color: string }> = {
    PENDIENTE: { bg: "#fffbf0", color: "#b7791f" },
    CONFIRMADA: { bg: "#f0fafa", color: "#2C7A7B" },
    COMPLETADA: { bg: "#f0fff4", color: "#276749" },
    CANCELADA: { bg: "#fff5f5", color: "#c53030" },
  };
  const { bg, color } = colores[estado] || { bg: "#f5f5f5", color: "#666" };
  return (
    <span style={{
      backgroundColor: bg, color, fontSize: "11px", fontWeight: "700",
      padding: "3px 10px", borderRadius: "999px", textTransform: "uppercase", letterSpacing: "0.05em"
    }}>
      {estado}
    </span>
  );
}