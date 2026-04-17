#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package Markdig@0.40.0
#:package DocumentFormat.OpenXml@3.1.0

using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Markdig;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using MdTable     = Markdig.Extensions.Tables.Table;
using MdTableRow  = Markdig.Extensions.Tables.TableRow;
using MdTableCell = Markdig.Extensions.Tables.TableCell;

var builder = WebApplication.CreateBuilder();
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapPost("/api/convert", (ConvertRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Markdown))
        return Results.BadRequest(new { error = "Markdown content is empty." });

    try
    {
        var pipeline = new MarkdownPipelineBuilder()
            .UseAdvancedExtensions()
            .Build();

        var mdDoc = Markdown.Parse(req.Markdown, pipeline);

        using var memStream = new MemoryStream();
        using (var wordDoc = WordprocessingDocument.Create(memStream, WordprocessingDocumentType.Document, true))
        {
            var mainPart = wordDoc.AddMainDocumentPart();
            var body = new Body();
            mainPart.Document = new Document(body);

            var stylesPart = mainPart.AddNewPart<StyleDefinitionsPart>();
            stylesPart.Styles = DocxStyles.Build();
            stylesPart.Styles.Save();

            new DocxConverter(body).Convert(mdDoc);

            // Word requires body to end with a paragraph
            body.Append(new Paragraph());
            mainPart.Document.Save();
        }

        var bytes = memStream.ToArray();
        var filename = $"document-{DateTime.UtcNow:yyyyMMdd-HHmmss}.docx";

        return Results.File(
            bytes,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            fileDownloadName: filename
        );
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.Run();

// ── Types ────────────────────────────────────────────────────────────────────

record ConvertRequest(string Markdown);

// ── Styles ───────────────────────────────────────────────────────────────────

static class DocxStyles
{
    public static Styles Build()
    {
        var styles = new Styles();

        styles.Append(new DocDefaults(
            new RunPropertiesDefault(
                new RunPropertiesBaseStyle(
                    new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri", ComplexScript = "Calibri" },
                    new FontSize { Val = "22" },
                    new FontSizeComplexScript { Val = "22" }
                )
            ),
            new ParagraphPropertiesDefault(
                new ParagraphPropertiesBaseStyle(
                    new SpacingBetweenLines { After = "120", Line = "276", LineRule = LineSpacingRuleValues.Auto }
                )
            )
        ));

        styles.Append(NormalStyle());
        for (int i = 1; i <= 6; i++)
            styles.Append(HeadingStyle(i));
        styles.Append(CodeBlockStyle());

        return styles;
    }

    static Style NormalStyle()
    {
        var s = new Style { Type = StyleValues.Paragraph, StyleId = "Normal", Default = OnOffValue.FromBoolean(true) };
        s.Append(new StyleName { Val = "Normal" });
        return s;
    }

    static Style HeadingStyle(int level)
    {
        string[] sizes = { "36", "28", "24", "22", "22", "22" };
        bool bold = level <= 4;

        var s = new Style { Type = StyleValues.Paragraph, StyleId = $"Heading{level}" };
        s.Append(new StyleName { Val = $"heading {level}" });
        s.Append(new BasedOn { Val = "Normal" });
        s.Append(new StyleParagraphProperties(
            new OutlineLevel { Val = level - 1 },
            new SpacingBetweenLines { Before = "280", After = "80" }
        ));
        var rpr = new StyleRunProperties(
            new RunFonts { Ascii = "Calibri", HighAnsi = "Calibri" },
            new FontSize { Val = sizes[level - 1] },
            new FontSizeComplexScript { Val = sizes[level - 1] }
        );
        if (bold) rpr.Append(new Bold());
        s.Append(rpr);
        return s;
    }

    static Style CodeBlockStyle()
    {
        var s = new Style { Type = StyleValues.Paragraph, StyleId = "CodeBlock" };
        s.Append(new StyleName { Val = "Code Block" });
        s.Append(new BasedOn { Val = "Normal" });
        s.Append(new StyleParagraphProperties(
            new Indentation { Left = "360" },
            new SpacingBetweenLines { After = "0", Line = "240", LineRule = LineSpacingRuleValues.Auto },
            new ParagraphBorders(
                new LeftBorder { Val = BorderValues.Single, Size = 12, Space = 4, Color = "CCCCCC" }
            ),
            new Shading { Val = ShadingPatternValues.Clear, Fill = "F5F5F5" }
        ));
        s.Append(new StyleRunProperties(
            new RunFonts { Ascii = "Courier New", HighAnsi = "Courier New" },
            new FontSize { Val = "18" }
        ));
        return s;
    }
}

// ── Converter (Markdig AST → OpenXml) ───────────────────────────────────────

class DocxConverter(Body body)
{
    public void Convert(MarkdownDocument doc)
    {
        foreach (var block in doc)
            RenderBlock(block, depth: 0);
    }

    // ── Block rendering ──────────────────────────────────────────────────────

    void RenderBlock(Block block, int depth)
    {
        switch (block)
        {
            case HeadingBlock h:
                body.Append(HeadingPara(h));
                break;

            case ParagraphBlock p:
                body.Append(InlinePara(p.Inline, "Normal", null));
                break;

            case FencedCodeBlock fc:
                RenderCodeLines(fc.Lines.ToString());
                break;

            case CodeBlock cb:
                RenderCodeLines(cb.Lines.ToString());
                break;

            case QuoteBlock qb:
                foreach (var inner in qb)
                    RenderQuoteBlock(inner);
                break;

            case ListBlock lb:
                int idx = 1;
                foreach (var item in lb)
                    if (item is ListItemBlock li)
                        RenderListItem(li, depth, lb.IsOrdered, idx++);
                break;

            case ThematicBreakBlock:
                body.Append(HrPara());
                break;

            case MdTable tbl:
                body.Append(RenderTable(tbl));
                break;
        }
    }

    // ── Heading ──────────────────────────────────────────────────────────────

    Paragraph HeadingPara(HeadingBlock h)
    {
        var para = new Paragraph();
        para.Append(new ParagraphProperties(
            new ParagraphStyleId { Val = $"Heading{Math.Clamp(h.Level, 1, 6)}" }
        ));
        if (h.Inline != null) AppendInlines(para, h.Inline, null);
        return para;
    }

    // ── Paragraph ────────────────────────────────────────────────────────────

    Paragraph InlinePara(ContainerInline? inlines, string styleId, RunProperties? baseRpr)
    {
        var para = new Paragraph();
        para.Append(new ParagraphProperties(new ParagraphStyleId { Val = styleId }));
        if (inlines != null) AppendInlines(para, inlines, baseRpr);
        return para;
    }

    // ── Code block ───────────────────────────────────────────────────────────

    void RenderCodeLines(string content)
    {
        foreach (var raw in content.Split('\n'))
        {
            var line = raw.TrimEnd('\r');
            var para = new Paragraph();
            para.Append(new ParagraphProperties(new ParagraphStyleId { Val = "CodeBlock" }));
            var run = new Run();
            run.Append(new RunProperties(
                new RunFonts { Ascii = "Courier New", HighAnsi = "Courier New" },
                new FontSize { Val = "18" }
            ));
            run.Append(new Text(line) { Space = SpaceProcessingModeValues.Preserve });
            para.Append(run);
            body.Append(para);
        }
    }

    // ── Blockquote ───────────────────────────────────────────────────────────

    void RenderQuoteBlock(Block block)
    {
        if (block is ParagraphBlock p)
        {
            var para = new Paragraph();
            para.Append(new ParagraphProperties(
                new Indentation { Left = "720" },
                new ParagraphBorders(
                    new LeftBorder { Val = BorderValues.Single, Size = 16, Space = 8, Color = "BBBBBB" }
                )
            ));
            if (p.Inline != null)
                AppendInlines(para, p.Inline, new RunProperties(new Color { Val = "666666" }));
            body.Append(para);
        }
    }

    // ── List item ────────────────────────────────────────────────────────────

    void RenderListItem(ListItemBlock item, int depth, bool isOrdered, int orderedIndex)
    {
        bool firstPara = true;
        foreach (var block in item)
        {
            if (block is ParagraphBlock p)
            {
                var para = new Paragraph();
                int leftPts = 720 + depth * 360;
                para.Append(new ParagraphProperties(
                    new Indentation { Left = $"{leftPts}", Hanging = "360" },
                    new SpacingBetweenLines { After = "60" }
                ));
                if (firstPara)
                {
                    string marker = isOrdered ? $"{orderedIndex}." : "•";
                    para.Append(new Run(new Text(marker + "\t") { Space = SpaceProcessingModeValues.Preserve }));
                }
                if (p.Inline != null) AppendInlines(para, p.Inline, null);
                body.Append(para);
                firstPara = false;
            }
            else if (block is ListBlock nested)
            {
                int ni = 1;
                foreach (var nitem in nested)
                    if (nitem is ListItemBlock nli)
                        RenderListItem(nli, depth + 1, nested.IsOrdered, ni++);
            }
        }
    }

    // ── Horizontal rule ──────────────────────────────────────────────────────

    Paragraph HrPara() => new Paragraph(
        new ParagraphProperties(
            new ParagraphBorders(
                new BottomBorder { Val = BorderValues.Single, Size = 6, Space = 1, Color = "AAAAAA" }
            )
        )
    );

    // ── Table ────────────────────────────────────────────────────────────────

    Table RenderTable(MdTable tbl)
    {
        var wordTable = new Table();
        wordTable.Append(new TableProperties(
            new TableBorders(
                new TopBorder                { Val = BorderValues.Single, Size = 4, Color = "CCCCCC" },
                new BottomBorder             { Val = BorderValues.Single, Size = 4, Color = "CCCCCC" },
                new LeftBorder               { Val = BorderValues.Single, Size = 4, Color = "CCCCCC" },
                new RightBorder              { Val = BorderValues.Single, Size = 4, Color = "CCCCCC" },
                new InsideHorizontalBorder   { Val = BorderValues.Single, Size = 4, Color = "CCCCCC" },
                new InsideVerticalBorder     { Val = BorderValues.Single, Size = 4, Color = "CCCCCC" }
            ),
            new TableWidth { Width = "5000", Type = TableWidthUnitValues.Pct }
        ));

        foreach (var row in tbl)
        {
            if (row is not MdTableRow tr) continue;
            var wordRow = new TableRow();
            if (tr.IsHeader) wordRow.Append(new TableRowProperties(new TableHeader()));

            foreach (var cell in tr)
            {
                if (cell is not MdTableCell tc) continue;
                var wordCell = new TableCell();
                var cellPr = new TableCellProperties(new TableCellWidth { Type = TableWidthUnitValues.Auto });
                if (tr.IsHeader)
                    cellPr.Append(new Shading { Val = ShadingPatternValues.Clear, Fill = "F0F0F0" });
                wordCell.Append(cellPr);

                var cellPara = new Paragraph();
                cellPara.Append(new ParagraphProperties(new SpacingBetweenLines { After = "0" }));
                var headerRpr = tr.IsHeader ? new RunProperties(new Bold()) : null;
                foreach (var inner in tc)
                    if (inner is ParagraphBlock pb && pb.Inline != null)
                        AppendInlines(cellPara, pb.Inline, headerRpr);
                wordCell.Append(cellPara);
                wordRow.Append(wordCell);
            }
            wordTable.Append(wordRow);
        }
        return wordTable;
    }

    // ── Inline rendering ─────────────────────────────────────────────────────

    void AppendInlines(Paragraph para, ContainerInline container, RunProperties? baseRpr)
    {
        foreach (var inline in container)
            AppendInline(para, inline, baseRpr);
    }

    void AppendInline(Paragraph para, Inline inline, RunProperties? baseRpr)
    {
        switch (inline)
        {
            case LiteralInline lit:
            {
                var run = new Run();
                if (baseRpr != null) run.Append((RunProperties)baseRpr.CloneNode(true));
                run.Append(new Text(lit.Content.ToString()) { Space = SpaceProcessingModeValues.Preserve });
                para.Append(run);
                break;
            }

            case CodeInline code:
            {
                var run = new Run();
                run.Append(new RunProperties(
                    new RunFonts { Ascii = "Courier New", HighAnsi = "Courier New" },
                    new FontSize { Val = "18" },
                    new Shading { Val = ShadingPatternValues.Clear, Fill = "F0F0F0" }
                ));
                run.Append(new Text(code.Content) { Space = SpaceProcessingModeValues.Preserve });
                para.Append(run);
                break;
            }

            case EmphasisInline em:
            {
                var rpr = MergeEmphasis(em, baseRpr);
                foreach (var child in em)
                    AppendInline(para, child, rpr);
                break;
            }

            case LinkInline link:
            {
                var rpr = baseRpr != null ? (RunProperties)baseRpr.CloneNode(true) : new RunProperties();
                rpr.Append(new Color { Val = "1155CC" });
                foreach (var child in link)
                    AppendInline(para, child, rpr);
                break;
            }

            case LineBreakInline lb:
                para.Append(new Run(lb.IsHard
                    ? (OpenXmlElement)new Break()
                    : new Text(" ") { Space = SpaceProcessingModeValues.Preserve }));
                break;

            case HtmlEntityInline entity:
            {
                var run = new Run();
                if (baseRpr != null) run.Append((RunProperties)baseRpr.CloneNode(true));
                run.Append(new Text(entity.Transcoded.ToString()) { Space = SpaceProcessingModeValues.Preserve });
                para.Append(run);
                break;
            }

            case ContainerInline ci:
                foreach (var child in ci)
                    AppendInline(para, child, baseRpr);
                break;
        }
    }

    static RunProperties MergeEmphasis(EmphasisInline em, RunProperties? baseRpr)
    {
        var rpr = baseRpr != null ? (RunProperties)baseRpr.CloneNode(true) : new RunProperties();
        bool isDouble = em.DelimiterCount >= 2;
        bool isTilde  = em.DelimiterChar == '~';

        if (isTilde)       rpr.Append(new Strike());
        else if (isDouble) rpr.Append(new Bold());
        else               rpr.Append(new Italic());

        return rpr;
    }
}
