"use client";

import { useState } from "react";
import Link from "next/link";

export default function Agendamento() {
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    motivo: "",
    dataHora: "",
  });
  const [enviado, setEnviado] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.mensagem || "Erro ao enviar agendamento.");
        return;
      }

      setEnviado(true);
    } catch (erro) {
      console.error("Erro:", erro);
      alert("Erro ao conectar com o servidor.");
    }
  }

  if (enviado) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 max-w-md w-full text-center">
          <span className="text-5xl mb-6 block">✅</span>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Solicitação enviada!
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Em breve você receberá a confirmação da consulta no email{" "}
            <span className="font-medium text-slate-700">{form.email}</span>.
          </p>
          <button
            onClick={() => {
              setForm({ nome: "", telefone: "", email: "", motivo: "", dataHora: "" });
              setEnviado(false);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Fazer novo agendamento
          </button>
          <Link href="/" className="block mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Voltar ao início
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-6 flex items-center justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">RM</span>
          </div>
          <span className="text-slate-800 font-semibold text-sm tracking-wide">
            Dr. Rafael Rocha Milani
          </span>
        </div>
        <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
          ← Voltar
        </Link>
      </header>

      {/* Formulário */}
      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-10 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Agendar Consulta
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            Preencha os dados abaixo para solicitar seu agendamento.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Nome completo <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                placeholder="Seu nome completo"
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Telefone / WhatsApp <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                required
                placeholder="(00) 00000-0000"
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="seu@email.com"
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Data e horário desejados <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                name="dataHora"
                value={form.dataHora}
                onChange={handleChange}
                required
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Motivo da consulta
              </label>
              <textarea
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva brevemente o motivo da consulta (opcional)"
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors shadow-md shadow-blue-100"
            >
              Solicitar Agendamento
            </button>
          </form>
        </div>
      </section>

      <footer className="text-center pb-8 text-slate-400 text-xs">
        © {new Date().getFullYear()} Dr. Rafael Rocha Milani — Sistema de Agendamento
      </footer>
    </main>
  );
}