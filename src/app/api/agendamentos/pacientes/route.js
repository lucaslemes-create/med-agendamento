import { NextResponse } from "next/server";
import sql from "@/lib/db";

// GET — listar todos os pacientes com total de consultas
export async function GET() {
  try {
    const pacientes = await sql`
      SELECT
        p.id,
        p.nome,
        p.telefone,
        p.email,
        p.criado_em AS "criadoEm",
        COUNT(a.id) AS "totalConsultas",
        MAX(h.data_hora) AS "ultimaConsulta"
      FROM pacientes p
      LEFT JOIN agendamentos a ON a.paciente_id = p.id
      LEFT JOIN horarios h ON h.id = a.horario_id
      GROUP BY p.id
      ORDER BY p.nome ASC
    `;

    return NextResponse.json(
      { sucesso: true, dados: pacientes },
      { status: 200 }
    );
  } catch (erro) {
    console.error("Erro ao buscar pacientes:", erro);
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao buscar pacientes." },
      { status: 500 }
    );
  }
}

// POST — cadastrar novo paciente manualmente
export async function POST(request) {
  try {
    const body = await request.json();
    const { nome, telefone, email } = body;

    if (!nome || !telefone || !email) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Campos obrigatórios: nome, telefone, email." },
        { status: 400 }
      );
    }

    const [novoPaciente] = await sql`
      INSERT INTO pacientes (nome, telefone, email)
      VALUES (${nome}, ${telefone}, ${email})
      RETURNING id, nome, telefone, email, criado_em AS "criadoEm"
    `;

    return NextResponse.json(
      { sucesso: true, dados: novoPaciente },
      { status: 201 }
    );
  } catch (erro) {
    // Erro de duplicata (UNIQUE constraint no email)
    if (erro.code === "23505") {
      return NextResponse.json(
        { sucesso: false, mensagem: "Já existe um paciente com esse email." },
        { status: 409 }
      );
    }

    console.error("Erro ao cadastrar paciente:", erro);
    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao cadastrar paciente." },
      { status: 500 }
    );
  }
}