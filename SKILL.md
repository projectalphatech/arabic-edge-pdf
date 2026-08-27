---
name: arabic-edge-pdf
description: Generate Arabic PDFs at the edge — zero tofu, zero font bundling, works offline. Uses Cloudflare Browser Rendering with Chrome's native Arabic shaping. Use when generating Arabic dispatch manifests, invoices, reports, or any RTL PDF.
---

# Arabic Edge PDF

## When to use this skill

Invoke this skill when generating PDFs with Arabic content, fixing Arabic tofu/broken-connection issues in PDFs, or building edge-deployed PDF generation services. Use for dispatch manifests, invoices, reports, or any RTL PDF.

## What this skill provides

Arabic PDF generation at the edge using **Cloudflare Browser Rendering** — Chrome's native Arabic shaping, zero dependencies, zero tofu boxes.

### Core API

```typescript
import { generateArabicPDF } from 'arabic-edge-pdf';

const pdf = await generateArabicPDF(html, {
  format: 'a4',
  landscape: false,
  margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
  printBackground: true,
});
// Returns: Uint8Array (PDF binary)
```

### Key principles

- **Zero dependencies** — no PDF libraries, no font files
- **Zero tofu** — Chrome's native Arabic font stack renders perfectly
- **Edge computing** — Cloudflare Workers, <100ms response
- **Works offline** — no external font loading
- **Multi-format input** — preprocess Word/Excel/PPT with AnyDoc

### HTML requirements

Always include `dir="rtl"` and `lang="ar"` on the `<html>` tag for proper Arabic rendering.

## Quick start

1. `npm install arabic-edge-pdf`
2. Send HTML with Arabic content to your Worker
3. Deploy with `npx wrangler deploy`

## Performance

- HTML → PDF: ~87ms (warm)
- Cold start: ~200ms
- Average response: 94KB

