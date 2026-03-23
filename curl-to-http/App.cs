#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web

using System.Text;
using System.Text.RegularExpressions;

var builder = WebApplication.CreateBuilder();
builder.Services.ConfigureHttpJsonOptions(o =>
    o.SerializerOptions.PropertyNameCaseInsensitive = true);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapPost("/api/convert", (ConvertRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Curl))
        return Results.BadRequest(new { error = "No curl command provided." });

    try
    {
        var parsed = CurlParser.Parse(req.Curl);
        var result = req.Mode?.ToLower() == "preferred"
            ? Formatter.ToPreferred(parsed)
            : Formatter.ToActual(parsed);
        return Results.Ok(new { result });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.Run();

// ── Types ─────────────────────────────────────────────────────────────────────

record ConvertRequest(string Curl, string Mode);

record ParsedCurl(
    string Method,
    string Url,
    string PathWithoutQuery,
    List<(string Key, string Value)> QueryParams,
    List<(string Name, string Value)> Headers,
    string? Body);

// ── Parser ────────────────────────────────────────────────────────────────────

static class CurlParser
{
    static readonly HashSet<string> SkipValueFlags = new(StringComparer.OrdinalIgnoreCase)
    {
        "-u", "--user", "-A", "--user-agent", "-e", "--referer",
        "-o", "--output", "-w", "--write-out", "-m", "--max-time",
        "--connect-timeout", "--retry", "--retry-delay", "--cacert",
        "--capath", "--cert", "--key", "--pass", "--resolve",
        "-x", "--proxy", "-U", "--proxy-user", "--limit-rate",
        "-b", "--cookie", "-c", "--cookie-jar", "-F", "--form",
        "-T", "--upload-file", "-r", "--range"
    };

    static readonly HashSet<string> NoValueFlags = new(StringComparer.OrdinalIgnoreCase)
    {
        "--compressed", "-L", "--location", "-s", "--silent", "-v", "--verbose",
        "-i", "--include", "-G", "--get", "-k", "--insecure", "-f", "--fail",
        "--http1.0", "--http1.1", "--http2", "--no-keepalive", "-I", "--head",
        "--anyauth", "--basic", "--digest", "--negotiate", "--ntlm",
        "-g", "--globoff", "--path-as-is", "-N", "--no-buffer",
        "-O", "--remote-name", "-S", "--show-error"
    };

    public static ParsedCurl Parse(string raw)
    {
        // Normalize line continuations (\  at EOL for Unix, ^ at EOL for Windows cmd)
        var normalized = Regex.Replace(raw.Trim(), @"[\^\\]\s*\r?\n\s*", " ");
        var tokens = Tokenize(normalized);
        if (tokens.Count == 0) throw new Exception("Empty command.");

        int i = 0;
        if (tokens[i].Equals("curl", StringComparison.OrdinalIgnoreCase)) i++;

        string? url = null;
        string? method = null;
        var headers = new List<(string Name, string Value)>();
        string? body = null;

        while (i < tokens.Count)
        {
            var t = tokens[i];

            // Handle --flag=value form
            if (t.StartsWith('-') && t.Contains('='))
            {
                var eq = t.IndexOf('=');
                ApplyFlag(t[..eq], t[(eq + 1)..], ref url, ref method, headers, ref body);
                i++; continue;
            }

            // Known value-consuming flags we care about
            if (t is "-X" or "--request" or
                     "-H" or "--header" or
                     "-d" or "--data" or "--data-raw" or "--data-binary" or "--data-ascii" or "--data-urlencode" or "--json" or
                     "--url")
            {
                if (++i < tokens.Count)
                    ApplyFlag(t, tokens[i], ref url, ref method, headers, ref body);
                i++; continue;
            }

            // Flags whose values we skip
            if (SkipValueFlags.Contains(t)) { i += 2; continue; }

            // Standalone flags
            if (NoValueFlags.Contains(t)) { i++; continue; }

            // Unknown flag — skip its possible value
            if (t.StartsWith('-'))
            {
                i += (i + 1 < tokens.Count && !tokens[i + 1].StartsWith('-') ? 2 : 1);
                continue;
            }

            // Non-flag token: treat first one as URL
            if (url == null) url = t;
            i++;
        }

        if (url == null) throw new Exception("Could not find URL in curl command.");

        var uri = new Uri(url);
        var queryParams = new List<(string Key, string Value)>();
        var pathWithoutQuery = uri.GetLeftPart(UriPartial.Path);

        if (!string.IsNullOrEmpty(uri.Query))
        {
            foreach (var part in uri.Query.TrimStart('?').Split('&'))
            {
                var eq = part.IndexOf('=');
                if (eq >= 0)
                    queryParams.Add((Uri.UnescapeDataString(part[..eq]), Uri.UnescapeDataString(part[(eq + 1)..])));
                else if (part.Length > 0)
                    queryParams.Add((Uri.UnescapeDataString(part), ""));
            }
        }

        method ??= body != null ? "POST" : "GET";
        return new ParsedCurl(method.ToUpper(), url, pathWithoutQuery, queryParams, headers, body);
    }

    static void ApplyFlag(string flag, string value,
        ref string? url, ref string? method,
        List<(string Name, string Value)> headers, ref string? body)
    {
        switch (flag.ToLowerInvariant())
        {
            case "-x": case "--request":
                method = value; break;
            case "-h": case "--header":
                var sep = value.IndexOf(':');
                if (sep > 0) headers.Add((value[..sep].Trim(), value[(sep + 1)..].Trim()));
                break;
            case "-d": case "--data": case "--data-raw": case "--data-binary":
            case "--data-ascii": case "--data-urlencode": case "--json":
                body = value; break;
            case "--url":
                url = value; break;
        }
    }

    static List<string> Tokenize(string input)
    {
        var tokens = new List<string>();
        var sb = new StringBuilder();
        char? inQuote = null;

        for (int i = 0; i < input.Length; i++)
        {
            var c = input[i];
            if (inQuote != null)
            {
                if (c == inQuote) inQuote = null;
                else if (c == '\\' && inQuote == '"' && i + 1 < input.Length)
                {
                    i++;
                    sb.Append(input[i] switch { 'n' => '\n', 't' => '\t', '\\' => '\\', '"' => '"', _ => input[i] });
                }
                else sb.Append(c);
            }
            else if (c is '\'' or '"') inQuote = c;
            else if (char.IsWhiteSpace(c))
            {
                if (sb.Length > 0) { tokens.Add(sb.ToString()); sb.Clear(); }
            }
            else sb.Append(c);
        }
        if (sb.Length > 0) tokens.Add(sb.ToString());
        return tokens;
    }
}

// ── Formatter ─────────────────────────────────────────────────────────────────

static class Formatter
{
    const string EnvBlock =
        "{{\n" +
        "  const env = env_name || 'default';\n" +
        "  const tokenEnv = (env === 'local') ? 'dev' : env;\n" +
        "  exports.currentToken = $global[`${tokenEnv}_authToken`];\n" +
        "  exports.currentUserId = $global[`${tokenEnv}_userId`];\n" +
        "}}";

    public static string ToActual(ParsedCurl p)
    {
        var sb = new StringBuilder();
        sb.Append(p.Method).Append(' ').AppendLine(p.Url);
        foreach (var (name, value) in p.Headers)
            sb.Append(name).Append(": ").AppendLine(value);
        if (p.Body != null)
        {
            sb.AppendLine();
            sb.Append(p.Body);
        }
        return Normalize(sb);
    }

    public static string ToPreferred(ParsedCurl p)
    {
        var sb = new StringBuilder();

        // JS env block
        sb.AppendLine(EnvBlock);
        sb.AppendLine();

        // Variable declarations for query params
        if (p.QueryParams.Count > 0)
        {
            foreach (var (key, value) in p.QueryParams)
                sb.Append('@').Append(ToCamelCase(key)).Append(" = ").AppendLine(value);
            sb.AppendLine();
        }

        // Request line
        sb.Append(p.Method).Append(' ').Append(p.PathWithoutQuery);

        // Query params as continuation lines
        bool first = true;
        foreach (var (key, _) in p.QueryParams)
        {
            sb.AppendLine();
            sb.Append(first ? "  ?" : "  &")
              .Append(key).Append("={{").Append(ToCamelCase(key)).Append("}}");
            first = false;
        }
        sb.AppendLine();

        // Always inject Authorization header
        sb.AppendLine("Authorization: Bearer {{currentToken}}");

        // Remaining headers (drop any existing Authorization)
        foreach (var (name, value) in p.Headers)
        {
            if (name.Equals("Authorization", StringComparison.OrdinalIgnoreCase)) continue;
            sb.Append(name).Append(": ").AppendLine(value);
        }

        if (p.Body != null)
        {
            sb.AppendLine();
            sb.Append(p.Body);
        }

        return Normalize(sb);
    }

    static string Normalize(StringBuilder sb) =>
        sb.ToString().Replace("\r\n", "\n").TrimEnd();

    static string ToCamelCase(string s)
    {
        if (string.IsNullOrEmpty(s)) return s;
        if (s.Contains('_') || s.Contains('-'))
        {
            var parts = s.Split(new[] { '_', '-' }, StringSplitOptions.RemoveEmptyEntries);
            var camel = parts[0].ToLowerInvariant();
            for (int i = 1; i < parts.Length; i++)
                camel += char.ToUpper(parts[i][0]) + parts[i][1..].ToLowerInvariant();
            return camel;
        }
        return char.ToLower(s[0]) + s[1..];
    }
}
