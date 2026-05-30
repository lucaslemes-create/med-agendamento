import { NextResponse } from "next/server";
import sql from "@/lib/db";

// GET — listar horários (opcionalmente só os disponíveis)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const apenasDisponiveis = searchParams.get("disponivel") === "true";

    const horarios = apenasDisponiveis
      ? await sql`
          SELECT id, data_hora AS "dataHora", disponivel
          FROM horarios
          WHERE disponivel = TRUE
          ORDER BY data_hora ASC
        `
      : await sql`
          SELECT id, data_hora AS "dataHora", disponivel
          FROM horarios
          ORDER BY data_hora ASC
        `;

    return NextResponse.json(
      { sucesso: true, dados: horarios },
      { status: 200 }
    );
  } catch (erro) {
    console.error("Erro ao buscar horários:", erro);
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao buscar horários." },
      { status: 500 }
    );
  }
}

// POST — adicionar novo horário
export async function POST(request) {
  try {
    const body = await request.json();
    const { dataHora } = body;

    if (!dataHora) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Campo obrigatório: dataHora." },
        { status: 400 }
      );
    }

    const [novoHorario] = await sql`
      INSERT INTO horarios (data_hora, disponivel)
      VALUES (${dataHora}, TRUE)
      RETURNING id, data_hora AS "dataHora", disponivel
    `;

    return NextResponse.json(
      { sucesso: true, dados: novoHorario },
      { status: 201 }
    );
  } catch (erro) {
    // Erro de duplicata (UNIQUE constraint)
    if (erro.code === "23505") {
      return NextResponse.json(
        { sucesso: false, mensagem: "Esse horário já está cadastrado." },
        { status: 409 }
      );
    }

    console.error("Erro ao adicionar horário:", erro);
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao adicionar horário." },
      { status: 500 }
    );
  }
}

// DELETE — bloquear horário pelo id
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Informe o id do horário." },
        { status: 400 }
      );
    }

    const [horario] = await sql`
      UPDATE horarios SET disponivel = FALSE
      WHERE id = ${id}
      RETURNING id, data_hora AS "dataHora", disponivel
    `;

    if (!horario) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Horário não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { sucesso: true, mensagem: "Horário bloqueado com sucesso.", dados: horario },
      { status: 200 }
    );
  } catch (erro) {
    console.error("Erro ao bloquear horário:", erro);
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao bloquear horário." },
      { status: 500 }
    );
  }
}