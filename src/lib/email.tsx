import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey && process.env.NODE_ENV === "production") {
  console.warn("RESEND_API_KEY is not set. Emails will not be sent.");
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export function magicLinkEmail(url: string, host: string) {
  const safeHost = host.replace(/\./g, "&#8203;.");
  return `
  <div style="background:#0a0f0a;padding:40px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
    <div style="max-width:520px;margin:0 auto;background:linear-gradient(180deg,#101a11,#0a0f0a);border:1px solid #1b2b1e;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px -20px rgba(0,0,0,0.6)">
      <div style="padding:32px 32px 8px;text-align:center">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#d4ff3a;box-shadow:0 0 40px rgba(212,255,58,0.5);position:relative">
          <div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,0.4),transparent 55%)"></div>
          <div style="position:absolute;inset:8px;border:2px solid #0a0f0a;border-radius:50%;border-color:transparent #0a0f0a transparent #0a0f0a;transform:rotate(25deg)"></div>
        </div>
      </div>
      <div style="padding:8px 40px 32px;color:#e9efe7">
        <h1 style="font-size:24px;font-weight:700;margin:20px 0 8px;letter-spacing:-0.02em">Entrá a tu campeonato</h1>
        <p style="color:#9aa79b;line-height:1.55;margin:0 0 24px">
          Toca el botón para acceder a <strong style="color:#d4ff3a">${safeHost}</strong>.
          Este enlace expira en 10 minutos y solo puede usarse una vez.
        </p>
        <a href="${url}" style="display:inline-block;background:#d4ff3a;color:#0a0f0a;font-weight:700;padding:14px 28px;border-radius:999px;text-decoration:none;letter-spacing:0.01em;box-shadow:0 10px 30px -10px rgba(212,255,58,0.55)">
          Ingresar &rarr;
        </a>
        <p style="color:#5e6b5f;font-size:13px;margin-top:28px;line-height:1.55">
          Si no pediste este mail podés ignorarlo.<br/>
          O copiá este link: <span style="color:#9aa79b;word-break:break-all">${url}</span>
        </p>
      </div>
      <div style="padding:16px;text-align:center;border-top:1px solid #1b2b1e;background:#0c140d">
        <span style="color:#5e6b5f;font-size:12px;letter-spacing:0.12em;text-transform:uppercase">Tenis Championship</span>
      </div>
    </div>
  </div>`;
}

export function magicLinkText(url: string, host: string) {
  return `Entrá a ${host} con este enlace (expira en 10 minutos):\n\n${url}\n`;
}
