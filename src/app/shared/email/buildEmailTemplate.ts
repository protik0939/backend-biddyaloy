type BuildEmailTemplateOptions = {
  subject: string;
  previewText?: string;
  heading: string;
  bodyText: string;
  helperText?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
};

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildEmailTemplate(options: BuildEmailTemplateOptions): string {
  const previewText = options.previewText ? escapeHtml(options.previewText) : "";
  const heading = escapeHtml(options.heading);
  const bodyText = escapeHtml(options.bodyText).replace(/\n/g, "<br />");
  const helperText = options.helperText
    ? `<p style=\"margin:16px 0 0;color:#5f6774;font-size:14px;line-height:1.6;\">${escapeHtml(options.helperText)}</p>`
    : "";

  const cta =
    options.ctaLabel && options.ctaUrl
      ? `<a href=\"${escapeHtml(options.ctaUrl)}\" style=\"display:inline-block;margin-top:20px;background:#0f766e;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;font-size:14px;\">${escapeHtml(options.ctaLabel)}</a>`
      : "";

  const footerNote = options.footerNote
    ? `<p style=\"margin:0;color:#7a8393;font-size:12px;line-height:1.6;\">${escapeHtml(options.footerNote)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>${escapeHtml(options.subject)}</title>
  </head>
  <body style=\"margin:0;padding:0;background:#f4f6fb;font-family:Segoe UI,Arial,sans-serif;\">
    <span style=\"display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden;\">${previewText}</span>
    <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"padding:24px 12px;\">
      <tr>
        <td align=\"center\">
          <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"max-width:560px;background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e5e9f2;\">
            <tr>
              <td>
                <p style=\"margin:0 0 8px;color:#0f766e;font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase;\">Biddyaloy</p>
                <h1 style=\"margin:0;color:#111827;font-size:24px;line-height:1.3;\">${heading}</h1>
                <p style=\"margin:16px 0 0;color:#364153;font-size:15px;line-height:1.7;\">${bodyText}</p>
                ${helperText}
                ${cta}
              </td>
            </tr>
          </table>
          <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"max-width:560px;margin-top:10px;padding:0 8px;\">
            <tr>
              <td align=\"center\">${footerNote}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
