#:property PublishAot=false
#:sdk Microsoft.NET.Sdk.Web
#:package YamlDotNet@16.*
#:package QRCoder@1.*
#:package JsonSchema.Net@7.*
#:package Bogus@35.*
#:package Cronos@0.8.*
#:package BCrypt.Net-Next@4.*

using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Linq;
using Bogus;
using Cronos;
using Json.Schema;
using YamlDotNet.RepresentationModel;
using YamlDotNet.Serialization;

var builder = WebApplication.CreateBuilder();
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// ── Crypto (2) ────────────────────────────────────────────
var crypto = app.MapGroup("/api/crypto");

crypto.MapPost("/aes-encrypt", (AesReq r) => R.Try(() =>
{
    if (string.IsNullOrEmpty(r.Password)) throw new Exception("Password is required.");
    var salt = RandomNumberGenerator.GetBytes(16);
    var iv   = RandomNumberGenerator.GetBytes(16);
    var key  = Rfc2898DeriveBytes.Pbkdf2(r.Password, salt, 100_000, HashAlgorithmName.SHA256, 32);
    using var aes = Aes.Create();
    aes.Mode    = CipherMode.CBC;
    aes.Padding = PaddingMode.PKCS7;
    aes.Key     = key;
    aes.IV      = iv;
    using var ms = new MemoryStream();
    using (var cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write))
    using (var sw = new StreamWriter(cs))
        sw.Write(r.Text);
    var cipher   = ms.ToArray();
    var combined = new byte[salt.Length + iv.Length + cipher.Length];
    Buffer.BlockCopy(salt,   0, combined, 0,                          salt.Length);
    Buffer.BlockCopy(iv,     0, combined, salt.Length,                iv.Length);
    Buffer.BlockCopy(cipher, 0, combined, salt.Length + iv.Length,    cipher.Length);
    return new { result = Convert.ToBase64String(combined) };
}));

crypto.MapPost("/aes-decrypt", (AesReq r) => R.Try(() =>
{
    if (string.IsNullOrEmpty(r.Password)) throw new Exception("Password is required.");
    var combined = Convert.FromBase64String(r.Text.Trim());
    if (combined.Length < 33) throw new Exception("Ciphertext too short — was it encrypted with this tool?");
    var salt   = combined[..16];
    var iv     = combined[16..32];
    var cipher = combined[32..];
    var key    = Rfc2898DeriveBytes.Pbkdf2(r.Password, salt, 100_000, HashAlgorithmName.SHA256, 32);
    using var aes = Aes.Create();
    aes.Mode    = CipherMode.CBC;
    aes.Padding = PaddingMode.PKCS7;
    aes.Key     = key;
    aes.IV      = iv;
    using var ms = new MemoryStream(cipher);
    using var cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Read);
    using var sr = new StreamReader(cs);
    return new { result = sr.ReadToEnd() };
}));

// ── Converters (7) ────────────────────────────────────────
var conv = app.MapGroup("/api/converters");

conv.MapPost("/json-to-yaml", (TextReq r) => R.Try(() =>
{
    var node = JsonNode.Parse(r.Text) ?? throw new Exception("Invalid JSON");
    var obj = YamlConvert.FromJsonNode(node);
    var result = new SerializerBuilder().Build().Serialize(obj);
    return new { result };
}));

conv.MapPost("/yaml-to-json", (TextReq r) => R.Try(() =>
{
    var stream = new YamlStream();
    stream.Load(new StringReader(r.Text));
    var doc = stream.Documents.FirstOrDefault() ?? throw new Exception("Empty YAML");
    var node = YamlConvert.ToJsonNode(doc.RootNode);
    var result = JsonSerializer.Serialize(node, new JsonSerializerOptions { WriteIndented = true });
    return new { result };
}));

conv.MapPost("/unix-to-datetime", (UnixReq r) => R.Try(() =>
{
    var utc = DateTimeOffset.FromUnixTimeSeconds(r.Unix);
    var ist = TzHelper.Find("India Standard Time", "Asia/Kolkata");
    var istTime = TimeZoneInfo.ConvertTime(utc, ist);
    return new
    {
        utc = utc.ToString("yyyy-MM-dd HH:mm:ss UTC"),
        ist = istTime.ToString("yyyy-MM-dd HH:mm:ss") + " IST",
        unix = r.Unix
    };
}));

conv.MapPost("/datetime-to-unix", (TextReq r) => R.Try(() =>
{
    var dt = DateTimeOffset.Parse(r.Text);
    return new { unix = dt.ToUnixTimeSeconds() };
}));

conv.MapPost("/base64-encode", (TextReq r) => R.Try(() =>
    new { result = Convert.ToBase64String(Encoding.UTF8.GetBytes(r.Text)) }));

conv.MapPost("/base64-decode", (TextReq r) => R.Try(() =>
    new { result = Encoding.UTF8.GetString(Convert.FromBase64String(r.Text)) }));

conv.MapPost("/number-base", (NumberBaseReq r) => R.Try(() =>
{
    var v = r.Value.Trim().ToLower();
    long value = r.From.ToLower() switch
    {
        "hex"            => Convert.ToInt64(v.Replace("0x", ""), 16),
        "binary" or "bin" => Convert.ToInt64(v.Replace("0b", ""), 2),
        "octal"  or "oct" => Convert.ToInt64(v.Replace("0o", ""), 8),
        _ => long.Parse(v)
    };
    return new
    {
        dec    = value.ToString(),
        hex    = value.ToString("X"),
        binary = Convert.ToString(value, 2),
        octal  = Convert.ToString(value, 8)
    };
}));

conv.MapPost("/json-to-csv", (TextReq r) => R.Try(() =>
{
    var arr = JsonNode.Parse(r.Text)?.AsArray() ?? throw new Exception("Expected a JSON array");
    if (arr.Count == 0) return new { result = string.Empty };
    var headers = arr[0]!.AsObject().Select(kv => kv.Key).ToList();
    var sb = new StringBuilder();
    sb.AppendLine(string.Join(",", headers.Select(CsvConvert.Quote)));
    foreach (var row in arr)
    {
        var obj = row?.AsObject() ?? new JsonObject();
        sb.AppendLine(string.Join(",", headers.Select(h => CsvConvert.Quote(obj[h]?.ToString() ?? ""))));
    }
    return new { result = sb.ToString().TrimEnd() };
}));

conv.MapPost("/csv-to-json", (TextReq r) => R.Try(() =>
{
    var rows = CsvHelper.ParseAll(r.Text);
    if (rows.Count < 2) throw new Exception("Expected at least a header row and one data row");
    var headers = rows[0];
    var arr = rows.Skip(1).Select(row =>
    {
        var obj = new JsonObject();
        for (int i = 0; i < headers.Count; i++)
            obj[headers[i]] = JsonValue.Create(i < row.Count ? row[i] : "");
        return obj;
    }).ToList<object?>();
    return new { result = JsonSerializer.Serialize(arr, new JsonSerializerOptions { WriteIndented = true }) };
}));

conv.MapPost("/color", (ColorReq r) => R.Try(() =>
{
    var (cR, cG, cB) = ColorHelper.ParseToRgb(r.Format, r.Value);
    var (h, s, l)    = ColorHelper.RgbToHsl(cR, cG, cB);
    var (c, m, y, k) = ColorHelper.RgbToCmyk(cR, cG, cB);
    return new
    {
        hex  = $"#{cR:X2}{cG:X2}{cB:X2}",
        rgb  = $"rgb({cR}, {cG}, {cB})",
        hsl  = $"hsl({h:F0}, {s:F1}%, {l:F1}%)",
        cmyk = $"cmyk({c:F0}%, {m:F0}%, {y:F0}%, {k:F0}%)"
    };
}));

// ── Encoders (8) ──────────────────────────────────────────
var enc = app.MapGroup("/api/encoders");

enc.MapPost("/url-encode", (TextReq r) => R.Try(() =>
    new { result = Uri.EscapeDataString(r.Text) }));

enc.MapPost("/url-decode", (TextReq r) => R.Try(() =>
    new { result = Uri.UnescapeDataString(r.Text) }));

enc.MapPost("/html-encode", (TextReq r) => R.Try(() =>
    new { result = WebUtility.HtmlEncode(r.Text) }));

enc.MapPost("/html-decode", (TextReq r) => R.Try(() =>
    new { result = WebUtility.HtmlDecode(r.Text) }));

enc.MapPost("/jwt-encode", (JwtEncReq r) => R.Try(() =>
{
    var header  = JwtHelper.B64Url("""{"alg":"HS256","typ":"JWT"}""");
    var payload = JwtHelper.B64Url(r.Payload);
    var sig     = JwtHelper.Sign($"{header}.{payload}", r.Secret);
    return new { token = $"{header}.{payload}.{sig}" };
}));

enc.MapPost("/jwt-decode", (TextReq r) => R.Try(() =>
{
    var parts = r.Text.Split('.');
    if (parts.Length != 3) throw new Exception("Invalid JWT — expected 3 dot-separated parts");
    return new
    {
        header    = JwtHelper.B64UrlDecode(parts[0]),
        payload   = JwtHelper.B64UrlDecode(parts[1]),
        signature = parts[2]
    };
}));

enc.MapPost("/morse-encode", (TextReq r) => R.Try(() =>
    new { result = MorseHelper.Encode(r.Text) }));

enc.MapPost("/morse-decode", (TextReq r) => R.Try(() =>
    new { result = MorseHelper.Decode(r.Text) }));

// ── Formatters (4) ────────────────────────────────────────
var fmt = app.MapGroup("/api/formatters");

fmt.MapPost("/json", (TextReq r) => R.Try(() =>
{
    var node   = JsonNode.Parse(r.Text) ?? throw new Exception("Invalid JSON");
    var result = JsonSerializer.Serialize(node, new JsonSerializerOptions { WriteIndented = true });
    return new { result };
}));

fmt.MapPost("/xml", (TextReq r) => R.Try(() =>
{
    var doc = XDocument.Parse(r.Text);
    var sb  = new StringBuilder();
    using (var w = XmlWriter.Create(sb, new XmlWriterSettings { Indent = true, IndentChars = "  " }))
        doc.WriteTo(w);
    return new { result = sb.ToString() };
}));

fmt.MapPost("/csv", (TextReq r) => R.Try(() =>
    new { result = CsvHelper.Format(r.Text) }));

fmt.MapPost("/sql", (TextReq r) => R.Try(() =>
    new { result = SqlHelper.Format(r.Text) }));

fmt.MapPost("/json-minify", (TextReq r) => R.Try(() =>
{
    var node = JsonNode.Parse(r.Text) ?? throw new Exception("Invalid JSON");
    return new { result = node.ToJsonString() };
}));

fmt.MapPost("/json-stringify", (TextReq r) => R.Try(() =>
{
    var node   = JsonNode.Parse(r.Text) ?? throw new Exception("Invalid JSON");
    var result = JsonSerializer.Serialize(node.ToJsonString());
    return new { result };
}));

fmt.MapPost("/json-parse", (TextReq r) => R.Try(() =>
{
    var inner  = JsonSerializer.Deserialize<string>(r.Text) ?? throw new Exception("Not a valid JSON string literal");
    var node   = JsonNode.Parse(inner) ?? throw new Exception("Inner content is not valid JSON");
    var result = JsonSerializer.Serialize(node, new JsonSerializerOptions { WriteIndented = true });
    return new { result };
}));

fmt.MapPost("/diff", (DiffReq r) => R.Try(() =>
{
    var left  = (r.Left  ?? "").Split('\n');
    var right = (r.Right ?? "").Split('\n');
    return new { hunks = DiffHelper.Compute(left, right) };
}));

// ── Validators (5) ────────────────────────────────────────
var vld = app.MapGroup("/api/validators");

vld.MapPost("/json", (TextReq r) =>
{
    try   { JsonNode.Parse(r.Text); return Results.Ok(new { valid = true,  error = (string?)null }); }
    catch (Exception ex)            { return Results.Ok(new { valid = false, error = ex.Message }); }
});

vld.MapPost("/xml", (TextReq r) =>
{
    try   { XDocument.Parse(r.Text); return Results.Ok(new { valid = true,  error = (string?)null }); }
    catch (Exception ex)             { return Results.Ok(new { valid = false, error = ex.Message }); }
});

vld.MapPost("/regex", (RegexReq r) =>
{
    try
    {
        var opts = RegexOptions.None;
        if (r.Flags.Contains('i')) opts |= RegexOptions.IgnoreCase;
        if (r.Flags.Contains('m')) opts |= RegexOptions.Multiline;
        if (r.Flags.Contains('s')) opts |= RegexOptions.Singleline;
        var rx      = new Regex(r.Pattern, opts, TimeSpan.FromSeconds(5));
        var matches = rx.Matches(r.Input).Select(m => new { value = m.Value, index = m.Index }).ToList();
        return Results.Ok(new { valid = true, matches, error = (string?)null });
    }
    catch (Exception ex)
    {
        return Results.Ok(new { valid = false, matches = Array.Empty<object>(), error = ex.Message });
    }
});

vld.MapPost("/json-schema", (JsonSchemaReq r) =>
{
    try
    {
        var schema   = JsonSchema.FromText(r.Schema);
        var instance = JsonNode.Parse(r.Json);
        var results  = schema.Evaluate(instance, new EvaluationOptions { OutputFormat = OutputFormat.List });
        var errors   = SchemaHelper.CollectErrors(results).Distinct().ToList();
        return Results.Ok(new { valid = results.IsValid, errors });
    }
    catch (Exception ex) { return Results.Ok(new { valid = false, errors = new[] { ex.Message } }); }
});

vld.MapPost("/ip", (TextReq r) =>
{
    var input = r.Text.Trim();
    if (System.Net.IPAddress.TryParse(input, out var addr))
    {
        var version = addr.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork ? "IPv4" : "IPv6";
        return Results.Ok(new { valid = true, version, error = (string?)null });
    }
    return Results.Ok(new { valid = false, version = (string?)null, error = $"'{input}' is not a valid IP address" });
});

vld.MapPost("/cron", (TextReq r) =>
{
    try
    {
        var expr = r.Text.Trim();
        CronExpression cron;
        try   { cron = CronExpression.Parse(expr, CronFormat.IncludeSeconds); }
        catch { cron = CronExpression.Parse(expr, CronFormat.Standard); }
        var now    = DateTime.UtcNow;
        var nexts  = new List<string>();
        var cursor = now;
        for (int i = 0; i < 5; i++)
        {
            var next = cron.GetNextOccurrence(cursor, TimeZoneInfo.Utc);
            if (next == null) break;
            nexts.Add(next.Value.ToString("yyyy-MM-dd HH:mm:ss") + " UTC");
            cursor = next.Value;
        }
        return Results.Ok(new { valid = true, nextOccurrences = nexts, error = (string?)null });
    }
    catch (Exception ex)
    {
        return Results.Ok(new { valid = false, nextOccurrences = Array.Empty<string>(), error = ex.Message });
    }
});

// ── Generators (7) ────────────────────────────────────────
var gen = app.MapGroup("/api/generators");

gen.MapPost("/lorem", (LoremReq r) => R.Try(() =>
    new { result = LoremHelper.Generate(Math.Clamp(r.Paragraphs, 1, 20)) }));

gen.MapPost("/password", (PasswordReq r) => R.Try(() =>
    new { result = PasswordHelper.Generate(Math.Clamp(r.Length, 4, 128), r.Upper, r.Lower, r.Digits, r.Symbols) }));

gen.MapGet("/uuid", () => new { result = Guid.NewGuid().ToString() });

gen.MapGet("/uuid/batch", (int count, string? type) =>
    new { results = Enumerable.Range(0, Math.Clamp(count, 1, 50)).Select(_ =>
        (type ?? "v4") == "empty" ? Guid.Empty.ToString() : Guid.NewGuid().ToString()
    ).ToList() });

gen.MapPost("/qrcode", (TextReq r) => R.Try(() =>
{
    var qrGen  = new QRCoder.QRCodeGenerator();
    var qrData = qrGen.CreateQrCode(r.Text, QRCoder.QRCodeGenerator.ECCLevel.Q);
    var qrCode = new QRCoder.PngByteQRCode(qrData);
    var png    = $"data:image/png;base64,{Convert.ToBase64String(qrCode.GetGraphic(10))}";
    return new { png };
}));

gen.MapPost("/hash", (HashReq r) => R.Try(() =>
{
    if (r.Algorithm.Equals("bcrypt", StringComparison.OrdinalIgnoreCase))
        return new { result = BCrypt.Net.BCrypt.HashPassword(r.Text, workFactor: 12) };
    var bytes = Encoding.UTF8.GetBytes(r.Text);
    byte[] hash = r.Algorithm.ToLower() switch
    {
        "md5"    => MD5.HashData(bytes),
        "sha1"   => SHA1.HashData(bytes),
        "sha256" => SHA256.HashData(bytes),
        "sha512" => SHA512.HashData(bytes),
        _ => throw new Exception($"Unknown algorithm '{r.Algorithm}'")
    };
    return new { result = Convert.ToHexString(hash).ToLower() };
}));

gen.MapPost("/fake-data", (FakeDataReq r) => R.Try(() =>
{
    var count  = Math.Clamp(r.Count, 1, 100);
    var faker  = new Faker(r.Locale ?? "en");
    var records = Enumerable.Range(0, count).Select(_ => new
    {
        firstName = faker.Name.FirstName(),
        lastName  = faker.Name.LastName(),
        email     = faker.Internet.Email(),
        phone     = faker.Phone.PhoneNumber(),
        company   = faker.Company.CompanyName(),
        address   = faker.Address.StreetAddress(),
        city      = faker.Address.City(),
        country   = faker.Address.Country(),
        username  = faker.Internet.UserName(),
        zipCode   = faker.Address.ZipCode(),
    }).ToList();
    return new { records };
}));

gen.MapPost("/json-schema", (TextReq r) => R.Try(() =>
{
    if (string.IsNullOrWhiteSpace(r.Text)) throw new Exception("Input JSON is required.");
    var root   = JsonNode.Parse(r.Text) ?? throw new Exception("Invalid JSON");
    var schema = JsonSchemaGenerator.FromNode(root);
    return new { result = JsonSerializer.Serialize(schema, new JsonSerializerOptions { WriteIndented = true }) };
}));

app.Run();

// ── Records ───────────────────────────────────────────────
record TextReq(string Text);
record UnixReq(long Unix);
record NumberBaseReq(string Value, string From);
record AesReq(string Text, string Password);
record JwtEncReq(string Payload, string Secret);
record DiffReq(string? Left, string? Right);
record RegexReq(string Pattern, string Input, string Flags);
record LoremReq(int Paragraphs);
record PasswordReq(int Length, bool Upper, bool Lower, bool Digits, bool Symbols);
record HashReq(string Text, string Algorithm);
record JsonSchemaReq(string Schema, string Json);
record FakeDataReq(int Count, string? Locale);
record ColorReq(string Format, string Value);

// ── Utility: Try / Result wrapper ─────────────────────────
static class R
{
    public static IResult Try<T>(Func<T> fn)
    {
        try   { return Results.Ok(fn()); }
        catch (Exception ex) { return Results.BadRequest(new { error = ex.Message }); }
    }
}

// ── Utility: Timezone lookup ──────────────────────────────
static class TzHelper
{
    public static TimeZoneInfo Find(params string[] ids)
    {
        foreach (var id in ids)
            try { return TimeZoneInfo.FindSystemTimeZoneById(id); } catch { }
        return TimeZoneInfo.Utc;
    }
}

// ── YAML ↔ JsonNode conversion ────────────────────────────
static class YamlConvert
{
    public static object? FromJsonNode(JsonNode? n)
    {
        if (n is null) return null;
        if (n is JsonObject o)
            return new Dictionary<object, object?>(
                o.Select(kv => KeyValuePair.Create<object, object?>(kv.Key, FromJsonNode(kv.Value))));
        if (n is JsonArray a)
            return a.Select(FromJsonNode).ToList<object?>();
        if (n is JsonValue v)
        {
            if (v.TryGetValue<bool>(out var b))   return b;
            if (v.TryGetValue<long>(out var l))   return l;
            if (v.TryGetValue<double>(out var d)) return d;
            if (v.TryGetValue<string>(out var s)) return s;
        }
        return null;
    }

    public static JsonNode? ToJsonNode(YamlNode node)
    {
        if (node is YamlMappingNode m)
            return new JsonObject(m.Children.ToDictionary(
                kv => ((YamlScalarNode)kv.Key).Value!,
                kv => ToJsonNode(kv.Value)));
        if (node is YamlSequenceNode s)
            return new JsonArray(s.Children.Select(ToJsonNode).ToArray());
        if (node is YamlScalarNode sc)
            return ParseScalar(sc.Value);
        return null;
    }

    static JsonNode? ParseScalar(string? v)
    {
        if (v is null or "null" or "~")           return null;
        if (v is "true"  or "yes" or "on")        return JsonValue.Create(true);
        if (v is "false" or "no"  or "off")       return JsonValue.Create(false);
        if (long.TryParse(v, out var l))           return JsonValue.Create(l);
        if (double.TryParse(v, System.Globalization.NumberStyles.Float,
                System.Globalization.CultureInfo.InvariantCulture, out var d))
            return JsonValue.Create(d);
        return JsonValue.Create(v);
    }
}

// ── JSON Schema Generator ─────────────────────────────────
static class JsonSchemaGenerator
{
    public static JsonObject FromNode(JsonNode? node)
    {
        if (node is null) return new JsonObject { ["type"] = "null" };
        if (node is JsonObject obj)
        {
            var props = new JsonObject();
            var required = new JsonArray();
            foreach (var kv in obj)
            {
                props[kv.Key] = FromNode(kv.Value);
                required.Add(kv.Key);
            }
            return new JsonObject
            {
                ["type"]                 = "object",
                ["properties"]          = props,
                ["required"]            = required,
                ["additionalProperties"] = false
            };
        }
        if (node is JsonArray arr)
        {
            var itemSchema = arr.Count > 0
                ? FromNode(arr[0])
                : new JsonObject { ["type"] = "string" };
            return new JsonObject { ["type"] = "array", ["items"] = itemSchema };
        }
        if (node is JsonValue val)
        {
            if (val.TryGetValue<bool>(out _))   return new JsonObject { ["type"] = "boolean" };
            if (val.TryGetValue<long>(out _))   return new JsonObject { ["type"] = "integer" };
            if (val.TryGetValue<double>(out _)) return new JsonObject { ["type"] = "number" };
            if (val.TryGetValue<string>(out _)) return new JsonObject { ["type"] = "string" };
        }
        return new JsonObject { ["type"] = "string" };
    }
}

// ── Diff Helper ───────────────────────────────────────────
static class DiffHelper
{
    public record Hunk(string type, string line);

    public static List<Hunk> Compute(string[] left, string[] right)
    {
        int m = left.Length, n = right.Length;
        // Build LCS table
        var dp = new int[m + 1, n + 1];
        for (int i = m - 1; i >= 0; i--)
            for (int j = n - 1; j >= 0; j--)
                dp[i, j] = left[i] == right[j]
                    ? dp[i + 1, j + 1] + 1
                    : Math.Max(dp[i + 1, j], dp[i, j + 1]);

        var result = new List<Hunk>();
        int ai = 0, bi = 0;
        while (ai < m || bi < n)
        {
            if (ai < m && bi < n && left[ai] == right[bi])
            {
                result.Add(new Hunk("equal", left[ai++]));
                bi++;
            }
            else if (bi < n && (ai >= m || dp[ai, bi + 1] >= dp[ai + 1, bi]))
                result.Add(new Hunk("added", right[bi++]));
            else
                result.Add(new Hunk("removed", left[ai++]));
        }
        return result;
    }
}

// ── JWT Helper ────────────────────────────────────────────
static class JwtHelper
{
    public static string B64Url(string json) =>
        Convert.ToBase64String(Encoding.UTF8.GetBytes(json))
               .TrimEnd('=').Replace('+', '-').Replace('/', '_');

    public static string Sign(string data, string secret)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        return Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(data)))
                      .TrimEnd('=').Replace('+', '-').Replace('/', '_');
    }

    public static string B64UrlDecode(string input)
    {
        input = input.Replace('-', '+').Replace('_', '/');
        input += (input.Length % 4) switch { 2 => "==", 3 => "=", _ => "" };
        return Encoding.UTF8.GetString(Convert.FromBase64String(input));
    }
}

// ── Morse Helper ──────────────────────────────────────────
static class MorseHelper
{
    static readonly Dictionary<char, string> Encode_ = new()
    {
        {'A',".-"},   {'B',"-..."},{'C',"-.-."}, {'D',"-.."},  {'E',"."},
        {'F',"..-."}, {'G',"--."},  {'H',"...."},{'I',".."},   {'J',".---"},
        {'K',"-.-"},  {'L',".-.."},{'M',"--"},   {'N',"-."},   {'O',"---"},
        {'P',".--."}, {'Q',"--.-"},{'R',".-."},  {'S',"..."},  {'T',"-"},
        {'U',"..-"},  {'V',"...-"},{'W',".--"},  {'X',"-..-"}, {'Y',"-.--"},
        {'Z',"--.."},
        {'0',"-----"},{'1',".----"},{'2',"..---"},{'3',"...--"},{'4',"....-"},
        {'5',"....."},{'6',"-...."},{'7',"--..."},{'8',"---.."}, {'9',"----."},
        {'.',  ".-.-.-"},{',', "--..--"},{'?', "..--.."},{'!', "-.-.--"},
        {'-',  "-....-"},{'/', "-..-." },{'@', ".--.-."},{' ', "/"}
    };

    static readonly Dictionary<string, char> Decode_ =
        Encode_.Where(kv => kv.Key != ' ').ToDictionary(kv => kv.Value, kv => kv.Key);

    public static string Encode(string text) =>
        string.Join(" ", text.ToUpper().Select(c => Encode_.TryGetValue(c, out var m) ? m : "?"));

    public static string Decode(string morse) =>
        string.Concat(morse.Trim().Split(' ').Select(code =>
            code == "/" ? " " :
            Decode_.TryGetValue(code, out var c) ? c.ToString() : "?"));
}

// ── Lorem Helper ──────────────────────────────────────────
static class LoremHelper
{
    static readonly string[] Pool = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Curabitur pretium tincidunt lacus nulla gravida orci a odio.",
        "Nullam varius, turpis molestie dictum semper, sapien arcu vulputate arcu, sed accumsan ligula.",
        "Quisque ut nunc et felis ultrices consectetur volutpat.",
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames.",
        "Mauris sed libero id lorem faucibus facilisis at nec enim.",
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
        "Proin cursus commodo est, et dignissim eros lobortis non.",
        "Integer condimentum tortor sit amet diam pharetra, vel facilisis felis ultrices ornare.",
        "Fusce aliquet pede non pede sollicitudin blandit lacinia fermentum.",
        "Donec eu libero sit amet quam egestas semper aenean ultricies.",
    ];

    public static string Generate(int paragraphs)
    {
        var rng = new Random();
        var sb  = new StringBuilder();
        for (int p = 0; p < paragraphs; p++)
        {
            if (p > 0) sb.AppendLine();
            var sentences = Pool.OrderBy(_ => rng.Next()).Take(rng.Next(3, 6));
            sb.AppendLine(string.Join(" ", sentences));
        }
        return sb.ToString().Trim();
    }
}

// ── Schema Helper ────────────────────────────────────────
static class SchemaHelper
{
    public static IEnumerable<string> CollectErrors(EvaluationResults r)
    {
        if (r.Errors != null)
            foreach (var e in r.Errors)
                yield return $"{r.InstanceLocation} [{e.Key}]: {e.Value}";
        if (r.Details != null)
            foreach (var d in r.Details)
                foreach (var e in CollectErrors(d))
                    yield return e;
    }
}

// ── Password Helper ───────────────────────────────────────
static class PasswordHelper
{
    public static string Generate(int length, bool upper, bool lower, bool digits, bool symbols)
    {
        var pool = new StringBuilder();
        if (upper)   pool.Append("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        if (lower)   pool.Append("abcdefghijklmnopqrstuvwxyz");
        if (digits)  pool.Append("0123456789");
        if (symbols) pool.Append("!@#$%^&*()-_=+[]{}|;:,.<>?");
        if (pool.Length == 0) pool.Append("abcdefghijklmnopqrstuvwxyz");

        var chars  = pool.ToString();
        var rndBuf = RandomNumberGenerator.GetBytes(length);
        return new string(rndBuf.Select(b => chars[b % chars.Length]).ToArray());
    }
}

// ── CSV Helper ────────────────────────────────────────────
static class CsvHelper
{
    public static string Format(string csv)
    {
        var lines = csv.ReplaceLineEndings("\n").Split('\n', StringSplitOptions.RemoveEmptyEntries);
        var rows  = lines.Select(ParseRow).ToList();
        if (rows.Count == 0) return csv;

        var cols   = rows.Max(r => r.Count);
        var widths = Enumerable.Range(0, cols)
            .Select(c => rows.Max(r => c < r.Count ? r[c].Length : 0)).ToArray();

        var sb = new StringBuilder();
        foreach (var row in rows)
        {
            for (int i = 0; i < row.Count; i++)
            {
                if (i > 0) sb.Append(", ");
                sb.Append(row[i].PadRight(i < widths.Length - 1 ? widths[i] : 0));
            }
            sb.AppendLine();
        }
        return sb.ToString().TrimEnd();
    }

    public static List<List<string>> ParseAll(string csv) =>
        csv.ReplaceLineEndings("\n")
           .Split('\n', StringSplitOptions.RemoveEmptyEntries)
           .Select(ParseRow).ToList();

    public static List<string> ParseRow(string line)
    {
        var fields   = new List<string>();
        var sb       = new StringBuilder();
        bool inQuote = false;
        for (int i = 0; i < line.Length; i++)
        {
            var c = line[i];
            if (c == '"')
            {
                if (inQuote && i + 1 < line.Length && line[i + 1] == '"') { sb.Append('"'); i++; }
                else inQuote = !inQuote;
            }
            else if (c == ',' && !inQuote) { fields.Add(sb.ToString()); sb.Clear(); }
            else sb.Append(c);
        }
        fields.Add(sb.ToString());
        return fields;
    }
}

// ── CSV Convert (quoting for json-to-csv) ────────────────
static class CsvConvert
{
    public static string Quote(string? v)
    {
        var s = v ?? "";
        return s.Contains(',') || s.Contains('"') || s.Contains('\n')
            ? $"\"{ s.Replace("\"", "\"\"")}\"" : s;
    }
}

// ── Color Helper ────────────────────────────────────────────
static class ColorHelper
{
    public static (int R, int G, int B) ParseToRgb(string format, string value)
    {
        return format.ToLower() switch
        {
            "hex"  => ParseHex(value),
            "rgb"  => ParseRgbComponents(value),
            "hsl"  => HslToRgb(ExtractNumbers(value)),
            "cmyk" => CmykToRgb(ExtractNumbers(value)),
            _ => throw new Exception($"Unknown format '{format}'")
        };
    }

    static (int R, int G, int B) ParseHex(string v)
    {
        v = v.Trim().TrimStart('#');
        if (v.Length == 3) v = $"{v[0]}{v[0]}{v[1]}{v[1]}{v[2]}{v[2]}";
        if (v.Length != 6) throw new Exception("Invalid hex color — expected #RRGGBB or #RGB");
        return (Convert.ToInt32(v[..2], 16), Convert.ToInt32(v[2..4], 16), Convert.ToInt32(v[4..6], 16));
    }

    static (int R, int G, int B) ParseRgbComponents(string v)
    {
        var nums = ExtractNumbers(v);
        if (nums.Count < 3) throw new Exception("RGB needs 3 values");
        return ((int)nums[0], (int)nums[1], (int)nums[2]);
    }

    static List<double> ExtractNumbers(string v) =>
        Regex.Matches(v, @"\d+(?:\.\d+)?").Select(m => double.Parse(m.Value)).ToList();

    static (int R, int G, int B) HslToRgb(List<double> nums)
    {
        if (nums.Count < 3) throw new Exception("HSL needs 3 values (H S% L%)");
        double h = nums[0], s = nums[1] / 100.0, l = nums[2] / 100.0;
        double c = (1 - Math.Abs(2 * l - 1)) * s;
        double x = c * (1 - Math.Abs(h / 60 % 2 - 1));
        double mv = l - c / 2;
        (double r, double g, double b) = h switch
        {
            < 60  => (c, x, 0.0),
            < 120 => (x, c, 0.0),
            < 180 => (0.0, c, x),
            < 240 => (0.0, x, c),
            < 300 => (x, 0.0, c),
            _     => (c, 0.0, x)
        };
        return ((int)Math.Round((r + mv) * 255), (int)Math.Round((g + mv) * 255), (int)Math.Round((b + mv) * 255));
    }

    static (int R, int G, int B) CmykToRgb(List<double> nums)
    {
        if (nums.Count < 4) throw new Exception("CMYK needs 4 values (C M Y K)");
        double c = nums[0] / 100, m = nums[1] / 100, y = nums[2] / 100, k = nums[3] / 100;
        return (
            (int)Math.Round(255 * (1 - c) * (1 - k)),
            (int)Math.Round(255 * (1 - m) * (1 - k)),
            (int)Math.Round(255 * (1 - y) * (1 - k))
        );
    }

    public static (double H, double S, double L) RgbToHsl(int r, int g, int b)
    {
        double r1 = r / 255.0, g1 = g / 255.0, b1 = b / 255.0;
        double max   = Math.Max(r1, Math.Max(g1, b1));
        double min   = Math.Min(r1, Math.Min(g1, b1));
        double delta = max - min;
        double l     = (max + min) / 2;
        if (delta == 0) return (0, 0, l * 100);
        double s = delta / (1 - Math.Abs(2 * l - 1));
        double h;
        if      (max == r1) h = 60 * (((g1 - b1) / delta) % 6);
        else if (max == g1) h = 60 * (((b1 - r1) / delta) + 2);
        else                h = 60 * (((r1 - g1) / delta) + 4);
        if (h < 0) h += 360;
        return (h, s * 100, l * 100);
    }

    public static (double C, double M, double Y, double K) RgbToCmyk(int r, int g, int b)
    {
        double r1 = r / 255.0, g1 = g / 255.0, b1 = b / 255.0;
        double k  = 1 - Math.Max(r1, Math.Max(g1, b1));
        if (k >= 1) return (0, 0, 0, 100);
        double c = (1 - r1 - k) / (1 - k);
        double m = (1 - g1 - k) / (1 - k);
        double y = (1 - b1 - k) / (1 - k);
        return (c * 100, m * 100, y * 100, k * 100);
    }
}

// ── SQL Helper ────────────────────────────────────────────
static class SqlHelper
{
    static readonly string[] Keywords =
    [
        "SELECT", "DISTINCT", "FROM", "WHERE", "AND", "OR", "NOT",
        "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN",
        "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN", "CROSS JOIN", "JOIN",
        "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
        "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
        "CREATE TABLE", "DROP TABLE", "ALTER TABLE",
        "UNION ALL", "UNION", "WITH", "AS",
        "CASE", "WHEN", "THEN", "ELSE", "END"
    ];

    static readonly HashSet<string> Newline = new(StringComparer.OrdinalIgnoreCase)
    {
        "SELECT", "DISTINCT", "FROM", "WHERE", "AND", "OR",
        "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN",
        "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN", "CROSS JOIN", "JOIN",
        "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
        "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
        "UNION ALL", "UNION", "WITH"
    };

    public static string Format(string sql)
    {
        var normalized = Regex.Replace(sql.Trim(), @"\s+", " ");
        var pattern    = string.Join("|", Keywords.Select(k => $@"\b{Regex.Escape(k)}\b"));
        var result     = Regex.Replace(normalized, pattern, m =>
        {
            var kw = m.Value.ToUpper();
            return Newline.Contains(kw) ? $"\n{kw}" : kw;
        }, RegexOptions.IgnoreCase);
        return result.Trim();
    }
}
