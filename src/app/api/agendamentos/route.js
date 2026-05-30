import { NextResponse } from "next/server";

// Banco de dados temporário em memória
// Futuramente: substituir por consulta ao Neon PostgreSQL
let agendamentos = [
  {
    id: 1,
    nome: "Maria Aparecida Silva",
    telefone: "(67) 99999-1111",
    email: "maria@email.com",
    motivo: "Consulta de rotina",
    dataHora: "2025-01-20T08:00",
    status: "confirmada",
  },
  {
    id: 2,
    nome: "João Carlos Souza",
    telefone: "(67) 99999-2222",
    email: "joao@email.com",
    motivo: "Dor de cabeça frequente",
    dataHora: "2025-01-20T09:00",
    status: "pendente",
  },
];

// GET — listar todos os agendamentos
export async function GET() {
  try {
    return NextResponse.json(
      { sucesso: true, dados: agendamentos },
      { status: 200 }
    );
  } catch (erro) {
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao buscar agendamentos." },
      { status: 500 }
    );
  }
}

// POST — criar novo agendamento
export async function POST(request) {
  try {
    const body = await request.json();

    const { nome, telefone, email, motivo, dataHora } = body;

    // Validação básica dos campos obrigatórios
    if (!nome || !telefone || !email || !dataHora) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Campos obrigatórios: nome, telefone, email, dataHora." },
        { status: 400 }
      );
    }

    // Cria o novo agendamento
    const novoAgendamento = {
      id: agendamentos.length + 1,
      nome,
      telefone,
      email,
      motivo: motivo || "",
      dataHora,
      status: "pendente",
    };

    agendamentos.push(novoAgendamento);

    return NextResponse.json(
      { sucesso: true, dados: novoAgendamento },
      { status: 201 }
    );
  } catch (erro) {
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao criar agendamento." },
      { status: 500 }
    );
  }
}