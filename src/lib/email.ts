import "server-only";
import { Resend } from "resend";
import { site } from "./site";
import type { Quote } from "./types";

const apiKey = process.env.RESEND_API_KEY;
const to = process.env.QUOTES_INBOX ?? site.email;
const from = process.env.RESEND_FROM ?? "MODUS <noreply@modus.pt>";

/**
 * Notificação por email do novo pedido de orçamento.
 * Sem RESEND_API_KEY a função não falha — apenas regista em consola,
 * para que o formulário continue funcional em desenvolvimento.
 */
export async function sendQuoteNotification(quote: Quote): Promise<{ sent: boolean }> {
  if (!apiKey) {
    console.info("[MODUS] Novo pedido de orçamento (email desativado):", quote.id, quote.email);
    return { sent: false };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: quote.email,
      subject: `Novo pedido de orçamento — ${quote.name} (${quote.projectType})`,
      text: [
        `Nome: ${quote.name}`,
        `Email: ${quote.email}`,
        `Telefone: ${quote.phone}`,
        `Tipo de projeto: ${quote.projectType}`,
        `Localização: ${quote.location}`,
        `Orçamento estimado: ${quote.budget}`,
        "",
        quote.message,
        "",
        `Recebido em ${new Date(quote.createdAt).toLocaleString("pt-PT")}`,
      ].join("\n"),
    });
    return { sent: true };
  } catch (error) {
    console.error("[MODUS] Falha ao enviar email de notificação:", error);
    return { sent: false };
  }
}
