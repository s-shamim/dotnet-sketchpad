# PDF to Markdown — Prerequisites

## 1. .NET 10 SDK

Required to run the app.

Download: https://dotnet.microsoft.com/download/dotnet/10.0

---

## 2. Tesseract OCR (optional — for scanned pages)

Only needed if your PDF contains scanned/image-based pages. Digital/searchable PDFs work without it.

### Windows (Chocolatey)

```bash
choco install tesseract
```

### Windows (Manual)

1. Download installer from https://github.com/UB-Mannheim/tesseract/wiki
2. Run installer — default path: `C:\Program Files\Tesseract-OCR`
3. Ensure `tessdata` folder exists inside the install directory

### Verify Installation

```bash
tesseract --version
```

Expected output: `tesseract v5.x.x`

### Environment Variable (if non-standard install path)

Set `TESSDATA_PREFIX` to your `tessdata` folder path:

```bash
$env:TESSDATA_PREFIX = "C:\Program Files\Tesseract-OCR\tessdata"
```

---

## 3. Running the App

```bash
dotnet run pdf-to-markdown/App.cs
```

Opens at http://localhost:5116

---

## How It Works

| PDF Type | Method | Dependency |
|----------|--------|------------|
| Digital/searchable text | PdfPig font + layout analysis | None (built-in) |
| Scanned/image pages | Tesseract OCR | Tesseract 5 binary |
| Mixed | Auto-detects per page | Tesseract for scanned pages |

### Pipeline

1. **Upload** — drag & drop PDF via web UI
2. **Classify** — each page checked for extractable text (>5 words = digital)
3. **Digital path** — PdfPig extracts words with font size + position → heading levels clustered by font size, monospace fonts → code blocks
4. **Scanned path** — embedded images passed to Tesseract OCR
5. **Assemble** — all pages joined with `---` separators
6. **Download** — returns `.md` file

### Limitations

- **Tables** — heuristic detection (~70-80% accuracy). Complex merged-cell tables may not convert cleanly
- **Diagrams/images** — extracted as images, not described as text
- **Code blocks** — detected via monospace font heuristic (Courier, Consolas, etc.)
- **Processing time** — 600 scanned pages ≈ 10-30 min depending on hardware. Digital pages are fast
- **OCR quality** — depends on scan resolution. 300 DPI+ recommended
