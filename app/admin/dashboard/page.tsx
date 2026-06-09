"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Cita = {
  id: string;
  fecha: string;
  servicio: string;
  estado: string;
  cliente: { nombre: string; email: string; telefono: string };
  pago: { monto: number } | null;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/citas")
        .then((r) => r.json())
        .then((data) => { setCitas(data); setCargando(false); })
        .catch(() => setCargando(false));
    }
  }, [status]);

  if (status === "loading" || cargando) return <PantallaCarga />;
  if (!session) return null;

  const hoy = new Date().toDateString();
  const citasHoy = citas.filter((c) => new Date(c.fecha).toDateString() === hoy);
  const pendientes = citas.filter((c) => c.estado === "PENDIENTE");
  const ingresos = citas.filter((c) => c.pago).reduce((acc, c) => acc + (c.pago?.monto || 0), 0);
  const proximas = citas.filter((c) => new Date(c.fecha) >= new Date() && c.estado !== "CANCELADA").slice(0, 5);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>
      <Sidebar />
      <div style={{ marginLeft: "240px", padding: "40px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text)", marginBottom: "4px" }}>Dashboard</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              {new Date().toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
            style={{
              padding: "10px 20px", borderRadius: "999px", fontSize: "13px",
              fontWeight: "600", border: "1.5px solid var(--border)",
              backgroundColor: "white", color: "var(--text-muted)", cursor: "pointer"
            }}>
            Cerrar sesión
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {[
            { label: "Citas hoy", valor: citasHoy.length, icono: "📅", color: "#f0fafa" },
            { label: "Pendientes", valor: pendientes.length, icono: "⏳", color: "#fffbf0" },
            { label: "Total citas", valor: citas.length, icono: "📋", color: "#f0f7ff" },
            { label: "Ingresos registrados", valor: `$${ingresos.toLocaleString("es-CL")}`, icono: "💰", color: "#f0fff4" },
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

        {/* Próximas citas */}
        <div style={{
          backgroundColor: "white", borderRadius: "20px", padding: "28px",
          border: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text)" }}>Próximas citas</h2>
            <Link href="/admin/citas" style={{ fontSize: "13px", color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>
              Ver todas →
            </Link>
          </div>

          {proximas.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "24px 0" }}>No hay citas próximas</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {proximas.map((c) => (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px", borderRadius: "14px", backgroundColor: "var(--background)",
                  border: "1px solid var(--border)", flexWrap: "wrap", gap: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #2C7A7B, #68D391)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: "700", fontSize: "15px", flexShrink: 0
                    }}>
                      {c.cliente.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: "600", fontSize: "14px", color: "var(--text)", marginBottom: "2px" }}>{c.cliente.nombre}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{c.servicio}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}>
                      {new Date(c.fecha).toLocaleDateString("es-CL", { day: "numeric", month: "short", timeZone: "America/Santiago" })}
                      {" · "}
                      {new Date(c.fecha).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", timeZone: "America/Santiago" })}
                    </p>
                    <EstadoBadge estado={c.estado} />
                  </div>
                </div>
              ))}
            </div>
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

export function Sidebar() {
  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, bottom: 0, width: "240px",
      backgroundColor: "white", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", padding: "28px 16px", zIndex: 100
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px", paddingLeft: "8px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg, #2C7A7B, #68D391)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"
        }}>🧠</div>
        <div>
          <p style={{ fontWeight: "700", fontSize: "14px", color: "var(--text)", lineHeight: 1 }}>Mente Activa</p>
          <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Admin</p>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {[
          { href: "/admin/dashboard", icono: "📊", label: "Dashboard" },
          { href: "/admin/citas", icono: "📅", label: "Citas" },
          { href: "/admin/pagos", icono: "💰", label: "Pagos" },
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 12px", borderRadius: "12px", textDecoration: "none",
            color: "var(--text-muted)", fontSize: "14px", fontWeight: "500",
            transition: "all 0.15s"
          }}>
            <span style={{ fontSize: "16px" }}>{item.icono}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function PantallaCarga() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--background)" }}>
      <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Cargando...</p>
    </div>
  );
}