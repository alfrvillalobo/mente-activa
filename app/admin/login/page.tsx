"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) return setError("Completa todos los campos");
    setCargando(true);
    setError("");

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales inválidas");
      setCargando(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", backgroundColor: "var(--background)", padding: "24px"
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "14px",
            background: "linear-gradient(135deg, #2C7A7B, #68D391)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: "22px"
          }}>🧠</div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text)", marginBottom: "4px" }}>Mente Activa</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Panel de administración</p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: "white", borderRadius: "24px", padding: "36px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid var(--border)"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)", marginBottom: "24px" }}>Iniciar sesión</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "Email", campo: "email", tipo: "email", placeholder: "admin@menteactiva.cl" },
              { label: "Contraseña", campo: "password", tipo: "password", placeholder: "••••••••" },
            ].map((f) => (
              <div key={f.campo}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "6px" }}>
                  {f.label}
                </label>
                <input
                  type={f.tipo}
                  placeholder={f.placeholder}
                  value={form[f.campo as keyof typeof form]}
                  onChange={(e) => setForm((p) => ({ ...p, [f.campo]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "12px",
                    border: "1.5px solid var(--border)", fontSize: "15px",
                    color: "var(--text)", outline: "none", backgroundColor: "var(--background)",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            ))}
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

          <button
            onClick={handleSubmit}
            disabled={cargando}
            style={{
              width: "100%", marginTop: "24px", padding: "14px", borderRadius: "12px",
              fontWeight: "600", fontSize: "15px", border: "none",
              cursor: cargando ? "not-allowed" : "pointer",
              backgroundColor: cargando ? "#a0c4c4" : "var(--primary)",
              color: "white", boxShadow: "0 4px 16px rgba(44,122,123,0.3)"
            }}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </div>
    </main>
  );
}