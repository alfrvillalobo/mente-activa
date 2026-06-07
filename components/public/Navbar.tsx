"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[var(--border)] shadow-sm">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">MA</span>
          </div>
          <span className="font-semibold text-[var(--text)] text-lg">
            Mente Activa
          </span>
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#servicios" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors text-sm font-medium">
            Servicios
          </Link>
          <Link href="/#sobre-nosotros" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors text-sm font-medium">
            Sobre nosotros
          </Link>
          <Link href="/#contacto" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors text-sm font-medium">
            Contacto
          </Link>
          <Link
            href="/agendar"
            className="bg-[var(--primary)] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors"
          >
            Agendar cita
          </Link>
        </div>

        {/* Botón mobile */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--background)] transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuAbierto ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Menú mobile */}
      {menuAbierto && (
        <div className="md:hidden bg-white border-t border-[var(--border)] px-6 py-4 flex flex-col gap-4">
          <Link href="/#servicios" onClick={() => setMenuAbierto(false)} className="text-[var(--text-muted)] text-sm font-medium">Servicios</Link>
          <Link href="/#sobre-nosotros" onClick={() => setMenuAbierto(false)} className="text-[var(--text-muted)] text-sm font-medium">Sobre nosotros</Link>
          <Link href="/#contacto" onClick={() => setMenuAbierto(false)} className="text-[var(--text-muted)] text-sm font-medium">Contacto</Link>
          <Link href="/agendar" onClick={() => setMenuAbierto(false)} className="bg-[var(--primary)] text-white px-5 py-2 rounded-full text-sm font-medium text-center">
            Agendar cita
          </Link>
        </div>
      )}
    </header>
  );
}