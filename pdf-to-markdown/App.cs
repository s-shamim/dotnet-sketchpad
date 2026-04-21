#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package PdfPig@0.1.14
#:package Tesseract@5.2.0
#:package SixLabors.ImageSharp@3.1.12

using System.Text;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;
using Tesseract;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Png;
using PdfPage = UglyToad.PdfPig.Content.Page;

var builder = WebApplication.CreateBuilder();
builder.Services.AddSingleton<PdfConverter>();
builder.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = 250 * 1024 * 1024); // 250MB

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// ── Upload + convert endpoint ────────────────────────────────────────────────

app.MapPost("/api/convert", async (HttpRequest request, PdfConverter converter) =>
{
    if (!request.HasFormContentType)
        return Results.BadRequest(new { error = "Expected multipart/form-data." });

    var form = await request.ReadFormAsync();
    var file = form.Files.GetFile("pdf");
    if (file is null || file.Length == 0)
        return Results.BadRequest(new { error = "No PDF file uploaded." });

    if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
        return Results.BadRequest(new { error = "Only PDF files are accepted." });

    try
    {
        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);
        stream.Position = 0;

        var markdown = converter.Convert(stream);

        var bytes = Encoding.UTF8.GetBytes(markdown);
        var name = Path.GetFileNameWithoutExtension(file.FileName) + ".md";

        return Results.File(bytes, "text/markdown; charset=utf-8", fileDownloadName: name);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

// ── SSE progress endpoint ────────────────────────────────────────────────────

app.MapPost("/api/convert-stream", async (HttpRequest request, HttpResponse response, PdfConverter converter) =>
{
    if (!request.HasFormContentType)
    {
        response.StatusCode = 400;
        return;
    }

    var form = await request.ReadFormAsync();
    var file = form.Files.GetFile("pdf");
    if (file is null || file.Length == 0)
    {
        response.StatusCode = 400;
        return;
    }

    using var stream = new MemoryStream();
    await file.CopyToAsync(stream);
    stream.Position = 0;

    response.ContentType = "text/event-stream";
    response.Headers["Cache-Control"] = "no-cache";

    var writer = new StreamWriter(response.Body);

    var result = converter.ConvertWithProgress(stream, async (page, total) =>
    {
        await writer.WriteAsync($"data: {{\"page\":{page},\"total\":{total}}}\n\n");
        await writer.FlushAsync();
    });

    await result;

    await writer.WriteAsync($"data: {{\"done\":true,\"markdown\":{System.Text.Json.JsonSerializer.Serialize(converter.LastResult)}}}\n\n");
    await writer.FlushAsync();
});

app.Run();

// ── PDF Converter ────────────────────────────────────────────────────────────

class PdfConverter
{
    private readonly ILogger<PdfConverter> _log;
    public string LastResult { get; private set; } = "";

    public PdfConverter(ILogger<PdfConverter> log) => _log = log;

    public string Convert(Stream pdfStream)
    {
        var sb = new StringBuilder();
        using var doc = PdfDocument.Open(pdfStream);

        var fontStats = AnalyzeFontSizes(doc);

        for (int i = 1; i <= doc.NumberOfPages; i++)
        {
            var page = doc.GetPage(i);
            var pageText = ExtractPageMarkdown(page, fontStats, i);

            if (!string.IsNullOrWhiteSpace(pageText))
            {
                sb.AppendLine(pageText);
                if (i < doc.NumberOfPages)
                    sb.AppendLine("\n---\n");
            }
        }

        return sb.ToString().TrimEnd();
    }

    public async Task ConvertWithProgress(Stream pdfStream, Func<int, int, Task> onProgress)
    {
        var sb = new StringBuilder();
        using var doc = PdfDocument.Open(pdfStream);

        var fontStats = AnalyzeFontSizes(doc);

        for (int i = 1; i <= doc.NumberOfPages; i++)
        {
            var page = doc.GetPage(i);
            var pageText = ExtractPageMarkdown(page, fontStats, i);

            if (!string.IsNullOrWhiteSpace(pageText))
            {
                sb.AppendLine(pageText);
                if (i < doc.NumberOfPages)
                    sb.AppendLine("\n---\n");
            }

            await onProgress(i, doc.NumberOfPages);
        }

        LastResult = sb.ToString().TrimEnd();
    }

    // ── Font analysis — build heading thresholds ─────────────────────────────

    FontProfile AnalyzeFontSizes(PdfDocument doc)
    {
        var sizes = new Dictionary<double, int>();
        var fontNames = new Dictionary<double, HashSet<string>>();
        int samplePages = Math.Min(doc.NumberOfPages, 50);

        for (int i = 1; i <= samplePages; i++)
        {
            var page = doc.GetPage(i);
            foreach (var word in page.GetWords())
            {
                var sz = Math.Round(word.Letters[0].FontSize, 1);
                sizes[sz] = sizes.GetValueOrDefault(sz) + 1;

                if (!fontNames.ContainsKey(sz))
                    fontNames[sz] = [];
                fontNames[sz].Add(word.Letters[0].FontName ?? "");
            }
        }

        if (sizes.Count == 0)
            return new FontProfile(12, []);

        // Body text = most frequent font size
        var bodySize = sizes.OrderByDescending(kv => kv.Value).First().Key;

        // Heading sizes = sizes larger than body, sorted descending
        var headingSizes = sizes.Keys
            .Where(s => s > bodySize + 0.5)
            .OrderByDescending(s => s)
            .Take(6)
            .ToList();

        // Detect monospace fonts
        var monoFonts = fontNames
            .SelectMany(kv => kv.Value)
            .Where(f => IsMonospaceFont(f))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        return new FontProfile(bodySize, headingSizes, monoFonts);
    }

    static bool IsMonospaceFont(string fontName)
    {
        if (string.IsNullOrEmpty(fontName)) return false;
        var lower = fontName.ToLowerInvariant();
        return lower.Contains("courier") || lower.Contains("consola") || lower.Contains("mono")
            || lower.Contains("menlo") || lower.Contains("firacode") || lower.Contains("source code")
            || lower.Contains("inconsolata") || lower.Contains("jetbrains");
    }

    // ── Per-page extraction ──────────────────────────────────────────────────

    string ExtractPageMarkdown(PdfPage page, FontProfile fontProfile, int pageNum)
    {
        var words = page.GetWords().ToList();

        // Page classification: if very few words, might be scanned
        if (words.Count < 5)
        {
            // Try OCR on page images
            var images = page.GetImages().ToList();
            if (images.Count > 0)
            {
                _log.LogInformation("Page {Page}: scanned — attempting OCR ({ImageCount} images)", pageNum, images.Count);
                return TryOcrPage(images);
            }
            // Truly empty page
            if (words.Count == 0) return "";
        }

        return BuildMarkdownFromWords(words, fontProfile);
    }

    // ── Digital text → Markdown ──────────────────────────────────────────────

    string BuildMarkdownFromWords(List<Word> words, FontProfile profile)
    {
        if (words.Count == 0) return "";

        var sb = new StringBuilder();
        var lines = GroupWordsIntoLines(words);

        bool inCodeBlock = false;
        var codeBuffer = new StringBuilder();

        foreach (var line in lines)
        {
            var fontSize = Math.Round(line.Words[0].Letters[0].FontSize, 1);
            var fontName = line.Words[0].Letters[0].FontName ?? "";
            var text = string.Join(" ", line.Words.Select(w => w.Text));
            var isBold = line.Words.Any(w => w.Letters[0].FontName?.Contains("Bold") == true
                                          || w.Letters[0].FontName?.Contains("bold") == true);
            var isMono = IsMonospaceFont(fontName);

            // Code block detection
            if (isMono && !inCodeBlock)
            {
                inCodeBlock = true;
                codeBuffer.Clear();
                codeBuffer.AppendLine(text);
                continue;
            }
            if (inCodeBlock && isMono)
            {
                codeBuffer.AppendLine(text);
                continue;
            }
            if (inCodeBlock && !isMono)
            {
                sb.AppendLine("```");
                sb.Append(codeBuffer);
                sb.AppendLine("```");
                sb.AppendLine();
                inCodeBlock = false;
            }

            // Heading detection
            int headingLevel = GetHeadingLevel(fontSize, profile);
            if (headingLevel > 0 && text.Length < 200)
            {
                sb.AppendLine();
                sb.Append(new string('#', headingLevel));
                sb.Append(' ');
                sb.AppendLine(text);
                sb.AppendLine();
                continue;
            }

            // Bold paragraph
            if (isBold && text.Length < 200 && !text.Contains(' ') == false)
            {
                sb.AppendLine($"**{text}**");
                sb.AppendLine();
                continue;
            }

            // Regular text
            sb.AppendLine(text);
        }

        // Close any remaining code block
        if (inCodeBlock)
        {
            sb.AppendLine("```");
            sb.Append(codeBuffer);
            sb.AppendLine("```");
        }

        return sb.ToString();
    }

    int GetHeadingLevel(double fontSize, FontProfile profile)
    {
        for (int i = 0; i < profile.HeadingSizes.Count; i++)
        {
            if (Math.Abs(fontSize - profile.HeadingSizes[i]) < 0.5)
                return i + 1; // H1, H2, etc.
        }
        return 0;
    }

    // ── Group words into lines by Y position ─────────────────────────────────

    List<TextLine> GroupWordsIntoLines(List<Word> words)
    {
        if (words.Count == 0) return [];

        var sorted = words.OrderByDescending(w => w.BoundingBox.Bottom).ThenBy(w => w.BoundingBox.Left).ToList();
        var lines = new List<TextLine>();
        var currentLine = new TextLine { Words = [sorted[0]], Y = sorted[0].BoundingBox.Bottom };

        for (int i = 1; i < sorted.Count; i++)
        {
            var word = sorted[i];
            // Same line if Y positions are within tolerance
            if (Math.Abs(word.BoundingBox.Bottom - currentLine.Y) < 3)
            {
                currentLine.Words.Add(word);
            }
            else
            {
                // Sort words left-to-right within line
                currentLine.Words.Sort((a, b) => a.BoundingBox.Left.CompareTo(b.BoundingBox.Left));
                lines.Add(currentLine);
                currentLine = new TextLine { Words = [word], Y = word.BoundingBox.Bottom };
            }
        }

        currentLine.Words.Sort((a, b) => a.BoundingBox.Left.CompareTo(b.BoundingBox.Left));
        lines.Add(currentLine);

        return lines;
    }

    // ── OCR fallback for scanned pages ───────────────────────────────────────

    string TryOcrPage(List<IPdfImage> images)
    {
        var sb = new StringBuilder();

        try
        {
            var tessDataPath = FindTessDataPath();
            if (tessDataPath is null)
            {
                sb.AppendLine("<!-- OCR unavailable: Tesseract not found. Install via: choco install tesseract -->");
                return sb.ToString();
            }

            using var engine = new TesseractEngine(tessDataPath, "eng", EngineMode.Default);

            foreach (var image in images)
            {
                try
                {
                    var rawBytes = image.RawBytes.ToArray();
                    using var img = SixLabors.ImageSharp.Image.Load<Rgba32>(rawBytes);

                    // Preprocess: convert to grayscale, increase contrast
                    img.Mutate(x => x.Grayscale().Contrast(1.2f));

                    using var ms = new MemoryStream();
                    img.Save(ms, new PngEncoder());
                    ms.Position = 0;

                    using var pix = Pix.LoadFromMemory(ms.ToArray());
                    using var result = engine.Process(pix);

                    var text = result.GetText()?.Trim();
                    if (!string.IsNullOrEmpty(text))
                        sb.AppendLine(text);
                }
                catch (Exception ex)
                {
                    _log.LogWarning("OCR failed for image: {Error}", ex.Message);
                    sb.AppendLine($"<!-- OCR failed for image: {ex.Message} -->");
                }
            }
        }
        catch (Exception ex)
        {
            _log.LogWarning("Tesseract init failed: {Error}", ex.Message);
            sb.AppendLine($"<!-- Tesseract init failed: {ex.Message} -->");
        }

        return sb.ToString();
    }

    static string? FindTessDataPath()
    {
        // Common Tesseract data paths on Windows
        string[] candidates =
        [
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Tesseract-OCR", "tessdata"),
            @"C:\Program Files\Tesseract-OCR\tessdata",
            @"C:\Program Files (x86)\Tesseract-OCR\tessdata",
            Path.Combine(AppContext.BaseDirectory, "tessdata"),
        ];

        // Check TESSDATA_PREFIX env var first
        var envPath = Environment.GetEnvironmentVariable("TESSDATA_PREFIX");
        if (!string.IsNullOrEmpty(envPath) && Directory.Exists(envPath))
            return envPath;

        foreach (var path in candidates)
        {
            if (Directory.Exists(path))
                return path;
        }

        return null;
    }
}

// ── Supporting types ─────────────────────────────────────────────────────────

record FontProfile(double BodySize, List<double> HeadingSizes, HashSet<string>? MonoFonts = null);

class TextLine
{
    public List<Word> Words { get; set; } = [];
    public double Y { get; set; }
}
