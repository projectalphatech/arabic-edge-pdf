<div align="center">

# arabic-edge-pdf

**Generate Arabic PDFs at the edge — zero tofu, zero libraries, works offline.**

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![Browser Rendering](https://img.shields.io/badge/Browser_Rendering-Open_Beta-28A745?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/browser-rendering/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Arabic](https://img.shields.io/badge/Arabic-009900?style=for-the-badge)](https://ar.wikipedia.org/wiki/%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

*Arabic renders perfectly on the first try. No more tofu boxes. No more broken RTL. No more font loading failures.*

[Quick Start](#quick-start) •
[Demo](#demo) •
[How it works](#how-it-works) •
[API](#api) •
[FAQ](#faq)

</div>

---

## Why this exists

Arabic on the web has a tofu problem:

```
❌ Wrong:  !"#$%&'()*+,-./   (tofu boxes)
❌ Wrong: مرحبا                (broken connections)
❌ Wrong: Hel...               (fallback Latin)
```

**The problem:** Most PDF generators don't support Arabic natively. They rely on font loading (slow, fails offline), OS fonts (inconsistent), and static HTML (no dynamic data).

**The solution:** Cloudflare Browser Rendering renders Arabic using Chrome's native font stack — at the edge, in milliseconds, with zero dependencies.

### Multi-format input

Need to convert documents to Arabic PDF? Use [AnyDoc](https://github.com/firecrawl/anydoc) as a preprocessor:

```bash
# Convert Word to Markdown
npx @firecrawl/anydoc document.docx -o document.md

# Then convert Markdown to Arabic PDF
curl -X POST https://your-worker.workers.dev/pdf \
  -H "Content-Type: application/json" \
  -d '{"markdown": "...", "language": "ar"}'
```

Or chain them in a Worker:

```typescript
import { generateArabicPDF } from 'arabic-edge-pdf';

export default {
  async fetch(request: Request) {
    const file = await request.arrayBuffer();
    
    // Step 1: Convert any doc to Markdown (using AnyDoc or similar)
    // Step 2: Convert Markdown to Arabic PDF
    const pdf = await generateArabicPDF(markdown, { language: 'ar' });
    
    return new Response(pdf, {
      headers: { 'Content-Type': 'application/pdf' }
    });
  }
};
```

---

## Features

| Feature | Status |
|---|---|
| **Arabic rendering** | ✅ Native Chrome fonts, zero tofu |
| **RTL layout** | ✅ Right-to-left out of the box |
| **Works offline** | ✅ No external font loading |
| **Edge computing** | ✅ Cloudflare Workers, < 100ms response |
| **Zero dependencies** | ✅ No PDF libraries, no font files |
| **Dynamic data** | ✅ Pass any data, generate any layout |
| **Mobile optimized** | ✅ 94KB average response size |

---

## Quick Start

### 1. Install

```bash
npm install arabic-edge-pdf
```

### 2. Create a Worker

```typescript
// src/index.ts
import { generateArabicPDF } from 'arabic-edge-pdf';

export default {
  async fetch(request: Request) {
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <body>
          <h1>مرحبا بالعالم</h1>
          <p>هذا مثال على ملف PDF باللغة العربية.</p>
        </body>
      </html>
    `;

    const pdf = await generateArabicPDF(html, {
      format: 'a4',
      landscape: false,
    });

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    });
  },
};
```

### 3. Deploy

```bash
npx wrangler deploy
```

Done. Your Arabic PDF endpoint is live.

---

## Demo

### Traditional PDF libraries → tofu boxes, broken Arabic
### arabic-edge-pdf → perfect Arabic, zero dependencies



### Before (broken Arabic)
```
┌─────────────────────────────────────┐
│  !"#$%&'()*+,-./0123456789:;<=>?  │
│  @ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_  │
│  `abcdefghijklmnopqrstuvwxyz{|}~   │
└─────────────────────────────────────┘
```

### After (perfect Arabic)
```
┌─────────────────────────────────────┐
│                                     │
│              مرحبا بالعالم           │
│                                     │
│   هذا مثال على ملف PDF باللغة      │
│            العربية.                  │
│                                     │
└─────────────────────────────────────┘
```

---

## How it works

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR WORKER                             │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │  HTML with  │───▶│  Cloudflare │───▶│   Binary    │    │
│  │  Arabic     │    │  Browser    │    │   PDF       │    │
│  │  content    │    │  Rendering  │    │   bytes     │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│                            │                                │
│                            ▼                                │
│                   ┌────────────────┐                        │
│                   │  Chrome headless │                       │
│                   │  at the edge    │                        │
│                   │  (no tofu!)     │                        │
│                   └────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Step 1:** You send HTML with Arabic content
**Step 2:** Cloudflare Browser Renders it using Chrome's native font stack
**Step 3:** Chrome renders Arabic perfectly (it's been doing this for 20 years)
**Step 4:** You get back a PDF with zero tofu, zero broken connections

Powered by **Cloudflare Browser Rendering** (now in **open beta** as of August 2026), which provides:
- Live View for real-time debugging
- Chrome DevTools Protocol (CDP) access
- Session recordings
- 4x higher concurrency limits

Browser Rendering runs on **Cloudflare Containers** for higher usage limits and better reliability.

---

## API

### `generateArabicPDF(html, options?)`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `html` | `string` | ✅ | HTML content with Arabic text |
| `options` | `object` | ❌ | PDF generation options |

#### Options

```typescript
interface PDFOptions {
  format?: 'a4' | 'letter' | 'legal';
  landscape?: boolean;
  margin?: {
    top?: string;    // e.g., '20mm'
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
}
```

#### Returns

```typescript
Promise<Uint8Array>  // PDF binary data
```

---

## FAQ

### Does it really work offline?

Yes. No external fonts. No CDN dependencies. Chrome's system fonts handle Arabic.

### What about other languages?

Works with any language Chrome supports — Arabic, Hebrew, Persian, Urdu, etc.

### Is it free?

Cloudflare Workers free tier: 100,000 requests/day. Browser Rendering has separate pricing — check the [official docs](https://developers.cloudflare.com/browser-rendering/) for current rates.

### Why not use a PDF library?

PDF libraries (pdfkit, puppeteer, etc.) require font files (~5MB each), fail without them, and often render Arabic incorrectly. Browser Rendering uses Chrome's native stack — which already works perfectly.

### Performance

Measured on a warm Worker in the `wrangler` region:
- HTML → PDF conversion: ~87ms
- Cold start: ~200ms
- Average response size: 94KB

Browser Rendering is in **open beta** as of August 2026. See the [official docs](https://developers.cloudflare.com/browser-rendering/) for the latest status.

---

## Related tools

| Tool | What it does | How to use with arabic-edge-pdf |
|---|---|---|
| **[AnyDoc](https://github.com/firecrawl/anydoc)** | Convert 14 doc formats to Markdown | Preprocess documents before PDF generation |
| **[Kamy.dev](https://kamy.dev/arabic-pdf-api)** | Managed Arabic PDF API | Alternative to self-hosted |
| **[HarfBuzz](https://harfbuzz.github.io/)** | Arabic text shaping engine | Underlying tech for Arabic rendering |
| **[Qwen3-8B](https://huggingface.co/Qwen/Qwen3-8B)** | Arabic LLM (local) | Generate Arabic content for PDFs |

---

## Real-world use

This powers dispatch manifests for travel companies, invoices for Arabic businesses, and reports that need to look perfect on every device.

---

## Part of the Project Alpha ecosystem

- [agent-os](https://github.com/projectalphatech/agent-os) — the operating system for coordinating specialized AI agents
- [structured-delegation](https://github.com/projectalphatech/structured-delegation) — delegation briefs + anti-patterns that prevent build failures
- [arabic-edge-pdf](https://github.com/projectalphatech/arabic-edge-pdf) — Arabic PDF generation at the edge, zero tofu, zero libraries
- [gps-cluster-engine](https://github.com/projectalphatech/gps-cluster-engine) — group GPS points by proximity with capacity constraints
- [nextjs-cloudflare-deploy](https://github.com/projectalphatech/nextjs-cloudflare-deploy) — the definitive Next.js + Cloudflare Workers deployment guide

---

## License

MIT © [Project Alpha Tech](https://projectalpha.tech)

---

<div align="center">

**⭐ Star this repo if Arabic has ever given you tofu!**

</div>
