import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmailConfirmacao({ nome, email, dataHora, motivo }) {
  const dataFormatada = new Date(dataHora).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const horaFormatada = new Date(dataHora).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  await resend.emails.send({
    from: "Consultório Dr. Rafael <onboarding@resend.dev>",
    to: email,
    subject: "✅ Consulta agendada com sucesso!",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
        
        <div style="background: #2563eb; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Dr. Rafael Rocha Milani</h1>
          <p style="color: #bfdbfe; margin: 4px 0 0; font-size: 13px;">Sistema de Agendamento</p>
        </div>

        <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b; margin: 0 0 16px; font-size: 18px;">Consulta confirmada! ✅</h2>
          <p style="color: #64748b; margin: 0 0 20px;">Olá, <strong>${nome}</strong>! Sua consulta foi agendada com sucesso.</p>
          
          <div style="background: #f1f5f9; border-radius: 8px; padding: 16px;">
            <p style="margin: 0 0 8px; color: #475569; font-size: 14px;">
              📅 <strong>Data:</strong> ${dataFormatada}
            </p>
            <p style="margin: 0 0 8px; color: #475569; font-size: 14px;">
              🕐 <strong>Horário:</strong> ${horaFormatada}
            </p>
            ${motivo ? `
            <p style="margin: 0; color: #475569; font-size: 14px;">
              📋 <strong>Motivo:</strong> ${motivo}
            </p>` : ""}
          </div>
        </div>

        <div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
          <p style="margin: 0; color: #92400e; font-size: 13px;">
            ⚠️ Caso precise cancelar ou remarcar, entre em contato com antecedência.
          </p>
        </div>

        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          © ${new Date().getFullYear()} Dr. Rafael Rocha Milani — Sistema de Agendamento
        </p>

      </div>
    `,
  });
}