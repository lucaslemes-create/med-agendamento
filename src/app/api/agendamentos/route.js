import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { enviarEmailConfirmacao } from "@/lib/email";

// GET — listar todos os agendamentos
export async function GET() {
  try {
    const agendamentos = await sql`
      SELECT
        a.id,
        p.nome,
        p.telefone,
        p.email,
        a.motivo,
        h.data_hora AS "dataHora",
        a.status
      FROM agendamentos a
      JOIN pacientes p ON p.id = a.paciente_id
      JOIN horarios  h ON h.id = a.horario_id
      ORDER BY h.data_hora ASC
    `;

    return NextResponse.json(
      { sucesso: true, dados: agendamentos },
      { status: 200 }
    );
  } catch (erro) {
    console.error("Erro ao buscar agendamentos:", erro);
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

    // Validação dos campos obrigatórios
    if (!nome || !telefone || !email || !dataHora) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Campos obrigatórios: nome, telefone, email, dataHora." },
        { status: 400 }
      );
    }

    // Verifica se o horário existe e está disponível
    const [horario] = await sql`
      SELECT id, disponivel FROM horarios
      WHERE data_hora = ${dataHora}
    `;

    if (!horario || !horario.disponivel) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Esse horário não está disponível." },
        { status: 409 }
      );
    }

    // Cria ou busca o paciente pelo email
    let [paciente] = await sql`
      SELECT id FROM pacientes WHERE email = ${email}
    `;

    if (!paciente) {
      [paciente] = await sql`
        INSERT INTO pacientes (nome, telefone, email)
        VALUES (${nome}, ${telefone}, ${email})
        RETURNING id
      `;
    }

    // Cria o agendamento
    const [novoAgendamento] = await sql`
      INSERT INTO agendamentos (paciente_id, horario_id, motivo, status)
      VALUES (${paciente.id}, ${horario.id}, ${motivo || ""}, 'pendente')
      RETURNING id, status
    `;

    // Bloqueia o horário
    await sql`
      UPDATE horarios SET disponivel = FALSE
      WHERE id = ${horario.id}
    `;

    // Envia email de confirmação para o paciente
    try {
      await enviarEmailConfirmacao({ nome, email, dataHora, motivo });
    } catch (erroEmail) {
      // Email falhou mas agendamento foi salvo — não bloqueia o fluxo
      console.error("Erro ao enviar email:", erroEmail);
    }

    return NextResponse.json(
      { sucesso: true, dados: { id: novoAgendamento.id, nome, email, status: novoAgendamento.status } },
      { status: 201 }
    );
  } catch (erro) {
    console.error("Erro ao criar agendamento:", erro);
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao criar agendamento." },
      { status: 500 }
    );
  }
}

// PATCH — atualizar status do agendamento
export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    const body = await request.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Informe o id e o status." },
        { status: 400 }
      );
    }

    const statusValidos = ["pendente", "confirmada", "cancelada"];
    if (!statusValidos.includes(status)) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Status inválido." },
        { status: 400 }
      );
    }

    const [atualizado] = await sql`
      UPDATE agendamentos SET status = ${status}
      WHERE id = ${id}
      RETURNING id, status
    `;

    if (!atualizado) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Agendamento não encontrado." },
        { status: 404 }
      );
    }

    // Se cancelado, libera o horário novamente
    if (status === "cancelada") {
      await sql`
        UPDATE horarios SET disponivel = TRUE
        WHERE id = (
          SELECT horario_id FROM agendamentos WHERE id = ${id}
        )
      `;
    }

    return NextResponse.json(
      { sucesso: true, dados: atualizado },
      { status: 200 }
    );
  } catch (erro) {
    console.error("Erro ao atualizar agendamento:", erro);
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao atualizar agendamento." },
      { status: 500 }
    );
  }
}