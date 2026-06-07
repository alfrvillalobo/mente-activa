import Link from "next/link";
import Navbar from "@/components/public/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "var(--background)", fontFamily: "Inter, sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #f0fafa 0%, #e6f7f7 40%, #f7f3ff 100%)",
        paddingTop: "120px",
        paddingBottom: "100px",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
          
          {/* Texto */}
          <div style={{ flex: "1", minWidth: "300px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "var(--accent)", color: "var(--primary-dark)",
              padding: "6px 16px", borderRadius: "999px", fontSize: "12px",
              fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: "24px"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--primary)", display: "inline-block" }} />
              Psicología Profesional · Santiago
            </div>

            <h1 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: "800", lineHeight: "1.1", color: "var(--text)", marginBottom: "20px" }}>
              Un espacio seguro<br />
              para tu <span style={{
                color: "var(--primary)",
                background: "linear-gradient(135deg, #2C7A7B, #68D391)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>bienestar mental</span>
            </h1>

            <p style={{ fontSize: "17px", color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "36px", maxWidth: "480px" }}>
              En Mente Activa te acompañamos con atención psicológica profesional, empática y personalizada. Agenda tu cita en minutos.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/agendar" style={{
                backgroundColor: "var(--primary)", color: "white",
                padding: "14px 32px", borderRadius: "999px", fontWeight: "600",
                fontSize: "15px", textDecoration: "none", display: "inline-block",
                boxShadow: "0 4px 20px rgba(44,122,123,0.35)",
                transition: "transform 0.2s"
              }}>
                Agendar mi cita →
              </Link>
              <Link href="/#servicios" style={{
                backgroundColor: "white", color: "var(--text)",
                padding: "14px 32px", borderRadius: "999px", fontWeight: "500",
                fontSize: "15px", textDecoration: "none", display: "inline-block",
                border: "1.5px solid var(--border)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}>
                Ver servicios
              </Link>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "36px" }}>
              <div style={{ display: "flex" }}>
                {["#A8D8D8","#7EC8C8","#5BB5B5","#3D9E9E"].map((c, i) => (
                  <div key={i} style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    backgroundColor: c, border: "2px solid white",
                    marginLeft: i === 0 ? 0 : "-8px"
                  }} />
                ))}
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                <strong style={{ color: "var(--text)" }}>+500 pacientes</strong> confían en nosotros
              </p>
            </div>
          </div>

          {/* Card decorativa */}
          <div style={{ flex: "1", minWidth: "280px", position: "relative" }}>
            <div style={{
              backgroundColor: "white", borderRadius: "24px",
              padding: "32px", boxShadow: "0 20px 60px rgba(44,122,123,0.12)",
              border: "1px solid var(--border)"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {tarjetasHero.map((t, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "16px", borderRadius: "16px",
                    backgroundColor: i === 1 ? "var(--primary)" : "var(--background)",
                    transition: "all 0.2s"
                  }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      backgroundColor: i === 1 ? "rgba(255,255,255,0.2)" : "var(--accent)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "20px", flexShrink: 0
                    }}>
                      {t.icono}
                    </div>
                    <div>
                      <p style={{ fontWeight: "600", fontSize: "14px", color: i === 1 ? "white" : "var(--text)", marginBottom: "2px" }}>{t.titulo}</p>
                      <p style={{ fontSize: "12px", color: i === 1 ? "rgba(255,255,255,0.75)" : "var(--text-muted)" }}>{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badge flotante */}
            <div style={{
              position: "absolute", top: "-16px", right: "-16px",
              backgroundColor: "white", borderRadius: "16px", padding: "12px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: "8px"
            }}>
              <span style={{ fontSize: "18px" }}>⭐</span>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--text)", lineHeight: 1 }}>5.0</p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Valoración</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" style={{ padding: "100px 24px", backgroundColor: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ color: "var(--primary)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Lo que ofrecemos</p>
            <h2 style={{ fontSize: "36px", fontWeight: "800", color: "var(--text)", marginBottom: "16px" }}>Nuestros servicios</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto", lineHeight: "1.7" }}>
              Atención psicológica especializada para acompañarte en cada etapa de tu vida.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {servicios.map((s, i) => (
              <div key={s.titulo} style={{
                borderRadius: "20px", padding: "32px",
                background: i === 0 ? "linear-gradient(135deg, #2C7A7B, #1A5F60)" : "var(--background)",
                border: `1px solid ${i === 0 ? "transparent" : "var(--border)"}`,
                boxShadow: i === 0 ? "0 12px 40px rgba(44,122,123,0.25)" : "0 2px 12px rgba(0,0,0,0.04)"
              }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  backgroundColor: i === 0 ? "rgba(255,255,255,0.15)" : "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px", marginBottom: "20px"
                }}>
                  {s.icono}
                </div>
                <h3 style={{ fontWeight: "700", fontSize: "18px", color: i === 0 ? "white" : "var(--text)", marginBottom: "10px" }}>{s.titulo}</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.7", color: i === 0 ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}>{s.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, #f0fafa, #e8f5f5)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "32px", textAlign: "center" }}>
          {stats.map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: "44px", fontWeight: "800", color: "var(--primary)", lineHeight: 1, marginBottom: "8px" }}>{s.valor}</p>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "500" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre nosotros */}
      <section id="sobre-nosotros" style={{ padding: "100px 24px", backgroundColor: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "60px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{
              borderRadius: "24px", overflow: "hidden",
              background: "linear-gradient(135deg, #2C7A7B 0%, #68D391 100%)",
              padding: "48px", minHeight: "320px",
              display: "flex", flexDirection: "column", justifyContent: "flex-end"
            }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "8px", fontWeight: "500" }}>Nuestro compromiso</p>
              <p style={{ fontSize: "22px", fontWeight: "700", color: "white", lineHeight: "1.4" }}>
                "Cada persona merece un espacio donde ser escuchada y comprendida."
              </p>
            </div>
          </div>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <p style={{ color: "var(--primary)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Sobre nosotros</p>
            <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text)", marginBottom: "20px", lineHeight: "1.2" }}>Un equipo comprometido con tu salud mental</h2>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.8", marginBottom: "16px" }}>
              Somos un centro de psicología con más de 8 años acompañando a personas en sus procesos de cambio y bienestar emocional.
            </p>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.8", marginBottom: "32px" }}>
              Trabajamos con un enfoque humano, ético y basado en evidencia, adaptando cada proceso a las necesidades únicas de cada paciente.
            </p>
            <Link href="/agendar" style={{
              backgroundColor: "var(--primary)", color: "white",
              padding: "14px 28px", borderRadius: "999px", fontWeight: "600",
              fontSize: "14px", textDecoration: "none", display: "inline-block",
              boxShadow: "0 4px 16px rgba(44,122,123,0.3)"
            }}>
              Conoce nuestro equipo →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "100px 24px",
        background: "linear-gradient(135deg, #1A5F60 0%, #2C7A7B 50%, #3D9E9E 100%)",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Sin listas de espera</p>
          <h2 style={{ fontSize: "40px", fontWeight: "800", color: "white", marginBottom: "16px", lineHeight: "1.2" }}>
            Da el primer paso hoy
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "40px", fontSize: "17px", lineHeight: "1.6" }}>
            Agenda tu cita en minutos. El pago se realiza directamente en la consulta.
          </p>
          <Link href="/agendar" style={{
            backgroundColor: "white", color: "var(--primary)",
            padding: "16px 40px", borderRadius: "999px", fontWeight: "700",
            fontSize: "15px", textDecoration: "none", display: "inline-block",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)"
          }}>
            Agendar mi cita →
          </Link>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" style={{ padding: "100px 24px", backgroundColor: "white" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "800", color: "var(--text)", marginBottom: "12px" }}>Contáctanos</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "48px" }}>¿Tienes dudas? Estamos aquí para ayudarte.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {contacto.map((c) => (
              <div key={c.label} style={{
                borderRadius: "20px", padding: "28px 24px",
                backgroundColor: "var(--background)", border: "1px solid var(--border)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  backgroundColor: "var(--accent)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "22px", margin: "0 auto 16px"
                }}>
                  {c.icono}
                </div>
                <p style={{ fontWeight: "600", fontSize: "14px", color: "var(--text)", marginBottom: "6px" }}>{c.label}</p>
                <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{c.valor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "32px 24px", borderTop: "1px solid var(--border)", textAlign: "center", backgroundColor: "var(--background)" }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} Mente Activa · Psicología Profesional · Santiago, Chile
        </p>
      </footer>
    </main>
  );
}

const tarjetasHero = [
  { icono: "🗓️", titulo: "Agenda en minutos", desc: "Sin esperas ni formularios complejos" },
  { icono: "🧠", titulo: "Atención personalizada", desc: "Profesionales especializados para ti" },
  { icono: "💬", titulo: "Ambiente de confianza", desc: "Confidencialidad garantizada" },
];

const servicios = [
  { icono: "🧠", titulo: "Psicología clínica", descripcion: "Atención individual para adultos con enfoque en ansiedad, depresión, estrés y bienestar emocional." },
  { icono: "👨‍👩‍👧", titulo: "Terapia familiar", descripcion: "Acompañamiento a familias en procesos de comunicación, conflictos y dinámicas relacionales." },
  { icono: "🌱", titulo: "Desarrollo personal", descripcion: "Trabajo en autoconocimiento, hábitos saludables y crecimiento personal sostenido." },
];

const stats = [
  { valor: "+500", label: "Pacientes atendidos" },
  { valor: "5.0★", label: "Valoración promedio" },
  { valor: "+8", label: "Años de experiencia" },
  { valor: "3", label: "Especialidades" },
];

const contacto = [
  { icono: "📍", label: "Dirección", valor: "Santiago, Chile" },
  { icono: "📞", label: "Teléfono", valor: "+56 9 1234 5678" },
  { icono: "✉️", label: "Email", valor: "contacto@menteactiva.cl" },
];