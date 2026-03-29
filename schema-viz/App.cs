#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web

using System.Text.Json;
using System.Text.RegularExpressions;

var builder = WebApplication.CreateBuilder();

builder.Services.ConfigureHttpJsonOptions(o =>
    o.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapPost("/api/parse-ddl", (DdlReq req) =>
{
    if (string.IsNullOrWhiteSpace(req.Sql))
        return Results.BadRequest(new { error = "sql is required" });
    try
    {
        var tables = ParseDdl(req.Sql);
        return Results.Ok(new { tables });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.MapPost("/api/validate-ddl", (DdlReq req) =>
{
    if (string.IsNullOrWhiteSpace(req.Sql))
        return Results.BadRequest(new { error = "sql is required" });
    try
    {
        var tables = ParseDdl(req.Sql);
        var errors = new List<string>();
        var warnings = new List<string>();

        if (tables.Count == 0)
        {
            errors.Add("no CREATE TABLE statements found");
            return Results.Ok(new { valid = false, tableCount = 0, errors, warnings });
        }

        // Duplicate table names
        var names = tables.Select(t => t.Name.ToLower()).ToList();
        foreach (var d in names.GroupBy(n => n).Where(g => g.Count() > 1).Select(g => g.Key))
            warnings.Add($"duplicate table name: \"{d}\"");

        // FK references to tables not found in the DDL
        var tableSet = new HashSet<string>(names, StringComparer.OrdinalIgnoreCase);
        foreach (var t in tables)
            foreach (var fk in t.ForeignKeys)
                if (!tableSet.Contains(fk.ToTable))
                    warnings.Add($"{t.Name}.{fk.FromColumn} → \"{fk.ToTable}\" not defined in this DDL");

        return Results.Ok(new { valid = errors.Count == 0, tableCount = tables.Count, errors, warnings });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.Run();

// ── DDL Parser ────────────────────────────────────────────────────────────────

static List<ParsedTable> ParseDdl(string sql)
{
    var tables = new List<ParsedTable>();
    // Match: CREATE TABLE [IF NOT EXISTS] [schema.]`name`(
    var headerRx = new Regex(
        @"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:\w+\.)?[`""\[]?(\w+)[`""\]]?\s*\(",
        RegexOptions.IgnoreCase);

    foreach (Match m in headerRx.Matches(sql))
    {
        var name = m.Groups[1].Value;
        var openIdx = m.Index + m.Length - 1; // index of the opening '('
        var body = ExtractBody(sql, openIdx);
        tables.Add(ParseTableBody(name, body));
    }
    return tables;
}

static string ExtractBody(string sql, int openIdx)
{
    int depth = 0;
    var sb = new System.Text.StringBuilder();
    for (int i = openIdx; i < sql.Length; i++)
    {
        if (sql[i] == '(') { depth++; if (depth == 1) continue; }
        else if (sql[i] == ')') { depth--; if (depth == 0) break; }
        if (depth >= 1) sb.Append(sql[i]);
    }
    return sb.ToString();
}

static List<string> SplitDefs(string body)
{
    var parts = new List<string>();
    int depth = 0, start = 0;
    for (int i = 0; i < body.Length; i++)
    {
        if (body[i] == '(') depth++;
        else if (body[i] == ')') depth--;
        else if (body[i] == ',' && depth == 0)
        {
            parts.Add(body[start..i].Trim());
            start = i + 1;
        }
    }
    var last = body[start..].Trim();
    if (!string.IsNullOrWhiteSpace(last)) parts.Add(last);
    return parts;
}

static ParsedTable ParseTableBody(string tableName, string body)
{
    var parts = SplitDefs(body);
    var columns = new List<ParsedColumn>();
    var foreignKeys = new List<ParsedForeignKey>();
    var tablePks = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

    var fkRx = new Regex(
        @"FOREIGN\s+KEY\s*\(\s*[`""\[]?(\w+)[`""\]]?\s*\)\s*REFERENCES\s+[`""\[]?(\w+)[`""\]]?\s*\(\s*[`""\[]?(\w+)[`""\]]?\s*\)",
        RegexOptions.IgnoreCase);
    var pkConstraintRx = new Regex(@"PRIMARY\s+KEY\s*\(([^)]+)\)", RegexOptions.IgnoreCase);
    var constraintPrefixRx = new Regex(@"^CONSTRAINT\s+\S+\s+", RegexOptions.IgnoreCase);
    var colRx = new Regex(
        @"^[`""\[]?(\w+)[`""\]]?\s+(\w+(?:\s*\([^)]*\))?(?:\s+(?:UNSIGNED|ZEROFILL|BINARY))*)",
        RegexOptions.IgnoreCase);

    foreach (var rawPart in parts)
    {
        var part = constraintPrefixRx.Replace(rawPart.Trim(), "").Trim();
        if (string.IsNullOrEmpty(part)) continue;

        if (Regex.IsMatch(part, @"^FOREIGN\s+KEY", RegexOptions.IgnoreCase))
        {
            var fk = fkRx.Match(part);
            if (fk.Success)
                foreignKeys.Add(new ParsedForeignKey(
                    ShortId(), fk.Groups[1].Value, fk.Groups[2].Value, fk.Groups[3].Value));
        }
        else if (Regex.IsMatch(part, @"^PRIMARY\s+KEY", RegexOptions.IgnoreCase))
        {
            var pk = pkConstraintRx.Match(part);
            if (pk.Success)
                foreach (var col in pk.Groups[1].Value.Split(','))
                    tablePks.Add(col.Trim().Trim('`', '"', '[', ']'));
        }
        else if (!Regex.IsMatch(part, @"^(UNIQUE|INDEX|KEY|CHECK)\b", RegexOptions.IgnoreCase))
        {
            var cm = colRx.Match(part);
            if (!cm.Success) continue;
            var colName = cm.Groups[1].Value;
            var colType = cm.Groups[2].Value.Trim();
            var isPkInline = Regex.IsMatch(part, @"\bPRIMARY\s+KEY\b", RegexOptions.IgnoreCase);
            var isNotNull = Regex.IsMatch(part, @"\bNOT\s+NULL\b", RegexOptions.IgnoreCase) || isPkInline;
            columns.Add(new ParsedColumn(ShortId(), colName, colType, !isNotNull, isPkInline));
        }
    }

    var finalColumns = columns
        .Select(c => tablePks.Contains(c.Name) ? c with { IsPK = true, Nullable = false } : c)
        .ToList();

    return new ParsedTable(ShortId(), tableName, finalColumns, foreignKeys);
}

static string ShortId() => Guid.NewGuid().ToString("N")[..8];

// ── Models (after app.Run()) ───────────────────────────────────────────────────

record DdlReq(string Sql);
record ParsedColumn(string Id, string Name, string Type, bool Nullable, bool IsPK);
record ParsedForeignKey(string Id, string FromColumn, string ToTable, string ToColumn);
record ParsedTable(string Id, string Name, List<ParsedColumn> Columns, List<ParsedForeignKey> ForeignKeys);
