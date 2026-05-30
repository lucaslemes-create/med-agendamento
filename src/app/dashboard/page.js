"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const statusStyle = {
  confirmada: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  pendente: "bg-amber-50 text-amber-600 border border-amber-100",
  cancelada: "bg-red-50 text-red-500 border border-red-100",
};

const statusLabel = {
  confirmada: "Confirmada",
  pendente: "Pendente",
  cancelada: "Cancelada",
};

export default function Dashboard() {
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  async function buscarAgendamentos() {
    try {
      setCarregando(true);
      const response = await fetch("/api/agendamentos");
      const data = await response.json();

      if (!response.ok) {
        setErro(data.mensagem || "Erro ao buscar agendamentos.");
        return;
      }

      setConsultas(data.dados);
      setErro(null);
    } catch (erro) {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  async function atualizarStatus(id, novoStatus) {
    try {
      const response = await fetch(`/api/agendamentos?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.mensagem || "Erro ao atualizar consulta.");
        return;
      }

      // Atualiza o estado local sem precisar recarregar tudo
      setConsultas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: novoStatus } : c))
      );
    } catch (erro) {
      alert("Erro ao conectar com o servidor.");
    }
  }

  const consultasFiltradas =
    filtro === "todas" ? consultas : consultas.filter((c) => c.status === filtro);

  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const stats = [
    { label: "Consultas hoje",    valor: consultas.length,                                              icon: "📅", cor: "bg-blue-50 text-blue-600"   },
    { label: "Próximas consultas", valor: consultas.filter((c) => c.status !== "cancelada").length,     icon: "🗓️", cor: "bg-violet-50 text-violet-600" },
    { label: "Pendentes",         valor: consultas.filter((c) => c.status === "pendente").length,       icon: "🕐", cor: "bg-emerald-50 text-emerald-600"},
    { label: "Total de pacientes", valor: [...new Set(consultas.map((c) => c.email))].length,           icon: "👤", cor: "bg-amber-50 text-amber-600"   },
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-5 flex items-center justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">RM</span>
          </div>
          <div>
            <p className="text-slate-800 font-semibold text-sm">Dr. Rafael Rocha Milani</p>
            <p className="text-slate-400 text-xs capitalize">{hoje}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={buscarAgendamentos}
            className="text-xs text-slate-400 hover:text-blue-600 transition-colors"
          >
            ↻ Atualizar
          </button>
          <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
            ← Sair
          </Link>
        </div>
      </header>

      <div className="w-full max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-2">
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${s.cor}`}>
                {s.icon}
              </span>
              <p className="text-2xl font-bold text-slate-800">{s.valor}</p>
              <p className="text-xs text-slate-400 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Agenda */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-lg font-bold text-slate-800">Agenda de hoje</h2>

            {/* Filtros */}
            <div className="flex gap-2 text-xs font-medium">
              {["todas", "confirmada", "pendente", "cancelada"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className={`px-3 py-1.5 rounded-full border transition-colors capitalize ${
                    filtro === f
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"
                  }`}
                >
                  {f === "todas" ? "Todas" : statusLabel[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Estados */}
          {carregando && (
            <p className="text-slate-400 text-sm text-center py-8">Carregando consultas...</p>
          )}

          {!carregando && erro && (
            <p className="text-red-400 text-sm text-center py-8">{erro}</p>
          )}

          {!carregando && !erro && consultasFiltradas.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-8">Nenhuma consulta encontrada.</p>
          )}

          {!carregando && !erro && (
            <div className="flex flex-col gap-3">
              {consultasFiltradas.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  {/* Horário */}
                  <div className="min-w-[48px] text-center">
                    <p className="text-sm font-bold text-blue-600">
                      {new Date(c.dataHora).toLocaleTimeString("pt-BR", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="w-px h-8 bg-slate-100" />

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{c.nome}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.motivo || "Sem motivo informado"}</p>
                  </div>

                  {/* Status */}
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyle[c.status]}`}>
                    {statusLabel[c.status]}
                  </span>

                  {/* Ações */}
                  <div className="flex gap-3">
                    {c.status === "pendente" && (
                      <button
                        onClick={() => atualizarStatus(c.id, "confirmada")}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                      >
                        Confirmar
                      </button>
                    )}
                    {c.status !== "cancelada" && (
                      <button
                        onClick={() => atualizarStatus(c.id, "cancelada")}
                        className="text-xs text-red-400 hover:text-red-500 font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center pb-8 text-slate-400 text-xs mt-auto">
        © {new Date().getFullYear()} Dr. Rafael Rocha Milani — Sistema de Agendamento
      </footer>
    </main>
  );
}