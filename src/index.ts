// src/index.ts
// Arabic PDF generation on Cloudflare Workers using Browser Rendering

export interface PDFOptions {
  format?: 'a4' | 'letter' | 'legal';
  landscape?: boolean;
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
}

/**
 * Generate an Arabic PDF from HTML using Cloudflare Browser Rendering.
 * No external fonts. No tofu. No broken RTL.
 */
export async function generateArabicPDF(
  html: string,
  options: PDFOptions = {}
): Promise<Uint8Array> {
  const {
    format = 'a4',
    landscape = false,
    margin,
    printBackground = true,
  } = options;

  // Wrap HTML with proper Arabic document structure
  const fullHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <style>
          @page {
            size: ${format} ${landscape ? 'landscape' : 'portrait'};
            margin: ${margin ? `${margin.top || '20mm'} ${margin.right || '20mm'} ${margin.bottom || '20mm'} ${margin.left || '20mm'}` : '20mm'};
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            direction: rtl;
            text-align: right;
            line-height: 1.6;
            padding: 20mm;
          }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `;

  // Use Cloudflare Browser Rendering API
  const response = await fetch('https://browser-render.workers.dev/pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      html: fullHtml,
      format,
      landscape,
      printBackground,
    }),
  });

  if (!response.ok) {
    throw new Error(`PDF generation failed: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export default generateArabicPDF;
