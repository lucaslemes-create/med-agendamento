import Link from "next/link";

export default function Home() {
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
        <Link
          href="/dashboard"
          className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          Área do médico →
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-6">
          Agendamento Online
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight max-w-xl mb-6">
          Agende sua consulta de forma rápida e simples
        </h1>

        <p className="text-slate-500 text-lg max-w-md mb-12 leading-relaxed">
          Escolha o melhor horário para você. Sem filas, sem ligações —
          tudo online em poucos cliques.
        </p>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Link
            href="/agendamento"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl text-center transition-colors shadow-md shadow-blue-100"
          >
            Agendar Consulta
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold py-4 px-6 rounded-xl text-center border border-slate-200 transition-colors"
          >
            Sou Médico
          </Link>
        </div>
      </section>

      {/* Info cards */}
      <section className="w-full max-w-3xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: "📅", title: "Escolha a data", desc: "Veja os horários disponíveis em tempo real" },
          { icon: "📋", title: "Preencha os dados", desc: "Nome e telefone — simples assim" },
          { icon: "✅", title: "Consulta confirmada", desc: "Você recebe a confirmação por email" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center"
          >
            <span className="text-3xl mb-3 block">{item.icon}</span>
            <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center pb-8 text-slate-400 text-xs">
        © {new Date().getFullYear()} Dr. Rafael Rocha Milani — Sistema de Agendamento
      </footer>
    </main>
  );
}